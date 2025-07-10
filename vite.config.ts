import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Definir variáveis padrão para Netlify
  const defaultEnvVars = {
    VITE_API_URL_DEV: 'http://localhost:4000',
    VITE_API_URL_PROD: 'https://maple-erp-backend.onrender.com',
    VITE_APP_NAME: 'Maple ERP Frontend',
    VITE_APP_VERSION: '1.0.0',
    VITE_APP_ENVIRONMENT: mode === 'production' ? 'production' : 'development',
    VITE_ENABLE_DEBUG_LOGS: mode === 'development' ? 'true' : 'false',
    VITE_API_EMPLOYEES_ENDPOINT: '/employees',
    VITE_API_HEALTH_ENDPOINT: '/health-check',
    VITE_MAX_FILE_SIZE: '5242880',
    VITE_DEFAULT_PAGE_SIZE: '20'
  };

  // Mesclar variáveis do ambiente com padrões
  const finalEnv = { ...defaultEnvVars, ...env };
  
  // Criar objeto define para todas as variáveis VITE_
  const defineVars = {};
  Object.keys(finalEnv).forEach(key => {
    if (key.startsWith('VITE_')) {
      defineVars[`import.meta.env.${key}`] = JSON.stringify(finalEnv[key]);
    }
  });
  
  console.log('🔧 Vite Config - Mode:', mode);
  console.log('🌍 API URL:', finalEnv[mode === 'production' ? 'VITE_API_URL_PROD' : 'VITE_API_URL_DEV']);
  
  return {
    define: defineVars,
    server: {
      port: 4200,
      host: true
    },
    build: {
      outDir: 'dist/maple-erp-frontend',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['@angular/core', '@angular/common', '@angular/forms'],
            material: ['@angular/material']
          }
        }
      }
    },
    preview: {
      port: 4200,
      host: true
    }
  };
});