// @ts-check
import 'zx/globals';
import path from 'path';
import {jsonSchemaToZod, parseSchema} from 'json-schema-to-zod';
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

// File paths
const PATHS = {
  common: path.join(__dirname, '..', 'src', 'schema', 'common.ts'),
  responses: path.join(__dirname, '..', 'src', 'schema', 'responses.ts'),
  index: path.join(__dirname, '..', 'src', 'commands', 'index.ts'),
  mock: path.join(__dirname, '..', 'src', 'mock.ts'),
  events: path.join(__dirname, '..', 'src', 'schema', 'events.ts'),
  commandsDir: path.join(__dirname, '..', 'src', 'commands'),
};

// Matches json-schema-to-zod's output for an enum of numbers (and null), e.g. z.union([z.literal(1), z.literal(null)])
const NUMERIC_ENUM_REGEX = /z\.union\(\[((?:z\.literal\((?:-?\d+(?:\.\d+)?|null)\)(?:, )?)+)\]\)/g;

// SDK method names which don't match the camelCased RPC command name
/** @type {Record<string, string>} */
const COMMAND_NAME_OVERRIDES = {
  ENCOURAGE_HW_ACCELERATION: 'encourageHardwareAcceleration',
  GET_ENTITLEMENTS_EMBEDDED: 'getEntitlements',
  GET_SKUS_EMBEDDED: 'getSkus',
};

// Templates
/**
 * @param {string} cmdName - camelCase command name
 * @param {string} cmd - Original command name
 */
const COMMAND_FILE_TEMPLATE = (cmdName, cmd) => `import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const ${cmdName} = schemaCommandFactory(Command.${cmd});
`;

// Helper Functions
/**
 * @param {string} filePath - Path to write the file
 * @param {string} content - File content to format and write
 * @param {string} [parser] - Prettier parser to format with
 */
async function formatAndWriteFile(filePath, content, parser = 'typescript') {
  const prettierOpts = await prettier.resolveConfig(__dirname);
  if (prettierOpts == null) {
    throw new Error('Unable to resolve prettier config');
  }
  prettierOpts.parser = parser;
  const formattedContent = await prettier.format(content, prettierOpts);
  await fs.writeFile(filePath, formattedContent);
}

/**
 * Keeps only the commands or events flagged with `embeddedAppSDK: true` in rpc-schema's definitions,
 * and strips the flag so the synced schema only contains their schemas.
 *
 * @param {Record<string, any>} allSchemas - Command or event schema definitions from the monorepo JSON
 * @param {'commands' | 'events'} kind - Which section of the schema these are
 * @param {Record<string, any> | undefined} previous - The same section from the previously synced schema
 * @returns {Record<string, any>} Schemas exposed in the SDK
 */
function filterEmbeddedAppSDKSchemas(allSchemas, kind, previous) {
  const entries = Object.entries(allSchemas);
  if (!entries.some(([, schema]) => 'embeddedAppSDK' in schema)) {
    throw new Error(`No ${kind} in the JSON Schema have an "embeddedAppSDK" flag.`);
  }

  /** @type {Record<string, any>} */
  const schemas = {};
  for (const [name, {embeddedAppSDK, ...schema}] of entries) {
    if (embeddedAppSDK) {
      schemas[name] = schema;
    }
  }

  // Warn when a previously synced command is no longer exposed, since its hand-maintained
  // command file and mock are not removed automatically.
  const removed = Object.keys(previous ?? {}).filter((name) => !(name in schemas));
  if (removed.length > 0 && kind === 'commands') {
    console.warn(
      `> WARNING: ${removed.length} command(s) are no longer flagged embeddedAppSDK and were removed from the schema:`,
      removed,
      '\n  Delete their files in src/commands/ and entries in src/mock.ts if they should no longer be exposed.',
    );
  } else if (removed.length > 0) {
    console.warn(
      `> WARNING: ${removed.length} event(s) are no longer flagged embeddedAppSDK and were removed from the schema:`,
      removed,
    );
  }

  console.log(`> Exposing ${Object.keys(schemas).length} of ${entries.length} ${kind} flagged embeddedAppSDK`);
  return schemas;
}

/**
 * @param {string} content - File content to search
 * @param {string} filePath - File path for error messages
 * @param {number} expectedCount - Expected number of sentinel pairs
 * @returns {RegExpMatchArray[]} Matches, one per sentinel pair
 */
