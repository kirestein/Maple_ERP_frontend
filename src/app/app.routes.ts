import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirecionar a rota raiz para o módulo de funcionários
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  
  // Carregamento lazy do módulo de funcionários
  { 
    path: 'employees', 
    loadChildren: () => import('./modules/employee/employee.routes')
      .then(m => m.EMPLOYEE_ROUTES)
  },
  
  // Rota de fallback para página não encontrada (pode ser implementada posteriormente)
  { path: '**', redirectTo: 'employees' }
];
