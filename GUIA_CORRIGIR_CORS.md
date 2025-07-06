# 🔧 GUIA: Como Corrigir CORS no Backend

## 🎯 OBJETIVO
Permitir que a aplicação frontend se conecte com a API em produção.

---

## 📋 CHECKLIST DE CORREÇÃO

### ✅ PASSO 1: Instalar CORS
No diretório do **projeto backend** (API):

```bash
npm install cors
```

### ✅ PASSO 2: Configurar CORS
No arquivo principal do servidor (app.js, server.js, index.js):

```javascript
// ADICIONAR NO TOPO DO ARQUIVO
const cors = require('cors');

// DEPOIS DE: const app = express();
// ADICIONAR ESTA CONFIGURAÇÃO:
app.use(cors({
  origin: [
    'https://mbjerp.netlify.app',    // SITE DE PRODUÇÃO
    'http://localhost:4200',         // DESENVOLVIMENTO LOCAL
    'http://localhost:3000'          // CASO USE OUTRA PORTA
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept'
  ]
}));
```

### ✅ PASSO 3: Fazer Deploy
```bash
git add .
git commit -m "fix: add CORS configuration for production"
git push origin main
```

### ✅ PASSO 4: Aguardar Deploy
- Render demora 1-3 minutos para fazer deploy
- Aguarde até aparecer "Deploy successful"

### ✅ PASSO 5: Testar
1. Acesse: https://mbjerp.netlify.app/employees
2. Veja se a lista de funcionários carrega
3. Verifique no console (F12) se não há erros

---

## 🚨 EXEMPLO COMPLETO

Se seu arquivo principal for parecido com isto:

```javascript
const express = require('express');
const app = express();

// SUAS ROTAS AQUI...
```

Deve ficar assim:

```javascript
const express = require('express');
const cors = require('cors');  // ← ADICIONAR
const app = express();

// ← ADICIONAR ESTA CONFIGURAÇÃO
app.use(cors({
  origin: [
    'https://mbjerp.netlify.app',
    'http://localhost:4200'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// SUAS ROTAS AQUI...
```

---

## 🔍 COMO VERIFICAR SE FUNCIONOU

### ✅ SINAIS DE SUCESSO:
- Lista de funcionários aparece na tela
- Console sem erros de CORS
- Botões funcionam normalmente

### ❌ SE AINDA NÃO FUNCIONAR:
1. Verificar se o deploy foi concluído
2. Verificar logs do Render
3. Testar API diretamente: https://maple-erp-backend.onrender.com/employees

---

## 🔧 TROUBLESHOOTING

### PROBLEMA: "cors is not defined"
**SOLUÇÃO:** Verificar se instalou: `npm install cors`

### PROBLEMA: Deploy falha
**SOLUÇÃO:** Verificar logs no Render dashboard

### PROBLEMA: Ainda dá erro CORS
**SOLUÇÃO:** Verificar se a configuração está antes das rotas

---

## ⚡ RESULTADO ESPERADO

Depois da correção:
- ✅ https://mbjerp.netlify.app/employees carrega dados
- ✅ Formulários funcionam
- ✅ Aplicação completamente funcional

---

**🕐 Tempo total estimado: 10-15 minutos**