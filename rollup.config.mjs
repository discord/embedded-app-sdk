import typescript from '@rollup/plugin-typescript';
import {join} from 'path';
import pkg from './package.json';

const srcDir = join(__dirname, 'src');
const outDir = 'output';

/**
 * Builds a rollup config for esm or cjs
 *
 * @type {(format: 'cjs' | 'esm') => import('rollup').RollupOptions}
 */
function buildConfig(format) {
  return {
    //external: ['zod', 'lodash.transform', 'events', 'uuid'],
    input: 'src/index.ts',
    output: {
      dir: outDir,
      format,
      name: 'DiscordSDK',
      preserveModules: true,
      exports: 'named',
      entryFileNames(chunk) {
        const ext = format == 'cjs' ? 'cjs' : 'mjs';
        // Flatten src dir so output is `output/index.js`
        // instead of `ouput/src/index.js`.
        if (chunk.facadeModuleId.startsWith(srcDir)) {
          const name = chunk.name.replace(/^src\//, '');
          return `${name}.${ext}`;
        }
        // Since node modules are bundled, renamed the output
        // directory so it doesn't clash with node_modules semantics.
        if (chunk.facadeModuleId.includes('node_modules/')) {
          const name = chunk.name
            .replaceAll('node_modules/', 'lib/')
            // Also remove the .pnpm prefix if present
            .replace('.pnpm/', '');
          return `${name}.${ext}`;
        }

        return `[name].${ext}`;
      },
    },
    external: [
      // All dependencies are external (aka imported from node_modules)
      ...Object.keys(pkg.dependencies),
    ],
    onwarn(warning, warn) {
      // Throw an error on unresolved dependencies (not listed in package json)
      if (warning.code === 'UNRESOLVED_IMPORT')
        throw new Error(`${warning.message}.
  Make sure this dependency is listed in the package.json
      `);

      // Use default for everything else
      warn(warning);
    },
    plugins: [
      typescript({
        declaration: true,
        outDir: outDir,
      }),
    ],
  };
}

export default [buildConfig('cjs'), buildConfig('esm')];
