// @ts-check
import 'zx/globals';
import path from 'path';
import {parseSchema} from 'json-schema-to-zod';
import prettier from 'prettier';
import camelCase from 'lodash.camelcase';

const defaultBranch = 'main';
const branch = argv.branch ?? defaultBranch;
let jsonSchemaPath = argv.path;
if (jsonSchemaPath == null) {
  throw new Error('Expected -- --path argument.\nThis should point to the generated JSON Schema file.\nExample command below:\nnpm run sync -- --path path/to/monorepo/discord_common/js/packages/rpc-schema/generated/schema.json');
}
// Resolve absolute path
jsonSchemaPath = path.resolve(jsonSchemaPath);
const genDir = path.join(__dirname, '..', 'src', 'generated');
const schemaFilePath = path.join(genDir, 'schema.json');

main().catch((err) => {
  throw err;
});

async function main() {
  const pathExists = await fs.pathExists(jsonSchemaPath);
  if (!pathExists) {
    throw new Error(`Path "${jsonSchemaPath}" does not exist.`);
  }
  // Find root dir
  cd(path.dirname(jsonSchemaPath));
  const rootDir = (await $`git rev-parse --show-toplevel`).stdout.trim();
  cd(rootDir);
  // Parse checkout files and copy
  const filePath = path.relative(rootDir, jsonSchemaPath);
  let branchToCheckout = branch;
  // Fetch the latest upstream if using main
  if (branch === defaultBranch) {
    const branchRefName = await $`git rev-parse --symbolic-full-name ${branch}`;
    const upstreamBranchName = await $`git for-each-ref --format='%(upstream:short)' "${branchRefName}"`;
    branchToCheckout = upstreamBranchName.stdout.trimEnd();
    await $`git fetch ${branchToCheckout.split('/')}`;
  }
  await $`git checkout ${branchToCheckout} -- ${filePath}`;
  await fs.copyFile(filePath, schemaFilePath);
  // Restore the original file
  await $`git checkout HEAD -- ${filePath}`;

  // Generate Zod Schemas
  console.log('> Generating Zod Schemas');
  const schemas = JSON.parse(await fs.readFile(schemaFilePath, 'utf-8'));
  let zodSchemaCode = '';
  // Open brackets to code blocks
  let enumCode = `export enum Command {`;
  let schemaMapCode = `export const Schemas = {`;
  for (const [cmd, schema] of Object.entries(schemas)) {
    // Add command to Enum
    enumCode += `${cmd} = "${cmd}",`;
    // Add comment for this section
    zodSchemaCode += `// ${cmd}\n`;
    let reqSchema = null;
    let resSchema = null;
    const reqTokenName = formatToken(`${cmd}RequestSchema`);
    if (schema.request != null) {
      reqSchema = parseZodSchema(schema.request);
      zodSchemaCode += `export const ${reqTokenName} = ${reqSchema};`;
      zodSchemaCode += `export type ${formatToken(`${cmd}Request`)} = zInfer<typeof ${reqTokenName}>;`;
    }
    const resTokenName = formatToken(`${cmd}ResponseSchema`);
    if (schema.response != null) {
      resSchema = parseZodSchema(schema.response);
      zodSchemaCode += `export const ${resTokenName} = ${resSchema};`;
      zodSchemaCode += `export type ${formatToken(`${cmd}Response`)} = zInfer<typeof ${resTokenName}>;`;
    }
    // Add schemas to command map
    schemaMapCode += `[Command.${cmd}]: {
      request: ${schema.request == null ? 'emptyRequestSchema' : reqTokenName},
      response: ${schema.response == null ? 'emptyResponseSchema' : resTokenName},
    },`;
    // Line break between Commands
    zodSchemaCode += '\n\n';
  }
  // Close off code blocks
  enumCode += '}';
  schemaMapCode += '} as const';

  // Build output file
  const output = `
    /**
     * This file is generated.
     * Run "npm run sync" to regenerate file.
     * @generated
     */
    import { z, infer as zInfer } from 'zod';
    import {fallbackToDefault} from '../utils/zodUtils';
  
    ${zodSchemaCode}
  
    /**
     * RPC Commands which support schemas.
     */
    ${enumCode}
  
    const emptyResponseSchema = z.object({}).optional().nullable();
    const emptyRequestSchema = z.void();

    /**
     * Request & Response schemas for each supported RPC Command.
     */
    ${schemaMapCode}
  `;

  // Write to file and format with prettier
  const prettierOpts = await prettier.resolveConfig(__dirname);
  if (prettierOpts == null) {
    throw new Error('Unable to resolve prettier config');
  }
  prettierOpts.parser = 'typescript';
  const formattedCode = await prettier.format(output, prettierOpts);
  await fs.writeFile(path.join(genDir, 'schemas.ts'), formattedCode);

  // Auto-sync Commands enum and response parsing
  console.log('> Auto-syncing Commands enum and response parsing');
  await syncCommandsEnum(schemas);
  await syncResponseParsing(schemas);
  await syncCommandsIndex(schemas);
  await generateCommandFiles(schemas);
  await syncMockCommands(schemas);
}

