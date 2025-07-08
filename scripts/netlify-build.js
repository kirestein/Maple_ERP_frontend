#!/usr/bin/env node

/**
 * Script de build para Netlify
 * Configura as variáveis de ambiente necessárias para o build
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build para Netlify...');

// Verificar se estamos no Netlify
const isNetlify = process.env.NETLIFY === 'true';
console.log(`📍 Ambiente: ${isNetlify ? 'Netlify' : 'Local'}`);

// Configurar variáveis de ambiente para produção
const productionEnvVars = {
  VITE_APP_ENVIRONMENT: 'production',
  VITE_API_URL_PROD: 'https://maple-erp-backend.onrender.com',
  VITE_API_URL_DEV: 'http://localhost:4000',
  VITE_APP_NAME: 'Maple ERP Frontend',
  VITE_APP_VERSION: '1.0.0',
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
  VITE_ENABLE_DEBUG_LOGS: 'false',
  VITE_ENABLE_MOCK_DATA: 'false',
  VITE_ENABLE_HTTPS_ONLY: 'true',
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

// Aplicar variáveis de ambiente
Object.entries(productionEnvVars).forEach(([key, value]) => {
  if (!process.env[key]) {
    process.env[key] = value;
    console.log(`✅ Configurado: ${key}=${value}`);
  } else {
    console.log(`ℹ️  Já existe: ${key}=${process.env[key]}`);
  }
});

// Criar arquivo de configuração para runtime
const runtimeConfig = {
  apiUrl: process.env.VITE_API_URL_PROD,
  environment: 'production',
  version: process.env.VITE_APP_VERSION,
  buildTime: new Date().toISOString()
};

const configPath = path.join(__dirname, '..', 'src', 'assets', 'config.json');
const assetsDir = path.dirname(configPath);

// Criar diretório assets se não existir
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log('📁 Diretório assets criado');
}

// Escrever arquivo de configuração
fs.writeFileSync(configPath, JSON.stringify(runtimeConfig, null, 2));
console.log('📝 Arquivo de configuração criado:', configPath);

// Verificar variáveis críticas
const criticalVars = ['VITE_API_URL_PROD', 'VITE_APP_ENVIRONMENT'];
const missingVars = criticalVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variáveis críticas não encontradas:', missingVars);
  process.exit(1);
}

console.log('✅ Configuração do Netlify concluída com sucesso!');
console.log('🔗 API URL:', process.env.VITE_API_URL_PROD);
console.log('🌍 Environment:', process.env.VITE_APP_ENVIRONMENT);