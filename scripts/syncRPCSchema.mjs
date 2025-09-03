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
  throw new Error(
    'Expected -- --path argument.\nThis should point to the generated JSON Schema file.\nExample command below:\nnpm run sync -- --path path/to/monorepo/discord_common/js/packages/rpc-schema/generated/schema.json',
  );
}
// Resolve absolute path
jsonSchemaPath = path.resolve(jsonSchemaPath);
const genDir = path.join(__dirname, '..', 'src', 'generated');
const schemaFilePath = path.join(genDir, 'schema.json');

// Constants for generated sections
const GENERATED_SECTION_START = '// START-GENERATED-SECTION';
const GENERATED_SECTION_END = '// END-GENERATED-SECTION';
const SENTINEL_REGEX = /(\/\/ START-GENERATED-SECTION\n)([\s\S]*?)(\/\/ END-GENERATED-SECTION)/g;
const SENTINEL_REGEX_SINGLE = /(\/\/ START-GENERATED-SECTION\n)([\s\S]*?)(\/\/ END-GENERATED-SECTION)/;

// File paths
const PATHS = {
  common: path.join(__dirname, '..', 'src', 'schema', 'common.ts'),
  responses: path.join(__dirname, '..', 'src', 'schema', 'responses.ts'),
  index: path.join(__dirname, '..', 'src', 'commands', 'index.ts'),
  mock: path.join(__dirname, '..', 'src', 'mock.ts'),
  commandsDir: path.join(__dirname, '..', 'src', 'commands'),
};

// Templates
const COMMAND_FILE_TEMPLATE = (cmdName, cmd) => `import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const ${cmdName} = schemaCommandFactory(Command.${cmd});
`;

// Helper Functions
/**
 * @param {string} filePath - Path to write the file
 * @param {string} content - File content to format and write
 */
async function formatAndWriteFile(filePath, content) {
  const prettierOpts = await prettier.resolveConfig(__dirname);
  prettierOpts.parser = 'typescript';
  const formattedContent = await prettier.format(content, prettierOpts);
  await fs.writeFile(filePath, formattedContent);
}

/**
 * @param {string} content - File content to search
 * @param {string} filePath - File path for error messages
 * @param {number} expectedCount - Expected number of sentinel pairs
 * @returns {RegExpMatchArray | RegExpMatchArray[]} Single match or array of matches
 */
function findSentinelSections(content, filePath, expectedCount = 1) {
  const matches = [...content.matchAll(SENTINEL_REGEX)];
  if (matches.length !== expectedCount) {
    throw createSentinelError(filePath, expectedCount, matches.length);
  }
  return expectedCount === 1 ? matches[0] : matches;
}

/**
 * @param {string} filePath - File path for error message
 * @param {number} expected - Expected number of sentinels
 * @param {number} found - Actual number found
 * @returns {Error} Descriptive error with guidance
 */
function createSentinelError(filePath, expected, found) {
  return new Error(
    `Expected exactly ${expected} ${GENERATED_SECTION_START}/${GENERATED_SECTION_END} pair(s) in ${filePath}, but found ${found}. ` +
      'Please add these comments around the generated sections.',
  );
}

/**
 * @param {string} cmd - Command name to convert
 * @returns {{camelCase: string, original: string}} Command names in different formats
 */
function getCommandNames(cmd) {
  return {
    camelCase: camelCase(cmd),
    original: cmd,
  };
}

/**
 * @param {string} content - Content to search in
 * @param {RegExp} regex - Regex pattern to match
 * @returns {Set<string>} Set of extracted items
 */
function extractExistingItems(content, regex) {
  const existing = new Set();
  const matches = content.matchAll(regex);
  for (const match of matches) {
    existing.add(match[1]);
  }
  return existing;
}

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

/**
 * @param {string} name - Token name to format
 * @returns {string} Formatted class name
 */
function formatToken(name) {
  let className = camelCase(name);
  className = className.charAt(0).toUpperCase() + className.slice(1);
  return className;
}

/**
 * @param {Record<string, any>} schemas - Schema definitions from JSON
 */
