import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {
  // Implementação básica para teste de visualização
  employees = [
    { id: 1, name: 'João Silva', position: 'Professor', email: 'joao.silva@maplebear.com.br' },
    { id: 2, name: 'Maria Oliveira', position: 'Coordenadora', email: 'maria.oliveira@maplebear.com.br' }
  ];
}
