import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../shared/models/employee.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  /**
   * Carrega a lista de funcionários da API
   */
  loadEmployees(): void {
    this.isLoading = true;
    this.error = null;

    this.employeeService
      .getEmployees()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.employees = data;
        },
        error: (err) => {
          this.error = err.message || 'Erro ao carregar funcionários';
          this.snackBar.open(
            this.error || 'Erro ao carregar funcionários',
            'Fechar',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
  }

  /**
   * Exclui um funcionário após confirmação
   */
  deleteEmployee(id: string | number): void {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.snackBar.open('Funcionário excluído com sucesso', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.loadEmployees(); // Recarrega a lista após exclusão
        },
        error: (err) => {
          this.snackBar.open(
            err.message || 'Erro ao excluir funcionário',
            'Fechar',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
    }
  }
}
