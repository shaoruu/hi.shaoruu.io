import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env': env,
    },
    server: {
      port: 3001,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    clearScreen: false,
    plugins: [react(), ViteImageOptimizer()],
  };
});
