# 🅰️ Guia de Integração Angular - Maple ERP Backend

## 📋 Índice
1. [Configuração Inicial](#configuração-inicial)
2. [Services](#services)
3. [Interfaces TypeScript](#interfaces-typescript)
4. [Componentes](#componentes)
5. [Interceptors](#interceptors)
6. [Guards](#guards)
7. [Exemplos Práticos](#exemplos-práticos)

## 🚀 Configuração Inicial

### 1. Instalar Dependências
```bash
npm install @angular/common @angular/forms @angular/router
```

### 2. Configurar HttpClient
```typescript
// app.module.ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    // outros imports
  ],
})
export class AppModule { }
```

### 3. Configurar Environment
```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000'
};

// Nota: O Angular dev server roda por padrão em http://localhost:4200
// O CORS já está configurado para aceitar requisições desta origem

// environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://maple-erp-backend.onrender.com'
};
```

## 🔧 Services

### 1. Base Service
```typescript
// services/base.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected apiUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro desconhecido';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('Erro na API:', error);
    return throwError(() => new Error(errorMessage));
  }
}
```

### 2. Employee Service
```typescript
// services/employee.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, SearchEmployeesResponse } from '../interfaces/employee.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseService {
  private endpoint = '/employees';

  // Listar todos os funcionários
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}${this.endpoint}`)
      .pipe(catchError(this.handleError));
  }

  // Buscar funcionário por ID
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}${this.endpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Criar funcionário
  createEmployee(employeeData: FormData): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}${this.endpoint}`, employeeData)
      .pipe(catchError(this.handleError));
  }

  // Atualizar funcionário
  updateEmployee(id: number, employeeData: UpdateEmployeeRequest): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}${this.endpoint}/${id}`, employeeData)
      .pipe(catchError(this.handleError));
  }

  // Deletar funcionário
  deleteEmployee(id: number): Observable<{message: string, deletedId: number}> {
    return this.http.delete<{message: string, deletedId: number}>(`${this.apiUrl}${this.endpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Buscar com filtros
  searchEmployees(params: {
    name?: string;
    jobFunction?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Observable<SearchEmployeesResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${this.apiUrl}${this.endpoint}/search?${queryParams.toString()}`;
    return this.http.get<SearchEmployeesResponse>(url)
      .pipe(catchError(this.handleError));
  }

  // Gerar crachá individual
  generateBadge(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}${this.endpoint}/${id}/badge`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  // Gerar múltiplos crachás
  generateMultipleBadges(employeeIds: number[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}${this.endpoint}/badges`, 
      { employeeIds }, 
      { responseType: 'blob' }
    ).pipe(catchError(this.handleError));
  }

  // Exportar dados
  exportEmployees(format: 'csv' | 'json' = 'csv', status?: string): Observable<Blob> {
    const params = new URLSearchParams();
    params.append('format', format);
    if (status) params.append('status', status);

    return this.http.get(`${this.apiUrl}${this.endpoint}/export?${params.toString()}`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }
}
```

### 3. Health Service
```typescript
// services/health.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './base.service';

export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  database: string;
  cloudinary: string;
}

@Injectable({
  providedIn: 'root'
})
export class HealthService extends BaseService {
  
  checkHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>(`${this.apiUrl}/health-check`)
      .pipe(catchError(this.handleError));
  }
}
```

## 📝 Interfaces TypeScript

```typescript
// interfaces/employee.interface.ts
export interface Employee {
  id: number;
  companyNumber?: number;
  companyName?: string;
  fullName: string;
  email?: string;
  tagName?: string;
  tagLastName?: string;
  birthday?: string;
  age?: string;
  cep?: string;
  employeeAddress?: string;
  employeeAddressNumber?: string;
  employeeAddressComplement?: string;
  employeeNeighborhood?: string;
  employeeAddressCity?: string;
  employeeAddressState?: string;
  phone?: string;
  mobile?: string;
  naturalness?: string;
  nationality?: string;
  fatherName?: string;
  motherName?: string;
  mealValue?: number;
  deficiency?: boolean;
  deficiencyDescription?: string;
  transport?: boolean;
  transportType?: string;
  transportValue?: number;
  partnerName?: string;
  partnerCpf?: string;
  partnerBirthday?: string;
  partnerRg?: string;
  photoUrl?: string;
  gender?: string;
  maritalStatus?: string;
  graduation?: string;
  skinColor?: string;
  rg?: string;
  rgEmitter?: string;
  rgEmissionDate?: string;
  cpf?: string;
  pisPasep?: string;
  voterTitle?: string;
  voterZone?: string;
  voterSection?: string;
  voterEmission?: string;
  militaryCertificate?: string;
  ctps?: string;
  ctpsSerie?: string;
  driversLicense?: boolean;
  driversLicenseNumber?: string;
  driversLicenseEmissionDate?: string;
  driversLicenseExpirationDate?: string;
  driversLicenseCategory?: string;
  healthPlan?: string;
  healthCardNumber?: string;
  collegeCep?: string;
  traineeAddress?: string;
  traineeAddressNumber?: number;
  traineeAddressNeighborhood?: string;
  traineeAddressComplement?: string;
  traineeAddressState?: string;
  traineeAddressCity?: string;
  college?: string;
  course?: string;
  trainingPeriod?: string;
  lifeInsurancePolicy?: string;
  ra?: string;
  jobFunctions: string;
  admissionDate?: string;
  periodWork?: string;
  contractExpirationDate?: string;
  dailyHours?: string;
  weeklyHours?: string;
  monthlyHours?: string;
  weeklyClasses?: string;
  hasAccumulate?: boolean;
  hasAccumulateCompany?: string;
  salary?: number;
  salaryBank?: string;
  salaryAgency?: string;
  salaryAccount?: string;
  salaryAccountType?: string;
  familySalary?: number;
  parenting?: string;
  irpf?: string;
  status?: string;
  jobPosition?: string;
  department?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeRequest {
  fullName: string;
  tagName: string;
  tagLastName: string;
  jobFunctions?: string;
  birthday?: string;
  file: File;
}

export interface UpdateEmployeeRequest {
  fullName?: string;
  jobFunctions?: string;
  birthday?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  status?: 'Ativo' | 'Inativo' | 'Licença';
}

export interface SearchEmployeesResponse {
  employees: Employee[];
  total: number;
  limit: number;
  offset: number;
}
```

## 🎨 Componentes

### 1. Lista de Funcionários
```typescript
// components/employee-list/employee-list.component.ts
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../interfaces/employee.interface';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  error: string | null = null;
  
  // Filtros
  searchName = '';
  searchJobFunction = '';
  selectedStatus = '';
  
  // Paginação
  currentPage = 0;
  pageSize = 20;
  totalEmployees = 0;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = null;

    const searchParams = {
      name: this.searchName || undefined,
      jobFunction: this.searchJobFunction || undefined,
      status: this.selectedStatus || undefined,
      limit: this.pageSize,
      offset: this.currentPage * this.pageSize
    };

