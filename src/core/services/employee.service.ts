import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../../shared/models/employee.model';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly API_URL = 'http://localhost:3000/api'; // Configurar URL da API
  private readonly EMPLOYEES_ENDPOINT = `${this.API_URL}/employees`;
  
  // BehaviorSubject para cache de funcionários
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$ = this.employeesSubject.asObservable();
  
  // Loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Headers padrão para as requisições
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  /**
   * Headers para upload de arquivos (FormData)
   */
  private getFormDataHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json'
      // Não definir Content-Type para FormData, o navegador faz isso automaticamente
    });
  }

  /**
   * Tratamento de erros HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro inesperado no servidor';
    
    if (error.error instanceof ErrorEvent) {
      // Erro no cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro no servidor
      switch (error.status) {
        case 0:
          errorMessage = 'Servidor não disponível. Verifique sua conexão de internet.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Dados inválidos enviados.';
          break;
        case 401:
          errorMessage = 'Não autorizado. Faça login novamente.';
          break;
        case 403:
          errorMessage = 'Acesso negado.';
          break;
        case 404:
          errorMessage = 'Funcionário não encontrado.';
          break;
        case 422:
          errorMessage = error.error?.message || 'Erro de validação dos dados.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor.';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.error?.message || error.message}`;
      }
    }
    
    console.error('Erro no EmployeeService:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Simular resposta da API quando o backend não estiver disponível
   */
  private simulateApiResponse<T>(data: T, delay: number = 1000): Observable<ApiResponse<T>> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          success: true,
          data: data,
          message: 'Operação simulada com sucesso (backend não disponível)'
        });
        observer.complete();
      }, delay);
    });
  }

  /**
   * Buscar todos os funcionários com paginação
   */
  getAllEmployees(page: number = 1, limit: number = 10, search?: string): Observable<PaginatedResponse<Employee>> {
    this.loadingSubject.next(true);
    
    let params = `?page=${page}&limit=${limit}`;
    if (search) {
      params += `&search=${encodeURIComponent(search)}`;
    }
    
    return this.http.get<ApiResponse<PaginatedResponse<Employee>>>(`${this.EMPLOYEES_ENDPOINT}${params}`, {
      headers: this.getHeaders()
    }).pipe(
      retry(1), // Tentar novamente uma vez em caso de erro
      map(response => response.data),
      catchError(error => {
        this.loadingSubject.next(false);
        
        // Se o servidor não estiver disponível, simular dados
        if (error.status === 0) {
          console.warn('Backend não disponível. Simulando dados...');
          const mockData: PaginatedResponse<Employee> = {
            data: this.getMockEmployees(),
            total: 3,
            page: 1,
            limit: 10,
            totalPages: 1
          };
          return this.simulateApiResponse(mockData).pipe(map(res => res.data));
        }
        
        return this.handleError(error);
      }),
      map(data => {
        this.loadingSubject.next(false);
        this.employeesSubject.next(data.data);
        return data;
      })
    );
  }

  /**
   * Buscar funcionário por ID
   */
  getEmployeeById(id: string): Observable<Employee> {
    this.loadingSubject.next(true);
    
    return this.http.get<ApiResponse<Employee>>(`${this.EMPLOYEES_ENDPOINT}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      retry(1),
      map(response => response.data),
      catchError(error => {
        this.loadingSubject.next(false);
        
        if (error.status === 0) {
          console.warn('Backend não disponível. Simulando dados...');
          const mockEmployee = this.getMockEmployees().find(emp => emp.id === id);
          if (mockEmployee) {
            return this.simulateApiResponse(mockEmployee).pipe(map(res => res.data));
          }
        }
        
        return this.handleError(error);
      }),
      map(data => {
        this.loadingSubject.next(false);
        return data;
      })
    );
  }

  /**
   * Criar novo funcionário
   */
  createEmployee(employeeData: FormData): Observable<Employee> {
    this.loadingSubject.next(true);
    
    return this.http.post<ApiResponse<Employee>>(this.EMPLOYEES_ENDPOINT, employeeData, {
      headers: this.getFormDataHeaders()
    }).pipe(
      retry(1),
      map(response => response.data),
      catchError(error => {
        this.loadingSubject.next(false);
        
        if (error.status === 0) {
          console.warn('Backend não disponível. Simulando criação...');
          const mockEmployee: Employee = {
            id: Date.now().toString(),
            fullName: 'Funcionário Simulado',
            email: 'simulado@empresa.com',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          return this.simulateApiResponse(mockEmployee).pipe(map(res => res.data));
        }
        
        return this.handleError(error);
      }),
      map(data => {
        this.loadingSubject.next(false);
        // Atualizar cache local
        const currentEmployees = this.employeesSubject.value;
        this.employeesSubject.next([...currentEmployees, data]);
        return data;
      })
    );
  }

  /**
   * Atualizar funcionário existente
   */
  updateEmployee(id: string, employeeData: FormData): Observable<Employee> {
    this.loadingSubject.next(true);
    
    return this.http.put<ApiResponse<Employee>>(`${this.EMPLOYEES_ENDPOINT}/${id}`, employeeData, {
      headers: this.getFormDataHeaders()
    }).pipe(
      retry(1),
      map(response => response.data),
      catchError(error => {
        this.loadingSubject.next(false);
        
        if (error.status === 0) {
          console.warn('Backend não disponível. Simulando atualização...');
          const mockEmployee: Employee = {
            id: id,
            fullName: 'Funcionário Atualizado',
            email: 'atualizado@empresa.com',
            updatedAt: new Date()
          };
          return this.simulateApiResponse(mockEmployee).pipe(map(res => res.data));
        }
        
        return this.handleError(error);
      }),
      map(data => {
        this.loadingSubject.next(false);
        // Atualizar cache local
        const currentEmployees = this.employeesSubject.value;
        const updatedEmployees = currentEmployees.map(emp => emp.id === id ? data : emp);
        this.employeesSubject.next(updatedEmployees);
        return data;
      })
    );
  }

  /**
   * Deletar funcionário
   */
  deleteEmployee(id: string): Observable<boolean> {
    this.loadingSubject.next(true);
    
    return this.http.delete<ApiResponse<boolean>>(`${this.EMPLOYEES_ENDPOINT}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      retry(1),
      map(response => response.data),
      catchError(error => {
        this.loadingSubject.next(false);
        
        if (error.status === 0) {
          console.warn('Backend não disponível. Simulando exclusão...');
          return this.simulateApiResponse(true).pipe(map(res => res.data));
        }
        
        return this.handleError(error);
      }),
      map(data => {
        this.loadingSubject.next(false);
        // Atualizar cache local
        const currentEmployees = this.employeesSubject.value;
        const filteredEmployees = currentEmployees.filter(emp => emp.id !== id);
        this.employeesSubject.next(filteredEmployees);
        return data;
      })
    );
  }

  /**
   * Buscar funcionários com filtros
   */
  searchEmployees(filters: {
    name?: string;
    department?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Employee>> {
    this.loadingSubject.next(true);
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    return this.http.get<ApiResponse<PaginatedResponse<Employee>>>(`${this.EMPLOYEES_ENDPOINT}/search?${params}`, {
      headers: this.getHeaders()
    }).pipe(
      retry(1),
      map(response => response.data),
      catchError(error => {
        this.loadingSubject.next(false);
        
        if (error.status === 0) {
          console.warn('Backend não disponível. Simulando busca...');
          const mockData: PaginatedResponse<Employee> = {
            data: this.getMockEmployees().filter(emp => 
              !filters.name || emp.fullName?.toLowerCase().includes(filters.name.toLowerCase())
            ),
            total: 1,
            page: filters.page || 1,
            limit: filters.limit || 10,
            totalPages: 1
          };
          return this.simulateApiResponse(mockData).pipe(map(res => res.data));
        }
        
        return this.handleError(error);
      }),
      map(data => {
        this.loadingSubject.next(false);
        return data;
      })
    );
  }

  /**
   * Dados mock para desenvolvimento/teste
   */
  private getMockEmployees(): Employee[] {
    return [
      {
        id: '1',
        fullName: 'João Silva',
        email: 'joao.silva@maplebear.com.br',
        cpf: '123.456.789-00',
        phone: '(11) 99999-9999',
        jobPosition: 'PROFESSOR' as any,
        status: 'ACTIVE' as any,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        fullName: 'Maria Santos',
        email: 'maria.santos@maplebear.com.br',
        cpf: '987.654.321-00',
        phone: '(11) 88888-8888',
        jobPosition: 'COORDENADOR' as any,
        status: 'ACTIVE' as any,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      },
      {
        id: '3',
        fullName: 'Pedro Oliveira',
        email: 'pedro.oliveira@maplebear.com.br',
        cpf: '456.789.123-00',
        phone: '(11) 77777-7777',
        jobPosition: 'AUXILIAR' as any,
        status: 'INACTIVE' as any,
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-05')
      }
    ];
  }

  /**
   * Método utilitário para verificar se o serviço está online
   */
  checkHealth(): Observable<boolean> {
    return this.http.get<{ status: string }>(`${this.API_URL}/health`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.status === 'ok'),
      catchError(() => {
        console.warn('Backend não disponível');
        return [false];
      })
    );
  }

  /**
   * Limpar cache de funcionários
   */
  clearCache(): void {
    this.employeesSubject.next([]);
  }

  /**
   * Método para debug - logs do estado atual
   */
  logCurrentState(): void {
    console.log('EmployeeService State:', {
      employees: this.employeesSubject.value,
      loading: this.loadingSubject.value,
      apiUrl: this.API_URL
    });
  }
}