function findSentinelSections(content, filePath, expectedCount = 1) {
  const matches = [...content.matchAll(SENTINEL_REGEX)];
  if (matches.length !== expectedCount) {
    throw createSentinelError(filePath, expectedCount, matches.length);
  }
  return matches;
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
    camelCase: COMMAND_NAME_OVERRIDES[cmd] ?? camelCase(cmd),
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
  const allSchemas = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  // Restore the original file
  await $`git checkout HEAD -- ${filePath}`;

  const previous = (await fs.pathExists(schemaFilePath))
    ? JSON.parse(await fs.readFile(schemaFilePath, 'utf-8'))
    : {};
  const schemas = filterEmbeddedAppSDKSchemas(allSchemas.commands, 'commands', previous.commands);
  const eventSchemas = filterEmbeddedAppSDKSchemas(allSchemas.events, 'events', previous.events);
  await formatAndWriteFile(schemaFilePath, JSON.stringify({commands: schemas, events: eventSchemas}), 'json');

  // Generate Zod Schemas
  console.log('> Generating Zod Schemas');
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

  let eventSchemaMapCode = `export const EventSchemas = {`;
  for (const [evt, schema] of Object.entries(eventSchemas)) {
    zodSchemaCode += `// ${evt}\n`;
    eventSchemaMapCode += `${evt}: {`;
    if (schema.subscribeArgs != null) {
      const tokenName = formatToken(`${evt}SubscribeArgsSchema`);
      zodSchemaCode += `export const ${tokenName} = ${parseZodSchema(schema.subscribeArgs)};`;
      zodSchemaCode += `export type ${formatToken(`${evt}SubscribeArgs`)} = zInfer<typeof ${tokenName}>;`;
      eventSchemaMapCode += `subscribeArgs: ${tokenName},`;
    }
    const payloadTokenName = formatToken(`${evt}PayloadSchema`);
    zodSchemaCode += `export const ${payloadTokenName} = ${parseZodSchema(schema.payload)};`;
    zodSchemaCode += `export type ${formatToken(`${evt}Payload`)} = zInfer<typeof ${payloadTokenName}>;`;
    eventSchemaMapCode += `payload: ${payloadTokenName},`;
    eventSchemaMapCode += '},';
    zodSchemaCode += '\n\n';
  }
  eventSchemaMapCode += '} as const';

  // Only import the zodUtils helpers the generated schemas actually use
  const zodUtilsImports = ['fallbackToDefault', 'zodUnionWithUnhandled'].filter((name) => zodSchemaCode.includes(`${name}(`));

  // Build output file
  const output = `
    /**
     * This file is generated.
     * Run "npm run sync" to regenerate file.
     * @generated
     */
    import { z, infer as zInfer } from 'zod';
    ${zodUtilsImports.length > 0 ? `import {${zodUtilsImports.join(', ')}} from '../utils/zodUtils';` : ''}
  
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

    /**
     * Subscribe args & payload schemas for each supported RPC Event.
     */
    ${eventSchemaMapCode}
  `;

  // Write to file and format with prettier
  await formatAndWriteFile(path.join(genDir, 'schemas.ts'), output);

  // Auto-sync Commands enum and response parsing
  console.log('> Auto-syncing Commands enum and response parsing');
  await syncCommandsEnum(schemas);
  await syncResponseParsing(schemas);
  await syncCommandsIndex(schemas);
  await generateCommandFiles(schemas);
  await syncMockCommands(schemas);
  await syncEvents(eventSchemas);
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

  const [fullMatch, beforeSection, , afterSection] = enumMatch;

  // Generate ALL schema commands (sorted alphabetically)
  const allCommandEntries = Object.keys(schemas).sort().map((cmd) => `  ${cmd} = '${cmd}',`);
  
  console.log(`> Syncing ${allCommandEntries.length} commands in Commands enum`);

  // Replace entire generated section
  const updatedContent = beforeSection + allCommandEntries.join('\n') + '\n  ' + afterSection;
  const updatedFile = content.replace(fullMatch, updatedContent);
  
  await formatAndWriteFile(PATHS.common, updatedFile);
}

/**
 * @param {Record<string, any>} schemas - Schema definitions from JSON
 */
