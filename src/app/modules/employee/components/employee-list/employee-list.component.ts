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
  
  // Filtros
  searchName = '';
  searchJobFunction = '';
  selectedStatus = '';
  
  // Paginação
  currentPage = 0;
  pageSize = 20;
  totalEmployees = 0;

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  /**
   * Carrega a lista de funcionários da API com filtros e paginação
   */
  loadEmployees(): void {
    this.isLoading = true;
    this.error = null;

    const searchParams = {
      name: this.searchName || undefined,
      jobFunction: this.searchJobFunction || undefined,
      status: this.selectedStatus || undefined,
      limit: this.pageSize,
      offset: this.currentPage * this.pageSize
    };

    this.employeeService
      .searchEmployees(searchParams)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.employees = response.employees;
          this.totalEmployees = response.total;
        },
        error: (err: any) => {
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
   * Executa busca com filtros
   */
  onSearch(): void {
    this.currentPage = 0;
    this.loadEmployees();
  }

  /**
   * Navegação de páginas
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEmployees();
  }

  /**
   * Exclui um funcionário após confirmação
   */
  deleteEmployee(id: number): void {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: (response) => {
          this.snackBar.open('Funcionário excluído com sucesso', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.loadEmployees(); // Recarrega a lista após exclusão
        },
        error: (err: any) => {
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

  /**
   * Gera crachá individual
   */
  generateBadge(id: number): void {
    this.employeeService.generateBadge(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cracha_funcionario_${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.snackBar.open('Erro ao gerar crachá: ' + error.message, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    });
  }

  /**
   * Exporta dados dos funcionários
   */
  exportEmployees(format: 'csv' | 'json'): void {
    this.employeeService.exportEmployees(format, this.selectedStatus).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `funcionarios.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.snackBar.open('Erro ao exportar dados: ' + error.message, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    });
  }
}
