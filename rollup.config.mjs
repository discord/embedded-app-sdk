import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {join} from 'path';

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
            // Also remove the .npm prefix if present
            .replace('.npm/', '');
          return `${name}.${ext}`;
        }

        return `[name].${ext}`;
      },
    },
    plugins: [
      // i dont want to include the node modules
      // but it's causing issues
      nodeResolve({
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({
        declaration: true,
        outDir: outDir,
      }),
      json(),
    ],
  };
}

export default [buildConfig('cjs'), buildConfig('esm')];
