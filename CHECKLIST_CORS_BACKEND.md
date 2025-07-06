# ✅ CHECKLIST: Corrigir CORS no Backend

## 🎯 **PROBLEMA**
API bloqueando requests do frontend em produção por falta de configuração CORS.

## 🚀 **SOLUÇÃO RÁPIDA**

### **Passo 1: Instalar CORS (se necessário)**
```bash
npm install cors
# ou
yarn add cors
```

### **Passo 2: Configurar no servidor**
```javascript
const cors = require('cors');
const express = require('express');
const app = express();

// CONFIGURAÇÃO CORS
app.use(cors({
  origin: [
    'https://mbjerp.netlify.app',  // ✅ PRODUÇÃO
    'http://localhost:4200'        // ✅ DESENVOLVIMENTO
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With'
  ]
}));

// Suas rotas aqui...
```

### **Passo 3: Deploy e Teste**
```bash
# 1. Fazer deploy no Render
git add .
git commit -m "fix: add CORS configuration for production"
git push

# 2. Aguardar deploy (1-3 minutos)

# 3. Testar acessando:
# https://mbjerp.netlify.app/employees
```

## ✅ **CHECKLIST DE VERIFICAÇÃO**

- [ ] CORS instalado e configurado
- [ ] Domínio `https://mbjerp.netlify.app` adicionado às origins
- [ ] Deploy realizado no Render
- [ ] Aguardado tempo de deploy (1-3 min)
- [ ] Testado acessando a aplicação frontend
- [ ] Dados carregando sem erros no console
- [ ] API respondendo normalmente

## 🔍 **COMO TESTAR**

1. **Acesse:** https://mbjerp.netlify.app/employees
2. **Abra o console (F12)**
3. **Verifique:**
   - ✅ Sem erros de CORS
   - ✅ Sem erros 403
   - ✅ Dados dos funcionários aparecendo

## 📞 **SE AINDA HOUVER PROBLEMAS**

1. **Verificar logs do Render**
2. **Testar API diretamente:** https://maple-erp-backend.onrender.com/employees
3. **Verificar se todas as rotas têm CORS configurado**

## 🎉 **CONFIRMAÇÃO DE SUCESSO**

Quando funcionando, você verá:
- Lista de funcionários carregada
- Sem erros no console
- Botão "Novo Funcionário" funcionando

---

*Tempo estimado de correção: 5-10 minutos*