    this.employeeService.searchEmployees(searchParams).subscribe({
      next: (response) => {
        this.employees = response.employees;
        this.totalEmployees = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadEmployees();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEmployees();
  }

  deleteEmployee(id: number): void {
    if (confirm('Tem certeza que deseja deletar este funcionário?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          alert('Erro ao deletar funcionário: ' + error.message);
        }
      });
    }
  }

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
        alert('Erro ao gerar crachá: ' + error.message);
      }
    });
  }

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
        alert('Erro ao exportar dados: ' + error.message);
      }
    });
  }
}
```

```html
<!-- components/employee-list/employee-list.component.html -->
<div class="employee-list-container">
  <div class="header">
    <h2>Funcionários</h2>
    <div class="actions">
      <button (click)="exportEmployees('csv')" class="btn btn-secondary">
        Exportar CSV
      </button>
      <button (click)="exportEmployees('json')" class="btn btn-secondary">
        Exportar JSON
      </button>
      <a routerLink="/employees/new" class="btn btn-primary">
        Novo Funcionário
      </a>
    </div>
  </div>

  <!-- Filtros -->
  <div class="filters">
    <div class="filter-group">
      <label for="searchName">Nome:</label>
      <input 
        id="searchName"
        type="text" 
        [(ngModel)]="searchName" 
        placeholder="Buscar por nome"
        (keyup.enter)="onSearch()">
    </div>
    
    <div class="filter-group">
      <label for="searchJobFunction">Cargo:</label>
      <input 
        id="searchJobFunction"
        type="text" 
        [(ngModel)]="searchJobFunction" 
        placeholder="Buscar por cargo"
        (keyup.enter)="onSearch()">
    </div>
    
    <div class="filter-group">
      <label for="selectedStatus">Status:</label>
      <select id="selectedStatus" [(ngModel)]="selectedStatus">
        <option value="">Todos</option>
        <option value="Ativo">Ativo</option>
        <option value="Inativo">Inativo</option>
        <option value="Licença">Licença</option>
      </select>
    </div>
    
    <button (click)="onSearch()" class="btn btn-primary">Buscar</button>
  </div>

  <!-- Loading -->
  <div *ngIf="loading" class="loading">
    Carregando funcionários...
  </div>

  <!-- Error -->
  <div *ngIf="error" class="error">
    {{ error }}
  </div>

  <!-- Lista de funcionários -->
  <div *ngIf="!loading && !error" class="employees-grid">
    <div *ngFor="let employee of employees" class="employee-card">
      <div class="employee-photo">
        <img [src]="employee.photoUrl" [alt]="employee.fullName" 
             onerror="this.src='/assets/placeholder-avatar.png'">
      </div>
      
      <div class="employee-info">
        <h3>{{ employee.fullName }}</h3>
        <p class="job-function">{{ employee.jobFunctions }}</p>
        <p class="status" [class]="employee.status?.toLowerCase()">
          {{ employee.status }}
        </p>
      </div>
      
      <div class="employee-actions">
        <button (click)="generateBadge(employee.id)" class="btn btn-sm btn-secondary">
          Gerar Crachá
        </button>
        <a [routerLink]="['/employees', employee.id]" class="btn btn-sm btn-primary">
          Ver Detalhes
        </a>
        <a [routerLink]="['/employees', employee.id, 'edit']" class="btn btn-sm btn-warning">
          Editar
        </a>
        <button (click)="deleteEmployee(employee.id)" class="btn btn-sm btn-danger">
          Deletar
        </button>
      </div>
    </div>
  </div>

  <!-- Paginação -->
  <div *ngIf="totalEmployees > pageSize" class="pagination">
    <button 
      (click)="onPageChange(currentPage - 1)" 
      [disabled]="currentPage === 0"
      class="btn btn-secondary">
      Anterior
    </button>
    
    <span class="page-info">
      Página {{ currentPage + 1 }} de {{ Math.ceil(totalEmployees / pageSize) }}
      ({{ totalEmployees }} funcionários)
    </span>
    
    <button 
      (click)="onPageChange(currentPage + 1)" 
      [disabled]="(currentPage + 1) * pageSize >= totalEmployees"
      class="btn btn-secondary">
      Próxima
    </button>
  </div>
