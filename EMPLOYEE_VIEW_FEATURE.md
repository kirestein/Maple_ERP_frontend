# Funcionalidade: Tela de Visualização de Funcionário

## Descrição
Implementação da tela de visualização detalhada de funcionário, acessível através da rota `/employees/:id`. Esta funcionalidade permite visualizar todos os dados cadastrados de um funcionário específico e gerar documentos relacionados.

## Funcionalidades Implementadas

### 1. Visualização Completa de Dados
- **Foto do funcionário** com fallback para avatar padrão
- **Informações pessoais**: nome, cargo, data de nascimento, CPF, RG, etc.
- **Informações de contato**: telefone, celular, e-mail, endereço
- **Informações profissionais**: cargo, data de admissão, salário, horas de trabalho
- **Documentação**: PIS/PASEP, CTPS, CNH, título de eleitor
- **Informações familiares**: dados do cônjuge, pais

### 2. Ações Disponíveis
- **Gerar Crachá**: Download do PDF do crachá do funcionário
- **Gerar Documento Contábil**: Download do PDF do documento contábil
- **Editar Funcionário**: Navegação para a tela de edição
- **Voltar à Lista**: Retorno para a listagem de funcionários

### 3. Navegação Integrada
- **Cards clicáveis** na listagem de funcionários levam diretamente à visualização
- **Botões de ação** na listagem incluem visualizar, editar e excluir
- **Tooltips** informativos nos botões de ação

## Estrutura de Arquivos

```
src/app/modules/employee/components/employee-view/
├── employee-view.component.ts      # Lógica do componente
├── employee-view.component.html    # Template da interface
└── employee-view.component.scss    # Estilos do componente
```

## Rotas Configuradas

```typescript
// src/app/modules/employee/employee.routes.ts
export const EMPLOYEE_ROUTES: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'new', component: EmployeeFormComponent },
  { path: 'view/:id', component: EmployeeViewComponent },  // ← Nova rota
  { path: 'edit/:id', component: EmployeeFormComponent }
];
```

## Como Usar

### 1. Acessar via Lista de Funcionários
- Clique em qualquer card de funcionário na listagem
- Ou clique no botão "👁️ Visualizar" no card

### 2. Acessar via URL Direta
- Navegue para `/employees/view/{id}` onde `{id}` é o ID do funcionário

### 3. Gerar Documentos
- **Crachá**: Clique em "Gerar Crachá" para download do PDF
- **Documento Contábil**: Clique em "Gerar Documento Contábil" para download do PDF

## Tratamento de Erros

### Funcionário Não Encontrado (404)
- Exibe mensagem "Funcionário não encontrado"
- Oferece opções para tentar novamente ou voltar à lista

### Erro de Conexão
- Exibe mensagem de erro específica
- Botão para tentar carregar novamente

### Erro na Geração de Documentos
- Notificação via snackbar com detalhes do erro
- Não interrompe a navegação na tela

## Responsividade

### Desktop (> 768px)
- Layout em duas colunas para informações
- Foto em tamanho 200x200px
- Botões organizados horizontalmente

### Tablet/Mobile (≤ 768px)
- Layout em coluna única
- Foto centralizada em tamanho 150x150px
- Botões empilhados verticalmente
- Texto e espaçamentos otimizados

## Formatação de Dados

### Datas
- Formato brasileiro: dd/mm/aaaa
- Fallback: "Não informado" para datas vazias

### CPF
- Máscara: XXX.XXX.XXX-XX
- Validação de formato

### Telefones
- Celular: (XX) XXXXX-XXXX
- Fixo: (XX) XXXX-XXXX

### Valores Monetários
- Formato: R$ X.XXX,XX
- Usando pipe number do Angular

## Dependências Utilizadas

### Angular Material
- `MatCardModule` - Cards de informações
- `MatButtonModule` - Botões de ação
- `MatIconModule` - Ícones da interface
- `MatChipsModule` - Chip de status
- `MatSnackBarModule` - Notificações
- `MatProgressSpinnerModule` - Loading
- `MatTooltipModule` - Tooltips

### Outros
- `CommonModule` - Diretivas básicas do Angular
- `RouterModule` - Navegação entre rotas

## Melhorias Futuras Sugeridas

1. **Cache de dados** para melhor performance
2. **Modo de impressão** otimizado
3. **Histórico de alterações** do funcionário
4. **Compartilhamento** de dados via link
5. **Exportação** de dados individuais em diferentes formatos
6. **Integração** com sistema de notificações

## Testes Recomendados

1. **Navegação**: Testar acesso via lista e URL direta
2. **Responsividade**: Verificar em diferentes tamanhos de tela
3. **Geração de documentos**: Testar download de PDFs
4. **Tratamento de erros**: Testar com IDs inválidos
5. **Performance**: Verificar carregamento com dados grandes