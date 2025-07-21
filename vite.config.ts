import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Definir variáveis padrão completas
  const defaultEnvVars = {
    VITE_API_URL_DEV: 'http://localhost:4000',
    VITE_API_URL_PROD: 'https://maple-erp-backend.onrender.com',
    VITE_APP_NAME: 'Maple ERP Frontend',
    VITE_APP_VERSION: '1.0.0',
    VITE_APP_ENVIRONMENT: mode === 'production' ? 'production' : 'development',
    VITE_ENABLE_DEBUG_LOGS: mode === 'development' ? 'true' : 'false',
    VITE_API_EMPLOYEES_ENDPOINT: '/employees',
    VITE_API_HEALTH_ENDPOINT: '/health-check',
    VITE_API_TEMPLATE_ENDPOINT: '/template-cracha',
    VITE_MAX_FILE_SIZE: '5242880',
    VITE_ALLOWED_FILE_TYPES: 'image/jpeg,image/png,image/jpg',
    VITE_DEFAULT_PAGE_SIZE: '20',
    VITE_MAX_PAGE_SIZE: '100',
    VITE_DEFAULT_LANGUAGE: 'pt-BR',
    VITE_DATE_FORMAT: 'DD/MM/YYYY',
    VITE_CURRENCY: 'BRL',
    VITE_ENABLE_MOCK_DATA: 'false',
    VITE_ENABLE_HTTPS_ONLY: mode === 'production' ? 'true' : 'false',
    VITE_SESSION_TIMEOUT: '3600000',
    VITE_ENABLE_HEALTH_CHECK: 'true',
    VITE_ENABLE_EXPORT_FEATURES: 'true',
    VITE_ENABLE_BADGE_GENERATION: 'true',
    VITE_ENABLE_MULTIPLE_BADGE_GENERATION: 'true',
    VITE_DEFAULT_ERROR_MESSAGE: 'Ocorreu um erro inesperado. Tente novamente.',
    VITE_NETWORK_ERROR_MESSAGE: 'Erro de conexão. Verifique sua internet.',
    VITE_SERVER_ERROR_MESSAGE: 'Erro interno do servidor. Tente novamente mais tarde.',
    VITE_LOADING_TIMEOUT: '30000',
    VITE_REQUEST_TIMEOUT: '10000'
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
  console.log('🔧 Environment:', finalEnv.VITE_APP_ENVIRONMENT);
  console.log('📊 Total env vars defined:', Object.keys(defineVars).length);
  
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