</div>
```

### 2. Formulário de Funcionário
```typescript
// components/employee-form/employee-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  selectedFile: File | null = null;
  isEditMode = false;
  employeeId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      tagName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      tagLastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      jobFunctions: ['', [Validators.minLength(2), Validators.maxLength(100)]], // Agora opcional
      birthday: [''],
      email: ['', [Validators.email]],
      phone: [''],
      mobile: [''],
      status: ['Ativo']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.employeeId = +params['id'];
        this.loadEmployee();
      }
    });
  }

  loadEmployee(): void {
    if (!this.employeeId) return;

    this.loading = true;
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          fullName: employee.fullName,
          tagName: employee.tagName,
          tagLastName: employee.tagLastName,
          jobFunctions: employee.jobFunctions,
          birthday: employee.birthday,
          email: employee.email,
          phone: employee.phone,
          mobile: employee.mobile,
          status: employee.status
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('Apenas arquivos JPG e PNG são permitidos');
        return;
      }
      
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB permitido');
        return;
      }
      
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    if (!this.isEditMode && !this.selectedFile) {
      alert('Foto é obrigatória para novos funcionários');
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.isEditMode) {
      this.updateEmployee();
    } else {
      this.createEmployee();
    }
  }

  createEmployee(): void {
    const formData = new FormData();
    const formValue = this.employeeForm.value;
    
    formData.append('fullName', formValue.fullName);
    formData.append('tagName', formValue.tagName);
    formData.append('tagLastName', formValue.tagLastName);
    if (formValue.jobFunctions) formData.append('jobFunctions', formValue.jobFunctions);
    if (formValue.birthday) formData.append('birthday', formValue.birthday);
    if (this.selectedFile) formData.append('file', this.selectedFile);

    this.employeeService.createEmployee(formData).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  updateEmployee(): void {
    if (!this.employeeId) return;

    const updateData = this.employeeForm.value;
    
    this.employeeService.updateEmployee(this.employeeId, updateData).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      this.employeeForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} é obrigatório`;
      if (field.errors['minlength']) return `${fieldName} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `${fieldName} deve ter no máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['email']) return 'Email inválido';
    }
    return '';
  }
}
```

```html
<!-- components/employee-form/employee-form.component.html -->
<div class="employee-form-container">
  <div class="header">
    <h2>{{ isEditMode ? 'Editar' : 'Novo' }} Funcionário</h2>
  </div>

  <div *ngIf="loading" class="loading">
    Carregando...
  </div>

  <div *ngIf="error" class="error">
    {{ error }}
  </div>

  <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" *ngIf="!loading" class="employee-form">
    <!-- Nome Completo -->
    <div class="form-group">
      <label for="fullName">Nome Completo *</label>
      <input 
        id="fullName"
        type="text" 
        formControlName="fullName" 
        placeholder="Digite o nome completo"
        [class.error]="getFieldError('fullName')">
      <div class="error-message" *ngIf="getFieldError('fullName')">
        {{ getFieldError('fullName') }}
      </div>
    </div>

    <!-- Nome para Crachá -->
    <div class="form-row">
      <div class="form-group">
        <label for="tagName">Nome para Crachá *</label>
        <input 
          id="tagName"
          type="text" 
          formControlName="tagName" 
          placeholder="Nome no crachá"
          [class.error]="getFieldError('tagName')">
        <div class="error-message" *ngIf="getFieldError('tagName')">
          {{ getFieldError('tagName') }}
        </div>
      </div>

      <div class="form-group">
        <label for="tagLastName">Sobrenome para Crachá *</label>
        <input 
          id="tagLastName"
          type="text" 
          formControlName="tagLastName" 
          placeholder="Sobrenome no crachá"
          [class.error]="getFieldError('tagLastName')">
        <div class="error-message" *ngIf="getFieldError('tagLastName')">
          {{ getFieldError('tagLastName') }}
        </div>
      </div>
    </div>

    <!-- Cargo (Opcional) -->
    <div class="form-group">
      <label for="jobFunctions">Cargo</label>
      <input 
        id="jobFunctions"
        type="text" 
        formControlName="jobFunctions" 
        placeholder="Digite o cargo (opcional)"
        [class.error]="getFieldError('jobFunctions')">
      <div class="error-message" *ngIf="getFieldError('jobFunctions')">
        {{ getFieldError('jobFunctions') }}
      </div>
    </div>

    <!-- Data de Nascimento -->
    <div class="form-group">
      <label for="birthday">Data de Nascimento</label>
      <input 
        id="birthday"
        type="date" 
        formControlName="birthday">
    </div>

    <!-- Foto (apenas para novos funcionários) -->
    <div class="form-group" *ngIf="!isEditMode">
      <label for="photo">Foto *</label>
      <input 
        id="photo"
        type="file" 
        (change)="onFileSelected($event)" 
        accept="image/jpeg,image/png" 
        required>
      <small class="help-text">Apenas arquivos JPG e PNG, máximo 5MB</small>
    </div>

    <!-- Campos adicionais para edição -->
    <div *ngIf="isEditMode">
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email"
          type="email" 
          formControlName="email" 
          placeholder="email@exemplo.com"
          [class.error]="getFieldError('email')">
        <div class="error-message" *ngIf="getFieldError('email')">
          {{ getFieldError('email') }}
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="phone">Telefone</label>
          <input 
            id="phone"
            type="tel" 
            formControlName="phone" 
            placeholder="(11) 1234-5678">
        </div>

        <div class="form-group">
          <label for="mobile">Celular</label>
          <input 
            id="mobile"
            type="tel" 
            formControlName="mobile" 
            placeholder="(11) 98765-4321">
        </div>
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" formControlName="status">
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
          <option value="Licença">Licença</option>
        </select>
      </div>
    </div>

    <!-- Botões -->
    <div class="form-actions">
      <button type="button" (click)="router.navigate(['/employees'])" class="btn btn-secondary">
        Cancelar
      </button>
      <button 
        type="submit" 
        [disabled]="employeeForm.invalid || loading || (!isEditMode && !selectedFile)"
        class="btn btn-primary">
        {{ isEditMode ? 'Atualizar' : 'Criar' }} Funcionário
      </button>
    </div>
  </form>
</div>
```

## 🛡️ Interceptors

### Error Interceptor
```typescript
// interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erro desconhecido';
        
        if (error.status === 0) {
          errorMessage = 'Erro de conexão. Verifique sua internet.';
        } else if (error.status === 404) {
          errorMessage = 'Recurso não encontrado.';
        } else if (error.status === 500) {
          errorMessage = 'Erro interno do servidor.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        console.error('Erro HTTP:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
```

### Loading Interceptor
```typescript
// interceptors/loading.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.loadingService.setLoading(true);
    
    return next.handle(req).pipe(
      finalize(() => this.loadingService.setLoading(false))
    );
  }
}
```

### 3. CSS para o Formulário
```scss
// employee-form.component.scss
.employee-form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  
  .header {
    margin-bottom: 30px;
    
    h2 {
      color: #333;
      margin: 0;
    }
  }
  
  .employee-form {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    
    .form-group {
      margin-bottom: 20px;
      
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
        color: #555;
        
        &:after {
          content: ' *';
          color: #dc3545;
        }
        
        &[for="jobFunctions"]:after,
        &[for="birthday"]:after,
        &[for="email"]:after,
        &[for="phone"]:after,
        &[for="mobile"]:after {
          content: '';
        }
      }
      
      input, select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        transition: border-color 0.2s;
        
        &:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
        
        &.error {
          border-color: #dc3545;
        }
      }
      
      .help-text {
        font-size: 12px;
        color: #666;
        margin-top: 5px;
      }
      
      .error-message {
        color: #dc3545;
        font-size: 12px;
        margin-top: 5px;
      }
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
    
    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
  }
  
  .loading, .error {
    text-align: center;
    padding: 40px;
    font-size: 16px;
  }
  
  .error {
    color: #dc3545;
    background: #f8d7da;
    border-radius: 8px;
  }
}
```

## 🔒 Guards

### Auth Guard (para futuro)
```typescript
// guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
```

## 📱 Exemplos de Uso

### 1. Módulo de Roteamento
```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/new', component: EmployeeFormComponent },
  { path: 'employees/:id', component: EmployeeDetailComponent },
  { path: 'employees/:id/edit', component: EmployeeFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### 2. Configuração de Interceptors
```typescript
// app.module.ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
})
export class AppModule { }
```

### 3. Exemplo de CSS
```scss
// employee-list.component.scss
.employee-list-container {
  padding: 20px;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      color: #333;
    }
    
    .actions {
      display: flex;
      gap: 10px;
    }
  }
  
  .filters {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 8px;
    
    .filter-group {
      display: flex;
      flex-direction: column;
      
      label {
        font-weight: 500;
        margin-bottom: 5px;
        color: #555;
      }
      
      input, select {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }
    }
  }
  
  .employees-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    
    .employee-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      }
      
      .employee-photo {
        text-align: center;
        margin-bottom: 15px;
        
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #e0e0e0;
        }
      }
      
      .employee-info {
        text-align: center;
        margin-bottom: 15px;
        
        h3 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 18px;
        }
        
        .job-function {
          color: #666;
          margin: 0 0 10px 0;
        }
        
        .status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          
          &.ativo {
            background: #d4edda;
            color: #155724;
          }
          
          &.inativo {
            background: #f8d7da;
            color: #721c24;
          }
          
          &.licença {
            background: #fff3cd;
            color: #856404;
          }
        }
      }
      
      .employee-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    }
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
    
    .page-info {
      color: #666;
      font-size: 14px;
    }
  }
  
  .loading, .error {
    text-align: center;
    padding: 40px;
    font-size: 16px;
  }
  
  .error {
    color: #dc3545;
    background: #f8d7da;
    border-radius: 8px;
  }
}

// Botões
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  font-size: 14px;
  transition: background-color 0.2s;
  
  &.btn-primary {
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
    }
  }
  
  &.btn-secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #545b62;
    }
  }
  
  &.btn-warning {
    background: #ffc107;
    color: #212529;
    
    &:hover {
      background: #e0a800;
    }
  }
  
  &.btn-danger {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
    }
  }
  
  &.btn-sm {
    padding: 4px 8px;
    font-size: 12px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

## 🚀 Próximos Passos

1. **Implementar autenticação JWT**
2. **Adicionar validações mais robustas**
3. **Implementar upload de múltiplos arquivos**
4. **Adicionar notificações toast**
5. **Implementar cache local**
6. **Adicionar testes unitários**
7. **Implementar PWA features**

Este guia fornece uma base sólida para integrar o frontend Angular com o backend Maple ERP. Adapte conforme suas necessidades específicas!