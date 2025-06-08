# Maple Bear ERP - Frontend

Sistema ERP para gerenciamento escolar da Maple Bear.

## 🚀 Como rodar o projeto

### Pré-requisitos
- Node.js 18+ 
- npm ou bun

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm start
# ou
npm run ng serve
```
Acesse http://localhost:4200

### Build de produção
```bash
npm run build
```

### Testes
```bash
npm test
```

### Linting
```bash
npm run lint
```

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── core/          # Serviços e utilitários centrais
│   ├── shared/        # Componentes e modelos compartilhados  
│   ├── modules/       # Módulos de funcionalidades
│   │   └── employee/  # Módulo de funcionários
│   └── ...
```

## 🛠 Tecnologias

- Angular 20
- Angular Material
- TypeScript
- SCSS
- ngx-mask

## 📝 Convenções

### Commits
Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração
- `test:` testes
- `chore:` tarefas de manutenção

### Branches
- `main` - branch principal
- `feature/nome-da-feature` - novas funcionalidades
- `fix/nome-do-fix` - correções
- `hotfix/nome-do-hotfix` - correções urgentes

## 🏗 Development Workflow

1. Clone o repositório
2. Instale dependências: `npm install`
3. Crie uma branch: `git checkout -b feature/minha-feature`
4. Desenvolva e teste
5. Commit: `git commit -m "feat: adicionar nova funcionalidade"`
6. Push: `git push origin feature/minha-feature`
7. Abra um Pull Request

## 📋 Scripts disponíveis

- `npm start` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run watch` - Build em modo watch
- `npm test` - Executar testes
- `npm run lint` - Verificação de tipos TypeScript

## 🎯 Funcionalidades

### Módulo de Funcionários
- ✅ Cadastro de funcionários
- ✅ Listagem de funcionários
- ✅ Formulário com validações
- ✅ Upload de foto
- ✅ Gestão de dependentes
- ✅ Contatos de emergência

### Em desenvolvimento
- 🔄 Módulo financeiro
- 🔄 Relatórios
- 🔄 Dashboard