function formatToken(name) {
  let className = camelCase(name);
  className = className.charAt(0).toUpperCase() + className.slice(1);
  return className;
}

async function syncCommandsEnum(schemas) {
  const commonPath = path.join(__dirname, '..', 'src', 'schema', 'common.ts');
  let content = await fs.readFile(commonPath, 'utf-8');
  
  // Find the Commands enum using sentinel comments
  const enumMatch = content.match(/(export enum Commands \{[\s\S]*?\/\/ START-GENERATED-SECTION\n)([\s\S]*?)(\/\/ END-GENERATED-SECTION)/);
  if (!enumMatch) {
    throw new Error('Could not find Commands enum with START-GENERATED-SECTION and END-GENERATED-SECTION sentinels in src/schema/common.ts. Please add these comments around the generated commands section.');
  }
  
  const generatedSection = enumMatch[2];
  
  // Extract existing commands from the generated section
  const existingCommands = new Set();
  const commandMatches = generatedSection.matchAll(/(\w+) = '(\w+)'/g);
  for (const match of commandMatches) {
    existingCommands.add(match[2]);
  }
  
  // Add any missing schema commands
  const newCommands = [];
  for (const cmd of Object.keys(schemas)) {
    if (!existingCommands.has(cmd)) {
      newCommands.push(`  ${cmd} = '${cmd}',`);
    }
  }
  
  if (newCommands.length > 0) {
    console.log(`> Adding ${newCommands.length} new commands to Commands enum:`, Object.keys(schemas).filter(cmd => !existingCommands.has(cmd)));
    
    // Insert new commands in the generated section
    const generatedContent = newCommands.join('\n');
    const updatedContent = enumMatch[1] + generatedContent + '\n  ' + enumMatch[3];
    content = content.replace(enumMatch[1] + enumMatch[2] + enumMatch[3], updatedContent);
    
    // Format and write back
    const prettierOpts = await prettier.resolveConfig(__dirname);
    prettierOpts.parser = 'typescript';
    const formattedContent = await prettier.format(content, prettierOpts);
    await fs.writeFile(commonPath, formattedContent);
  }
}

async function syncResponseParsing(schemas) {
  const responsesPath = path.join(__dirname, '..', 'src', 'schema', 'responses.ts');
  let content = await fs.readFile(responsesPath, 'utf-8');
  
  // Find the generated responses section using sentinel comments
  const sectionMatch = content.match(/(\/\/ START-GENERATED-SECTION\n)([\s\S]*?)(\/\/ END-GENERATED-SECTION)/);
  if (!sectionMatch) {
    throw new Error('Could not find generated responses section with START-GENERATED-SECTION and END-GENERATED-SECTION sentinels in src/schema/responses.ts. Please add these comments around the generated case statements.');
  }
  
  // Extract existing schema commands from generated section
  const existingSchemaCommands = new Set();
  const caseMatches = sectionMatch[2].matchAll(/case Commands\.(\w+):/g);
  for (const match of caseMatches) {
    existingSchemaCommands.add(match[1]);
  }
  
  // Find missing commands
  const missingCommands = [];
  for (const cmd of Object.keys(schemas)) {
    if (!existingSchemaCommands.has(cmd)) {
      missingCommands.push(cmd);
    }
  }
  
  if (missingCommands.length > 0) {
    console.log(`> Adding ${missingCommands.length} new commands to response parsing:`, missingCommands);
    
    // Add new case statements in the generated section
    const newCases = missingCommands.map(cmd => `    case Commands.${cmd}:`).join('\n');
    const updatedContent = sectionMatch[1] + newCases + '\n      ' + sectionMatch[3];
    content = content.replace(sectionMatch[1] + sectionMatch[2] + sectionMatch[3], updatedContent);
    
    // Format and write back  
    const prettierOpts = await prettier.resolveConfig(__dirname);
    prettierOpts.parser = 'typescript';
    const formattedContent = await prettier.format(content, prettierOpts);
    await fs.writeFile(responsesPath, formattedContent);
  }
}

async function syncCommandsIndex(schemas) {
  const indexPath = path.join(__dirname, '..', 'src', 'commands', 'index.ts');
  let content = await fs.readFile(indexPath, 'utf-8');
  
  // Find all sentinel pairs - first is imports, second is exports
  const sentinelMatches = [...content.matchAll(/(\/\/ START-GENERATED-SECTION\n)([\s\S]*?)(\/\/ END-GENERATED-SECTION)/g)];
  if (sentinelMatches.length !== 2) {
    throw new Error(`Expected exactly 2 START-GENERATED-SECTION/END-GENERATED-SECTION pairs in src/commands/index.ts, but found ${sentinelMatches.length}. Please add these comments around the imports and exports sections.`);
  }
  
  const [importsMatch, exportsMatch] = sentinelMatches;
  
  // Extract existing imports from generated section
  const existingImports = new Set();
  const importMatches = importsMatch[2].matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(\w+)'/g);
  for (const match of importMatches) {
    existingImports.add(match[2]); // file name without extension
  }
  
  // Extract existing exports from generated section
  const existingExports = new Set();
  const exportMatches = exportsMatch[2].matchAll(/(\w+):/g);
  for (const match of exportMatches) {
    existingExports.add(match[1]);
  }
  
  // Find missing commands and convert to camelCase
  const newImports = [];
  const newExports = [];
  for (const cmd of Object.keys(schemas)) {
    const camelCaseCmd = camelCase(cmd);
    const fileName = camelCase(cmd);
    
    if (!existingImports.has(fileName)) {
      newImports.push(`import {${camelCaseCmd}} from './${fileName}';`);
    }
    if (!existingExports.has(camelCaseCmd)) {
      newExports.push(`    ${camelCaseCmd}: ${camelCaseCmd}(sendCommand),`);
    }
  }
  
  let hasChanges = false;
  
  // Add missing imports
  if (newImports.length > 0) {
    console.log(`> Adding ${newImports.length} new imports to index.ts:`, newImports.map(imp => imp.match(/from '\.\/(\w+)'/)[1]));
    const updatedImports = importsMatch[1] + newImports.join('\n') + '\n' + importsMatch[3];
    content = content.replace(importsMatch[1] + importsMatch[2] + importsMatch[3], updatedImports);
    hasChanges = true;
  }
  
  // Add missing exports
  if (newExports.length > 0) {
    console.log(`> Adding ${newExports.length} new exports to index.ts:`, newExports.map(exp => exp.match(/(\w+):/)[1]));
    const updatedExports = exportsMatch[1] + newExports.join('\n') + '\n    ' + exportsMatch[3];
    content = content.replace(exportsMatch[1] + exportsMatch[2] + exportsMatch[3], updatedExports);
    hasChanges = true;
  }
  
  // Write back if there are changes
  if (hasChanges) {
    const prettierOpts = await prettier.resolveConfig(__dirname);
    prettierOpts.parser = 'typescript';
    const formattedContent = await prettier.format(content, prettierOpts);
    await fs.writeFile(indexPath, formattedContent);
  }
}

async function generateCommandFiles(schemas) {
  const commandsDir = path.join(__dirname, '..', 'src', 'commands');
  
  for (const cmd of Object.keys(schemas)) {
    const camelCaseCmd = camelCase(cmd);
    const fileName = `${camelCaseCmd}.ts`;
    const filePath = path.join(commandsDir, fileName);
    
    // Only create file if it doesn't exist
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      console.log(`> Generating command file: ${fileName}`);
      
      const fileContent = `import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const ${camelCaseCmd} = schemaCommandFactory(Command.${cmd});
`;
      
      await fs.writeFile(filePath, fileContent);
    }
  }
}