async function syncResponseParsing(schemas) {
  const content = await fs.readFile(PATHS.responses, 'utf-8');

  const [[fullMatch, beforeSection, , afterSection]] = findSentinelSections(content, PATHS.responses);

  // Generate ALL schema case statements (sorted alphabetically)
  const allCaseStatements = Object.keys(schemas).sort().map((cmd) => `    case Commands.${cmd}:`);
  
  console.log(`> Syncing ${allCaseStatements.length} commands in response parsing`);

  // Replace entire generated section
  const updatedContent = beforeSection + allCaseStatements.join('\n') + '\n      ' + afterSection;
  const updatedFile = content.replace(fullMatch, updatedContent);
  
  await formatAndWriteFile(PATHS.responses, updatedFile);
}

/**
 * @param {Record<string, any>} schemas - Schema definitions from JSON
 */
async function syncCommandsIndex(schemas) {
  let content = await fs.readFile(PATHS.index, 'utf-8');

  const [importsMatch, exportsMatch] = findSentinelSections(content, PATHS.index, 2);

  // Generate ALL schema imports and exports (sorted alphabetically)
  const allCommands = Object.keys(schemas).sort().map(getCommandNames);
  
  const allImports = allCommands.map(({camelCase}) => `import {${camelCase}} from './${camelCase}';`);
  const allExports = allCommands.map(({camelCase}) => `    ${camelCase}: ${camelCase}(sendCommand),`);

  console.log(`> Syncing ${allCommands.length} commands in index.ts`);

  // Replace entire imports section
  const updatedImports = importsMatch[1] + allImports.join('\n') + '\n' + importsMatch[3];
  content = content.replace(importsMatch[0], updatedImports);

  // Replace entire exports section
  const updatedExports = exportsMatch[1] + allExports.join('\n') + '\n    ' + exportsMatch[3];
  content = content.replace(exportsMatch[0], updatedExports);

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

  const [[fullMatch, beforeSection, generatedSection, afterSection]] = findSentinelSections(content, PATHS.mock);

  // Extract existing mock commands from generated section
  const existingMocks = extractExistingItems(generatedSection, /(\w+):\s*\(\)/g);

  // Find missing commands (sorted alphabetically)
  const missingCommands = Object.keys(schemas)
    .sort()
    .map(getCommandNames)
    .filter(({camelCase}) => !existingMocks.has(camelCase));
  if (missingCommands.length === 0) return;

  console.log(`> Adding ${missingCommands.length} new mock commands:`, missingCommands.map(c => c.camelCase));

  // Generate basic mock functions for missing commands only
  const newMockFunctions = missingCommands.map(({camelCase}) => `  ${camelCase}: () => Promise.resolve(null),`);

  const currentContent = generatedSection.trim();
  const newContent = currentContent ? currentContent + '\n' + newMockFunctions.join('\n') : newMockFunctions.join('\n');
  const updatedContent = beforeSection + newContent + '\n  ' + afterSection;

  const updatedFile = content.replace(fullMatch, updatedContent);
  await formatAndWriteFile(PATHS.mock, updatedFile);
}

/**
 *
 * @param {Record<string, any>} eventSchemas - Event schema definitions from JSON
 */
async function syncEvents(eventSchemas) {
  let content = await fs.readFile(PATHS.events, 'utf-8');

  const [enumMatch, schemaMatch] = findSentinelSections(content, PATHS.events, 2);

  const events = Object.keys(eventSchemas).sort();
  const enumEntries = events.map((evt) => `  ${evt} = '${evt}',`);
  const schemaEntries = events.map((evt) => {
    const subscribeArgs =
      eventSchemas[evt].subscribeArgs != null ? `subscribeArgs: GeneratedEventSchemas.${evt}.subscribeArgs,` : '';
    return `  [Events.${evt}]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.${evt}),
      data: GeneratedEventSchemas.${evt}.payload,
    }),
    ${subscribeArgs}
  },`;
  });

  console.log(`> Syncing ${events.length} events in events.ts`);

  content = content.replace(enumMatch[0], enumMatch[1] + enumEntries.join('\n') + '\n  ' + enumMatch[3]);
  content = content.replace(schemaMatch[0], schemaMatch[1] + schemaEntries.join('\n') + '\n  ' + schemaMatch[3]);

  await formatAndWriteFile(PATHS.events, content);
}