async function syncCommandsEnum(schemas) {
  const content = await fs.readFile(PATHS.common, 'utf-8');

  // Find the Commands enum using sentinel comments
  const enumRegex =
    /(export enum Commands \{[\s\S]*?\/\/ START-GENERATED-SECTION\n)([\s\S]*?)(\/\/ END-GENERATED-SECTION)/;
  const enumMatch = content.match(enumRegex);
  if (!enumMatch) {
    throw new Error(
      `Could not find Commands enum with ${GENERATED_SECTION_START}/${GENERATED_SECTION_END} sentinels in ${PATHS.common}`,
    );
  }

  const [fullMatch, beforeSection, generatedSection, afterSection] = enumMatch;

  // Extract existing commands from the generated section
  const existingCommands = extractExistingItems(generatedSection, /(\w+) = '(\w+)'/g);

  // Find missing schema commands (sorted alphabetically)
  const missingCommands = Object.keys(schemas).sort().filter((cmd) => !existingCommands.has(cmd));
  if (missingCommands.length === 0) return;

  console.log(`> Adding ${missingCommands.length} new commands to Commands enum:`, missingCommands);

  // Generate new command entries
  const newCommandEntries = missingCommands.map((cmd) => `  ${cmd} = '${cmd}',`);
  const updatedContent = beforeSection + newCommandEntries.join('\n') + '\n  ' + afterSection;

  const updatedFile = content.replace(fullMatch, updatedContent);
  await formatAndWriteFile(PATHS.common, updatedFile);
}

/**
 * @param {Record<string, any>} schemas - Schema definitions from JSON
 */
async function syncResponseParsing(schemas) {
  const content = await fs.readFile(PATHS.responses, 'utf-8');

  const [fullMatch, beforeSection, generatedSection, afterSection] = findSentinelSections(content, PATHS.responses);

  // Extract existing schema commands from generated section
  const existingCommands = extractExistingItems(generatedSection, /case Commands\.(\w+):/g);

  // Find missing commands (sorted alphabetically)
  const missingCommands = Object.keys(schemas).sort().filter((cmd) => !existingCommands.has(cmd));
  if (missingCommands.length === 0) return;

  console.log(`> Adding ${missingCommands.length} new commands to response parsing:`, missingCommands);

  // Generate new case statements
  const newCaseStatements = missingCommands.map((cmd) => `    case Commands.${cmd}:`);
  const updatedContent = beforeSection + newCaseStatements.join('\n') + '\n      ' + afterSection;

  const updatedFile = content.replace(fullMatch, updatedContent);
  await formatAndWriteFile(PATHS.responses, updatedFile);
}

/**
 * @param {Record<string, any>} schemas - Schema definitions from JSON
 */
async function syncCommandsIndex(schemas) {
  let content = await fs.readFile(PATHS.index, 'utf-8');

  const [importsMatch, exportsMatch] = findSentinelSections(content, PATHS.index, 2);

  // Extract existing items from generated sections
  const existingImports = extractExistingItems(importsMatch[2], /import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(\w+)'/g);
  const existingExports = extractExistingItems(exportsMatch[2], /(\w+):/g);

  // Find missing commands (sorted alphabetically)
  const missingCommands = Object.keys(schemas)
    .sort()
    .map(getCommandNames)
    .filter(({camelCase}) => !existingImports.has(camelCase) || !existingExports.has(camelCase));
  if (missingCommands.length === 0) return;

  console.log(
    `> Syncing ${missingCommands.length} commands in index.ts:`,
    missingCommands.map((c) => c.camelCase),
  );

  // Generate imports and exports for missing commands
  const newImports = missingCommands
    .filter(({camelCase}) => !existingImports.has(camelCase))
    .map(({camelCase}) => `import {${camelCase}} from './${camelCase}';`);

  const newExports = missingCommands
    .filter(({camelCase}) => !existingExports.has(camelCase))
    .map(({camelCase}) => `    ${camelCase}: ${camelCase}(sendCommand),`);

  // Update imports section
  if (newImports.length > 0) {
    const updatedImports = importsMatch[1] + newImports.join('\n') + '\n' + importsMatch[3];
    content = content.replace(importsMatch[0], updatedImports);
  }

  // Update exports section
  if (newExports.length > 0) {
    const updatedExports = exportsMatch[1] + newExports.join('\n') + '\n    ' + exportsMatch[3];
    content = content.replace(exportsMatch[0], updatedExports);
  }

  await formatAndWriteFile(PATHS.index, content);
}

/**
 * @param {Record<string, any>} schemas - Schema definitions from JSON
 */
async function generateCommandFiles(schemas) {
  const commandsToGenerate = [];

  for (const cmd of Object.keys(schemas).sort()) {
    const {camelCase: cmdName} = getCommandNames(cmd);
    const filePath = path.join(PATHS.commandsDir, `${cmdName}.ts`);

    const exists = await fs.pathExists(filePath);
    if (!exists) {
      commandsToGenerate.push({cmd, cmdName, filePath});
    }
  }

  if (commandsToGenerate.length === 0) return;

  console.log(
    `> Generating ${commandsToGenerate.length} command files:`,
    commandsToGenerate.map((c) => c.cmdName),
  );

  // Generate all files
  await Promise.all(
    commandsToGenerate.map(({cmd, cmdName, filePath}) => fs.writeFile(filePath, COMMAND_FILE_TEMPLATE(cmdName, cmd))),
  );
}

/**
 * @param {Record<string, any>} schemas - Schema definitions from JSON
 */
async function syncMockCommands(schemas) {
  const content = await fs.readFile(PATHS.mock, 'utf-8');

  const [fullMatch, beforeSection, generatedSection, afterSection] = findSentinelSections(content, PATHS.mock);

  // Extract existing mock commands from generated section
  const existingMocks = extractExistingItems(generatedSection, /(\w+):\s*\(\)/g);

  // Find missing commands (sorted alphabetically)
  const missingCommands = Object.keys(schemas)
    .sort()
    .map(getCommandNames)
    .filter(({camelCase}) => !existingMocks.has(camelCase));
  if (missingCommands.length === 0) return;

  console.log(
    `> Adding ${missingCommands.length} new mock commands:`,
    missingCommands.map((c) => c.camelCase),
  );

  // Generate basic mock functions
  const newMockFunctions = missingCommands.map(({camelCase}) => `  ${camelCase}: () => Promise.resolve(null),`);

  const currentContent = generatedSection.trim();
  const newContent = currentContent ? currentContent + '\n' + newMockFunctions.join('\n') : newMockFunctions.join('\n');
  const updatedContent = beforeSection + newContent + '\n  ' + afterSection;

  const updatedFile = content.replace(fullMatch, updatedContent);
  await formatAndWriteFile(PATHS.mock, updatedFile);
}

/**
 * @param {string} code - JSON schema code to parse
 * @returns {string} Converted Zod schema code
 */
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
