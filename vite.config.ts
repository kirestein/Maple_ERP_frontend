import { defineConfig, loadEnv } from 'vite';
import { angular } from '@analogjs/vite-plugin-angular';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [angular()],
    define: {
      // Make env variables available to the app
      'import.meta.env.VITE_API_URL_DEV': JSON.stringify(env.VITE_API_URL_DEV),
      'import.meta.env.VITE_API_URL_PROD': JSON.stringify(env.VITE_API_URL_PROD),
      'import.meta.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME),
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(env.VITE_APP_VERSION),
      'import.meta.env.VITE_APP_ENVIRONMENT': JSON.stringify(env.VITE_APP_ENVIRONMENT),
      'import.meta.env.VITE_ENABLE_DEBUG_LOGS': JSON.stringify(env.VITE_ENABLE_DEBUG_LOGS),
    },
    server: {
      port: 4200,
      host: true
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development'
    }
  };
});