/**
 * @param {any} member - JSON schema for one member of an `anyOf`
 * @returns {boolean} Whether the member is an object with a constant numeric `type`
 */
function isDiscriminatedMember(member) {
  return member != null && member.type === 'object' && typeof member.properties?.type?.const === 'number';
}

/**
 * Unions of objects discriminated by a constant numeric `type` (e.g. embedded surfaces) fall back to `{type: -1}`
 * for unknown members, so a type added in a newer Discord client doesn't fail the whole response.
 *
 * @type {import('json-schema-to-zod').ParserOverride}
 */
function parseDiscriminatedUnionOverride(schema, refs) {
  const members = schema.anyOf;
  if (!Array.isArray(members) || members.length < 2) return undefined;
  if (!members.every(isDiscriminatedMember)) return undefined;
  // Same recursion as json-schema-to-zod's own anyOf parser, so nested overrides and `seen` tracking still apply
  const parsedMembers = members.map((member, i) => parseSchema(member, {...refs, path: [...refs.path, 'anyOf', i]}));
  return `zodUnionWithUnhandled([${parsedMembers.join(', ')}])`;
}

/**
 * Objects with a `.default(...)` in rpc-schema fall back to that default whenever the value doesn't parse (e.g. an
 * older client that returns nothing, which arrives as `null`). Zod's own `.default()` only covers `undefined`.
 *
 * @type {import('json-schema-to-zod').ParserOverride}
 */
function parseObjectDefaultOverride(schema, refs) {
  const isObject = schema.type === 'object' || (Array.isArray(schema.type) && schema.type.includes('object'));
  if (!isObject || !('default' in schema)) {
    return undefined;
  }
  const {default: defaultValue, ...schemaWithoutDefault} = schema;
  return `fallbackToDefault(${parseSchema(schemaWithoutDefault, refs)}.default(${JSON.stringify(defaultValue)}))`;
}

/**
 * Strings marked with `.meta({format: 'bigint'})` in rpc-schema carry a bigint over the wire. Web clients send a
 * bigint where the engine supports BigInt and the decimal string otherwise; mobile's JSON bridge always sends the
 * decimal string. Both are passed through unchanged; PermissionUtils and BigFlagUtils accept either.
 *
 * @type {import('json-schema-to-zod').ParserOverride}
 */
function parseBigIntOverride(schema) {
  if (schema.format !== 'bigint') return undefined;
  const bigIntSchema = 'z.bigint().or(z.string())';
  const nullable = Array.isArray(schema.type) && schema.type.includes('null');
  return nullable ? `${bigIntSchema}.nullable()` : bigIntSchema;
}

/**
 * @param {import('json-schema-to-zod').JsonSchema} schema - JSON schema to convert
 * @returns {string} Converted Zod schema code
 */
function parseZodSchema(schema) {
  return (
    jsonSchemaToZod(schema, {
      parserOverride: (node, refs) =>
        parseBigIntOverride(node, refs) ??
        parseDiscriminatedUnionOverride(node, refs) ??
        parseObjectDefaultOverride(node, refs),
    })
      // Remove never types until this bug is fixed:
      // https://github.com/StefanTerdell/json-schema-to-zod/issues/67
      // @ts-ignore
      .replaceAll('.catchall(z.never())', '')
      // Avoid strict so that we can be forwards compatible with new keys
      .replaceAll('.strict()', '')
      // For forwards compatibility, include an "unhandled" value (-1) for enums
      // which will be defaulted to if zod validation fails.
      .replaceAll(/z.enum\(([^)]*)\)/g, 'fallbackToDefault(z.enum($1).or(z.literal(-1)).default(-1))')
      // Numeric enums are emitted as a union of literals rather than z.enum, so they need the same fallback.
      .replaceAll(NUMERIC_ENUM_REGEX, (match, literals) =>
        /z\.literal\(-?\d/.test(literals) ? `fallbackToDefault(z.union([${literals}]).or(z.literal(-1)).default(-1))` : match,
      )
      // Remove describe metadata annotation since they don't add anything useful to the Zod type.
      // Would be good to extract these into a doc comment in the future.
      .replaceAll(/\.describe\((?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\)/g, '')
  );
}
