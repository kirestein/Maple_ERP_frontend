# 🚀 Guia de Deploy no Netlify - Maple ERP Frontend

## 📋 Configuração Passo a Passo

### 1. 🔧 **Configurações de Build no Netlify**

No painel do Netlify, configure:

#### **Build Settings:**
```
Build command: npm run netlify:build
Publish directory: dist/maple-erp-frontend/browser
```

#### **Environment Variables:**
Vá em `Site settings > Environment variables` e adicione:

```env
# OBRIGATÓRIAS
VITE_APP_ENVIRONMENT=production
VITE_API_URL_PROD=https://maple-erp-backend.onrender.com

# RECOMENDADAS
VITE_APP_NAME=Maple ERP Frontend
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG_LOGS=false
VITE_ENABLE_HTTPS_ONLY=true

# OPCIONAIS (com valores padrão)
VITE_API_EMPLOYEES_ENDPOINT=/employees
VITE_API_HEALTH_ENDPOINT=/health-check
VITE_MAX_FILE_SIZE=5242880
VITE_DEFAULT_PAGE_SIZE=20
VITE_DEFAULT_LANGUAGE=pt-BR
```

### 2. 📝 **Como Adicionar Variáveis no Netlify**

#### **Método 1: Interface Web**
1. Acesse seu site no Netlify
2. Vá em `Site settings`
3. Clique em `Environment variables`
4. Clique em `Add variable`
5. Digite:
   - **Key:** `VITE_API_URL_PROD`
   - **Value:** `https://maple-erp-backend.onrender.com`
6. Clique em `Create variable`
7. Repita para outras variáveis

#### **Método 2: Netlify CLI**
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Configurar variáveis
netlify env:set VITE_API_URL_PROD "https://maple-erp-backend.onrender.com"
netlify env:set VITE_APP_ENVIRONMENT "production"
netlify env:set VITE_ENABLE_DEBUG_LOGS "false"
```

#### **Método 3: Arquivo netlify.toml (Já configurado)**
As variáveis principais já estão no arquivo `netlify.toml`.

### 3. 🔍 **Verificar Configuração**

#### **Variáveis Obrigatórias:**
- ✅ `VITE_API_URL_PROD=https://maple-erp-backend.onrender.com`
- ✅ `VITE_APP_ENVIRONMENT=production`

#### **Verificar no Build Log:**
Procure por estas mensagens no log de build:
```
✅ Configurado: VITE_API_URL_PROD=https://maple-erp-backend.onrender.com
✅ Configurado: VITE_APP_ENVIRONMENT=production
✅ Configuração do Netlify concluída com sucesso!
```

### 4. 🐛 **Troubleshooting**

#### **Problema: "Not Found" ao adicionar variáveis**
**Solução:**
1. Certifique-se de estar na aba correta: `Site settings > Environment variables`
2. Use exatamente estes nomes (case-sensitive):
   - `VITE_API_URL_PROD` (não `VITE_API_URL_PRODUCTION`)
   - `VITE_APP_ENVIRONMENT` (não `VITE_ENVIRONMENT`)

#### **Problema: Build falha**
**Soluções:**
1. Verifique se o comando de build está correto: `npm run netlify:build`
2. Verifique se o diretório de publicação está correto: `dist/maple-erp-frontend/browser`
3. Verifique os logs de build para erros específicos

#### **Problema: API não conecta**
**Soluções:**
1. Verifique se `VITE_API_URL_PROD` está correto
2. Teste a URL da API diretamente: `https://maple-erp-backend.onrender.com/health-check`
3. Verifique CORS no backend

#### **Problema: Variáveis não aparecem**
**Soluções:**
1. Faça um novo deploy após adicionar variáveis
2. Verifique se os nomes começam com `VITE_`
3. Verifique se não há espaços nos nomes ou valores

### 5. 📱 **Configuração Completa Recomendada**

