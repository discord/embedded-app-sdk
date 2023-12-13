import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// NOTE: building for prod will not work with a linked package
// You should install directly from the repo in order to make the build work
// if you need to get the package to use a modified version, one solution
// is to manually copy the build result into the node_modules here

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: '../../',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    hmr: {
      clientPort: 443,
    },
  },
});
