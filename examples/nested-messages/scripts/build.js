require('dotenv').config();
const {build} = require('esbuild');
const glob = require('glob');
const entryPoints = glob.globSync('./client/**/*.ts');

// Inject .env variables
const define = {};
for (const k in process.env) {
  if (!['CLIENT_SECRET'].includes(k)) {
    define[`process.env.${k}`] = JSON.stringify(process.env[k]);
  }
}

build({
  bundle: true,
  entryPoints,
  outbase: './client',
  outdir: './client',
  platform: 'browser',
  external: [],
  define,
});