async function syncMockCommands(schemas) {
  const mockPath = path.join(__dirname, '..', 'src', 'mock.ts');
  let content = await fs.readFile(mockPath, 'utf-8');
  
  // Find the generated section using sentinel comments
  const sectionMatch = content.match(/(\/\/ START-GENERATED-SECTION\n)([\s\S]*?)(\/\/ END-GENERATED-SECTION)/);
  if (!sectionMatch) {
    throw new Error('Could not find START-GENERATED-SECTION and END-GENERATED-SECTION sentinels in src/mock.ts. Please add these comments around the generated mock commands section.');
  }
  
  // Extract existing mock commands from generated section
  const existingMocks = new Set();
  const mockMatches = sectionMatch[2].matchAll(/(\w+):\s*\(\)/g);
  for (const match of mockMatches) {
    existingMocks.add(match[1]);
  }
  
  // Find missing commands and add basic mocks
  const newMocks = [];
  for (const cmd of Object.keys(schemas)) {
    const camelCaseCmd = camelCase(cmd);
    if (!existingMocks.has(camelCaseCmd)) {
      // Generate a basic mock that returns a resolved promise with a simple structure
      const mockFunction = `  ${camelCaseCmd}: () => Promise.resolve(null),`;
      newMocks.push(mockFunction);
    }
  }
  
  if (newMocks.length > 0) {
    console.log(`> Adding ${newMocks.length} new mock commands:`, newMocks.map(mock => mock.match(/(\w+):/)[1]));
    
    // Add new mocks to the generated section
    const currentGenerated = sectionMatch[2].trim();
    const newContent = currentGenerated ? currentGenerated + '\n' + newMocks.join('\n') : newMocks.join('\n');
    const updatedContent = sectionMatch[1] + newContent + '\n  ' + sectionMatch[3];
    content = content.replace(sectionMatch[1] + sectionMatch[2] + sectionMatch[3], updatedContent);
    
    // Format and write back
    const prettierOpts = await prettier.resolveConfig(__dirname);
    prettierOpts.parser = 'typescript';
    const formattedContent = await prettier.format(content, prettierOpts);
    await fs.writeFile(mockPath, formattedContent);
  }
}

function parseZodSchema(code) {
  return (
    parseSchema(code)
      // Remove never types until this bug is fixed:
      // https://github.com/StefanTerdell/json-schema-to-zod/issues/67
      // @ts-ignore
      .replaceAll('.catchall(z.never())', '')
      // Avoid strict so that we can be forwards compatible with new keys
      .replaceAll('.strict()', '')
      // For forwards compatibility, include an "unhandled" value (-1) for enums
      // which will be defaulted to if zod validation fails.
      .replaceAll(/z.enum\(([^)]*)\)/g, 'fallbackToDefault(z.enum($1).or(z.literal(-1)).default(-1))')
      // Remove describe metadata annotation since they don't add anything useful to the Zod type.
      // Would be good to extract these into a doc comment in the future.
      .replaceAll(/\.describe\(['"][\w\s.]+['"]\)/g, '')
  );
}
