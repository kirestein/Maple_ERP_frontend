# 🔐 Variáveis de Ambiente - Maple ERP Frontend

## 📋 Configuração das Variáveis de Ambiente

Este projeto utiliza variáveis de ambiente para configurar diferentes aspectos da aplicação de forma segura e flexível.

## 🚀 Configuração Inicial

### 1. Copiar o arquivo de exemplo
```bash
cp .env.example .env
```

### 2. Preencher as variáveis necessárias
Edite o arquivo `.env` com os valores apropriados para seu ambiente.

## 📝 Variáveis Obrigatórias

### 🌐 **Configuração da API**
```env
# URLs da API (OBRIGATÓRIAS)
VITE_API_URL_DEV=http://localhost:4000
VITE_API_URL_PROD=https://maple-erp-backend.onrender.com
```

### 🏷️ **Configuração da Aplicação**
```env
# Informações da aplicação
VITE_APP_NAME=Maple ERP Frontend
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development  # ou 'production'
```

## 📝 Variáveis Opcionais

### 🔗 **Endpoints da API**
```env
VITE_API_EMPLOYEES_ENDPOINT=/employees
VITE_API_HEALTH_ENDPOINT=/health-check
VITE_API_TEMPLATE_ENDPOINT=/template-cracha
```

### 📁 **Configuração de Upload**
```env
VITE_MAX_FILE_SIZE=5242880  # 5MB em bytes
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg
```

### 📄 **Configuração de Paginação**
```env
VITE_DEFAULT_PAGE_SIZE=20
VITE_MAX_PAGE_SIZE=100
```

### 🎨 **Configuração de Interface**
```env
VITE_DEFAULT_LANGUAGE=pt-BR
VITE_DATE_FORMAT=DD/MM/YYYY
VITE_CURRENCY=BRL
```

### 🔧 **Configuração de Desenvolvimento**
```env
VITE_ENABLE_DEBUG_LOGS=true
VITE_ENABLE_MOCK_DATA=false
```

### 🔒 **Configuração de Segurança**
```env
VITE_ENABLE_HTTPS_ONLY=false
VITE_SESSION_TIMEOUT=3600000  # 1 hora em ms
```

### ☁️ **Serviços Externos (Opcionais)**
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
VITE_SENTRY_DSN=your_sentry_dsn
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

### 🚩 **Feature Flags**
```env
VITE_ENABLE_HEALTH_CHECK=true
VITE_ENABLE_EXPORT_FEATURES=true
VITE_ENABLE_BADGE_GENERATION=true
VITE_ENABLE_MULTIPLE_BADGE_GENERATION=true
```

### ⚠️ **Mensagens de Erro**
```env
VITE_DEFAULT_ERROR_MESSAGE=Ocorreu um erro inesperado. Tente novamente.
VITE_NETWORK_ERROR_MESSAGE=Erro de conexão. Verifique sua internet.
VITE_SERVER_ERROR_MESSAGE=Erro interno do servidor. Tente novamente mais tarde.
```

### ⏱️ **Configuração de Timeouts**
```env
VITE_LOADING_TIMEOUT=30000   # 30 segundos
VITE_REQUEST_TIMEOUT=10000   # 10 segundos
```

## 🏗️ Ambientes de Deploy

### 🔧 **Desenvolvimento**
```env
VITE_APP_ENVIRONMENT=development
VITE_API_URL_DEV=http://localhost:4000
VITE_ENABLE_DEBUG_LOGS=true
```

### 🚀 **Produção**
```env
VITE_APP_ENVIRONMENT=production
VITE_API_URL_PROD=https://maple-erp-backend.onrender.com
VITE_ENABLE_DEBUG_LOGS=false
VITE_ENABLE_HTTPS_ONLY=true
```

## 🔐 Segurança

### ⚠️ **Arquivos Protegidos pelo .gitignore**
- `.env`
- `.env.local`
- `.env.development.local`
- `.env.test.local`
- `.env.production.local`
- `config/secrets.json`
- `config/keys.json`
- `*.key`, `*.pem`, `*.p12`, `*.pfx`
- `api-keys.json`, `tokens.json`, `credentials.json`

### 🛡️ **Boas Práticas**
1. **Nunca commitar** arquivos `.env` no repositório
2. **Usar .env.example** para documentar variáveis necessárias
3. **Rotacionar chaves** regularmente em produção
4. **Usar HTTPS** em produção
5. **Validar variáveis** na inicialização da aplicação

## 🔧 Como Usar no Código

### 📦 **EnvironmentService**
```typescript
import { EnvironmentService } from './core/services/environment.service';

constructor(private envService: EnvironmentService) {}

// Acessar configurações
const apiUrl = this.envService.apiUrl;
const isProduction = this.envService.isProduction;
const config = this.envService.config;

// Log condicional
this.envService.log('Debug message', data);

// Validar arquivo
const validation = this.envService.isValidFile(file);
```

### 🌍 **Environment Files**
```typescript
import { environment } from '../environments/environment';

// A URL da API é carregada automaticamente do .env
const apiUrl = environment.apiUrl;
```

## 🚀 Deploy

### 📦 **Build para Produção**
```bash
# Definir ambiente de produção
echo "VITE_APP_ENVIRONMENT=production" > .env

# Build
npm run build
```

### ☁️ **Netlify/Vercel**
Configure as variáveis de ambiente no painel de controle:
- `VITE_API_URL_PROD=https://maple-erp-backend.onrender.com`
- `VITE_APP_ENVIRONMENT=production`
- Outras variáveis conforme necessário

### 🐳 **Docker**
```dockerfile
# No Dockerfile, copie apenas o .env.example
COPY .env.example .env

# Configure as variáveis via docker-compose ou kubernetes
```

## 🔍 Troubleshooting

### ❌ **Variável não encontrada**
1. Verifique se a variável está no arquivo `.env`
2. Verifique se o nome começa com `VITE_`
3. Reinicie o servidor de desenvolvimento
4. Verifique se o arquivo `vite.config.ts` está configurado

### ❌ **API não conecta**
1. Verifique `VITE_API_URL_DEV` e `VITE_API_URL_PROD`
2. Teste a URL da API diretamente no browser
3. Verifique se o backend está rodando
4. Verifique configurações de CORS no backend

### ❌ **Build falha**
1. Verifique se todas as variáveis obrigatórias estão definidas
2. Verifique se não há caracteres especiais nas variáveis
3. Verifique se o `vite.config.ts` está correto

## 📞 Suporte

Para dúvidas sobre configuração de variáveis de ambiente:
1. Consulte este documento
2. Verifique o arquivo `.env.example`
3. Consulte a documentação do Vite sobre variáveis de ambiente