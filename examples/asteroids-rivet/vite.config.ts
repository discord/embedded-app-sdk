import { defineConfig } from "vite";

import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";
import EnvironmentPlugin from 'vite-plugin-environment';

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        nodePolyfills({ globals: { Buffer: true } }),
        EnvironmentPlugin(['RIVET_TOKEN', 'RIVET_API_ENDPOINT']),
    ],
    build: {
        outDir: "./build/client/",
        emptyOutDir: true,
    },
});
