import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { Employee } from '../../shared/models/employee.model';

// Interfaces para responses da API
export interface SearchEmployeesResponse {
  employees: Employee[];
  total: number;
  limit: number;
  offset: number;
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
  // Informações básicas
  fullName?: string;
  email?: string;
  tagName?: string;
  tagLastName?: string;
  birthday?: string;
  gender?: string;
  maritalStatus?: string;
  skinColor?: string;
  graduation?: string;
  naturalness?: string;
  nationality?: string;
  fatherName?: string;
  motherName?: string;
  
  // Documentos
  cpf?: string;
  rg?: string;
  rgEmitter?: string;
  rgEmissionDate?: string;
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
  driversLicenseCategory?: string;
  driversLicenseEmissionDate?: string;
  driversLicenseExpirationDate?: string;
  
  // Contato e endereço
  phone?: string;
  mobile?: string;
  cep?: string;
  employeeAddress?: string;
  employeeAddressNumber?: string;
  employeeAddressComplement?: string;
  employeeNeighborhood?: string;
  employeeAddressCity?: string;
  employeeAddressState?: string;
  
  // Informações familiares
  partnerName?: string;
  partnerCpf?: string;
  partnerBirthday?: string;
  partnerRg?: string;
  
  // Informações profissionais
  jobPosition?: string;
  jobFunctions?: string;
  admissionDate?: string;
  period?: string;
  contractExpirationDate?: string;
  dailyHours?: string;
  weeklyHours?: string;
  monthlyHours?: string;
  weeklyClasses?: string;
  hasAccumulate?: boolean;
  hasAccumulateCompany?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  
  // Informações financeiras
  salary?: number;
  salaryBank?: string;
  salaryAgency?: string;
  salaryAccount?: string;
  salaryAccountType?: string;
  familySalary?: number;
  parenting?: string;
  IRPF?: string;
  
  // Benefícios
  mealValue?: number;
  transport?: boolean;
  trasportType?: string; // Note: API usa 'trasportType' (com 1 's')
  transportValue?: number;
  healthPlan?: string;
  healthCardNumber?: string;
  deficiency?: boolean;
  deficiencyDescription?: string;
  
  // Informações universitárias
  college?: string;
  course?: string;
  trainingPeriod?: string;
  ra?: string;
  collegeCep?: string;
  traineeAddress?: string;
  traineeAddressNumber?: number;
  traineeAddressNeighborhood?: string;
  traineeAddressComplement?: string;
  traineeAddressCity?: string;
  traineeAddressState?: string;
  lifInsurancePolicy?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService extends BaseService {
  private endpoint = '/employees';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Retrieves all employees from the backend.
   * @returns Observable<Employee[]> - List of all employees.
   */
  getEmployees(): Observable<Employee[]> {
    return this.http
      .get<Employee[]>(`${this.apiUrl}${this.endpoint}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves all employees (alias for getEmployees for compatibility)
   */
  getAllEmployees(): Observable<Employee[]> {
    return this.getEmployees();
  }

  /**
   * Retrieves a specific employee by ID.
   * @param id The ID of the employee to retrieve.
   * @returns Observable<Employee> - The employee data.
   */
  getEmployeeById(id: string | number): Observable<Employee> {
    return this.http
      .get<Employee>(`${this.apiUrl}${this.endpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Creates a new employee by sending form data (including photo) to the backend.
   * @param employeeData FormData containing employee details and the photo file.
   * @returns Observable<Employee> - The created employee data.
   */
  createEmployee(employeeData: FormData): Observable<Employee> {
    return this.http
      .post<Employee>(`${this.apiUrl}${this.endpoint}`, employeeData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Updates an existing employee.
   * @param id The ID of the employee to update.
   * @param employeeData Updated employee data (JSON only, no file upload for updates).
   * @returns Observable<Employee> - The updated employee data.
   */
  updateEmployee(
    id: string | number,
    employeeData: UpdateEmployeeRequest
  ): Observable<Employee> {
    console.log('EmployeeService.updateEmployee chamado com:');
    console.log('ID:', id);
    console.log('Dados:', employeeData);
    console.log('URL da requisição:', `${this.apiUrl}${this.endpoint}/${id}`);
    
    return this.http
      .put<Employee>(`${this.apiUrl}${this.endpoint}/${id}`, employeeData)
      .pipe(
        map((response: Employee) => {
          console.log('Resposta do servidor (updateEmployee):', response);
          return response;
        }),
        catchError((error) => {
          console.error('Erro no updateEmployee:', error);
          return this.handleError(error);
        })
      );
  }

  /**
   * Deletes an employee from the system.
   * @param id The ID of the employee to delete.
   * @returns Observable<{message: string, deletedId: number}> - The response from the backend.
   */
  deleteEmployee(id: string | number): Observable<{message: string, deletedId: number}> {
    return this.http
      .delete<{message: string, deletedId: number}>(`${this.apiUrl}${this.endpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Search employees with filters and pagination.
   * @param params Search parameters
   * @returns Observable<SearchEmployeesResponse> - Search results with pagination
   */
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

  /**
   * Generates individual employee badge PDF.
   * @param id The ID of the employee.
   * @returns Observable<Blob> - The PDF content as a Blob.
   */
  generateBadge(id: string | number): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}${this.endpoint}/${id}/badge`, {
        responseType: 'blob'
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves the employee badge PDF from the backend (alias for compatibility).
   * @param id The ID of the employee.
   * @returns Observable<Blob> - The PDF content as a Blob.
   */
  getBadge(id: string | number): Observable<Blob> {
    return this.generateBadge(id);
  }

  /**
   * Generates multiple employee badges in a single PDF.
   * @param employeeIds Array of employee IDs
   * @returns Observable<Blob> - The PDF content as a Blob.
   */
  generateMultipleBadges(employeeIds: number[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}${this.endpoint}/badges`, 
      { employeeIds }, 
      { responseType: 'blob' }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Exports employee data in CSV or JSON format.
   * @param format Export format ('csv' or 'json')
   * @param status Optional status filter
   * @returns Observable<Blob> - The exported file as a Blob.
   */
  exportEmployees(format: 'csv' | 'json' = 'csv', status?: string): Observable<Blob> {
    const params = new URLSearchParams();
    params.append('format', format);
    if (status) params.append('status', status);

    return this.http.get(`${this.apiUrl}${this.endpoint}/export?${params.toString()}`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  /**
   * Retrieves the employee document PDF (for accountant) from the backend.
   * @param id The ID of the employee.
   * @returns Observable<Blob> - The PDF content as a Blob.
   */
  getDocument(id: string | number): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}${this.endpoint}/${id}/document`, {
        responseType: 'blob'
      })
      .pipe(catchError(this.handleError));
  }


}
