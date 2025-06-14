import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Employee } from '../../shared/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // Base URL for the backend API
  private API_URL = 'https://maple-erp-backend.onrender.com/employees';

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all employees from the backend.
   * @returns Observable<Employee[]> - List of all employees.
   */
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.API_URL)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Retrieves a specific employee by ID.
   * @param id The ID of the employee to retrieve.
   * @returns Observable<Employee> - The employee data.
   */
  getEmployeeById(id: string | number): Observable<Employee> {
    return this.http.get<Employee>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Creates a new employee by sending form data (including photo) to the backend.
   * @param data FormData containing employee details and the photo file.
   * @returns Observable<Employee> - The created employee data.
   */
  createEmployee(data: FormData): Observable<Employee> {
    return this.http.post<Employee>(this.API_URL, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Updates an existing employee.
   * @param id The ID of the employee to update.
   * @param data FormData or Employee object containing updated employee details.
   * @returns Observable<Employee> - The updated employee data.
   */
  updateEmployee(id: string | number, data: FormData | Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.API_URL}/${id}`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Deletes an employee from the system.
   * @param id The ID of the employee to delete.
   * @returns Observable<any> - The response from the backend.
   */
  deleteEmployee(id: string | number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Retrieves the employee badge PDF from the backend.
   * @param id The ID of the employee.
   * @returns Observable<Blob> - The PDF content as a Blob.
   */
  getBadge(id: string | number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/${id}/badge`, {
      responseType: 'blob' // Important: ensures the response is treated as a file blob
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves the employee document PDF (for accountant) from the backend.
   * @param id The ID of the employee.
   * @returns Observable<Blob> - The PDF content as a Blob.
   */
  getDocument(id: string | number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/${id}/document`, {
      responseType: 'blob' // Important: ensures the response is treated as a file blob
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Generic error handler for HTTP requests.
   * @param error The HTTP error response.
   * @returns Observable<never> - An observable that errors with a user-friendly message.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro na comunicação com o servidor.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Código: ${error.status}, Mensagem: ${error.message}`;
      
      // Add more specific error messages based on status codes
      switch (error.status) {
        case 404:
          errorMessage = 'Recurso não encontrado no servidor.';
          break;
        case 403:
          errorMessage = 'Acesso negado. Você não tem permissão para esta operação.';
          break;
        case 401:
          errorMessage = 'Não autorizado. Faça login novamente.';
          break;
        case 400:
          errorMessage = 'Requisição inválida. Verifique os dados enviados.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
      }
    }
    
    console.error('Erro na requisição:', error);
    return throwError(() => new Error(errorMessage));
  }
}