```env
# === OBRIGATÓRIAS ===
VITE_APP_ENVIRONMENT=production
VITE_API_URL_PROD=https://maple-erp-backend.onrender.com

# === APLICAÇÃO ===
VITE_APP_NAME=Maple ERP Frontend
VITE_APP_VERSION=1.0.0

# === API ENDPOINTS ===
VITE_API_EMPLOYEES_ENDPOINT=/employees
VITE_API_HEALTH_ENDPOINT=/health-check
VITE_API_TEMPLATE_ENDPOINT=/template-cracha

# === UPLOAD ===
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg

# === PAGINAÇÃO ===
VITE_DEFAULT_PAGE_SIZE=20
VITE_MAX_PAGE_SIZE=100

# === INTERFACE ===
VITE_DEFAULT_LANGUAGE=pt-BR
VITE_DATE_FORMAT=DD/MM/YYYY
VITE_CURRENCY=BRL

# === DESENVOLVIMENTO ===
VITE_ENABLE_DEBUG_LOGS=false
VITE_ENABLE_MOCK_DATA=false

# === SEGURANÇA ===
VITE_ENABLE_HTTPS_ONLY=true
VITE_SESSION_TIMEOUT=3600000

# === FEATURES ===
VITE_ENABLE_HEALTH_CHECK=true
VITE_ENABLE_EXPORT_FEATURES=true
VITE_ENABLE_BADGE_GENERATION=true
VITE_ENABLE_MULTIPLE_BADGE_GENERATION=true

# === MENSAGENS ===
VITE_DEFAULT_ERROR_MESSAGE=Ocorreu um erro inesperado. Tente novamente.
VITE_NETWORK_ERROR_MESSAGE=Erro de conexão. Verifique sua internet.
VITE_SERVER_ERROR_MESSAGE=Erro interno do servidor. Tente novamente mais tarde.

# === TIMEOUTS ===
VITE_LOADING_TIMEOUT=30000
VITE_REQUEST_TIMEOUT=10000
```

### 6. 🔄 **Deploy Automático**

#### **Configuração do Git:**
1. Conecte seu repositório GitHub ao Netlify
2. Configure branch de deploy: `feat/api-integration-improvements` ou `main`
3. O deploy será automático a cada push

#### **Comando Manual:**
```bash
# Deploy via CLI
netlify deploy --prod --dir=dist/maple-erp-frontend/browser
```

### 7. ✅ **Verificação Final**

Após o deploy, teste:

1. **Acesse o site:** `https://seu-site.netlify.app`
2. **Teste a API:** Abra o console e verifique se não há erros de CORS
3. **Teste funcionalidades:** Cadastro, listagem, etc.
4. **Verifique Health Check:** Se habilitado, teste a conectividade

### 8. 📞 **Suporte**

#### **Logs de Build:**
- Acesse `Site overview > Production deploys`
- Clique no deploy mais recente
- Veja os logs detalhados

#### **Logs de Runtime:**
- Abra o console do navegador (F12)
- Procure por erros ou mensagens de debug

#### **Variáveis de Ambiente:**
- Verifique em `Site settings > Environment variables`
- Certifique-se de que todas estão listadas

---

## 🎯 **Resumo Rápido**

### **Configurações Mínimas no Netlify:**
1. **Build command:** `npm run netlify:build`
2. **Publish directory:** `dist/maple-erp-frontend/browser`
3. **Environment variables:**
   - `VITE_API_URL_PROD=https://maple-erp-backend.onrender.com`
   - `VITE_APP_ENVIRONMENT=production`

### **Se ainda não funcionar:**
1. Verifique se o backend está rodando: `https://maple-erp-backend.onrender.com/health-check`
2. Verifique CORS no backend
3. Faça um novo deploy após configurar as variáveis
4. Verifique os logs de build no Netlify

🚀 **Com essas configurações, seu deploy no Netlify deve funcionar perfeitamente!**