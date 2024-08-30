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
}

function formatToken(name) {
  let className = camelCase(name);
  className = className.charAt(0).toUpperCase() + className.slice(1);
  return className;
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
