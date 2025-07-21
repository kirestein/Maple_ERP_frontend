import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../shared/models/employee.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.scss',
})
export class EmployeeViewComponent implements OnInit {
  employee: Employee | null = null;
  isLoading = false;
  error: string | null = null;
  employeeId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.loadEmployee();
    } else {
      this.error = 'ID do funcionário não encontrado';
    }
  }

  /**
   * Carrega os dados do funcionário pelo ID
   */
  loadEmployee(): void {
    if (!this.employeeId) return;

    this.isLoading = true;
    this.error = null;

    this.employeeService
      .getEmployeeById(this.employeeId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (employee) => {
          this.employee = employee;
        },
        error: (err: any) => {
          if (err.status === 404) {
            this.error = 'Funcionário não encontrado';
          } else {
            this.error = err.message || 'Erro ao carregar dados do funcionário';
          }
          const errorMessage = this.error || 'Erro desconhecido';
          this.snackBar.open(
            errorMessage,
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
   * Gera e faz download do crachá do funcionário
   */
  generateBadge(): void {
    if (!this.employeeId) return;

    this.employeeService.generateBadge(this.employeeId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cracha_${this.employee?.fullName?.replace(/\s+/g, '_') || 'funcionario'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.snackBar.open('Crachá gerado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
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
   * Gera e faz download do documento contábil do funcionário
   */
  generateDocument(): void {
    if (!this.employeeId) return;

    this.employeeService.getDocument(this.employeeId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `documento_contabil_${this.employee?.fullName?.replace(/\s+/g, '_') || 'funcionario'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.snackBar.open('Documento contábil gerado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      },
      error: (error) => {
        this.snackBar.open('Erro ao gerar documento contábil: ' + error.message, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    });
  }

  /**
   * Navega para a página de edição do funcionário
   */
  editEmployee(): void {
    if (this.employeeId) {
      this.router.navigate(['/employees/edit', this.employeeId]);
    }
  }

  /**
   * Volta para a lista de funcionários
   */
  goBack(): void {
    this.router.navigate(['/employees']);
  }

  /**
   * Formata data para exibição (dd/mm/aaaa)
   */
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Não informado';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Data inválida';
    
    return dateObj.toLocaleDateString('pt-BR');
  }

  /**
   * Formata CPF para exibição
   */
  formatCpf(cpf: string | undefined): string {
    if (!cpf) return 'Não informado';
    
    // Remove caracteres não numéricos
    const cleanCpf = cpf.replace(/\D/g, '');
    
    // Aplica máscara XXX.XXX.XXX-XX
    if (cleanCpf.length === 11) {
      return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    return cpf;
  }

  /**
   * Formata telefone para exibição
   */
  formatPhone(phone: string | undefined): string {
    if (!phone) return 'Não informado';
    
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Aplica máscara para celular (XX) XXXXX-XXXX ou telefone fixo (XX) XXXX-XXXX
    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
  }

  /**
   * Retorna a URL da foto do funcionário ou uma imagem padrão
   */
  getPhotoUrl(): string {
    if (this.employee?.photoUrl) {
      return this.employee.photoUrl;
    }
    // Retorna uma imagem padrão de avatar
    return 'assets/images/default-avatar.svg';
  }

  /**
   * Manipula erro de carregamento da imagem
   */
  onImageError(event: any): void {
    event.target.src = 'assets/images/default-avatar.svg';
  }

  /**
   * Retorna o status formatado para exibição
   */
  getStatusDisplay(): string {
    if (!this.employee?.status) return 'Não informado';
    
    switch (this.employee.status) {
      case 'Ativo':
        return 'Ativo';
      case 'Inativo':
        return 'Inativo';
      case 'Licença':
        return 'Licença';
      default:
        return this.employee.status;
    }
  }

  /**
   * Retorna a classe CSS para o chip de status
   */
  getStatusChipClass(): string {
    if (!this.employee?.status) return 'status-unknown';
    
    switch (this.employee.status) {
      case 'Ativo':
        return 'status-active';
      case 'Inativo':
        return 'status-inactive';
      case 'Licença':
        return 'status-suspended';
      default:
        return 'status-unknown';
    }
  }
}