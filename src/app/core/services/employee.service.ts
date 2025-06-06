import { Injectable } from \'@angular/core\';
import { HttpClient } from \'@angular/common/http\';
import { Observable } from \'rxjs\';

// Import Employee model if needed for type hints, although FormData hides details
// import { Employee } from \'../../shared/models/employee.model\';

@Injectable({
  providedIn: \'root\'
})
export class EmployeeService {
  // Base URL for the backend API (adjust if needed)
  private API_URL = \'http://localhost:4000/employees\'; // As specified by Mariana

  constructor(private http: HttpClient) { }

  /**
   * Creates a new employee by sending form data (including photo) to the backend.
   * @param data FormData containing employee details and the photo file.
   * @returns Observable<any> - The response from the backend (adjust type as needed).
   */
  createEmployee(data: FormData): Observable<any> { // Use FormData for file uploads
    return this.http.post<any>(this.API_URL, data);
    // Consider adding error handling (e.g., using catchError operator)
  }

  /**
   * Retrieves the employee badge PDF from the backend.
   * @param id The ID of the employee.
   * @returns Observable<Blob> - The PDF content as a Blob.
   */
  getBadge(id: string | number): Observable<Blob> { // Accept string or number for ID
    return this.http.get(`${this.API_URL}/${id}/badge`, {
      responseType: \'blob\' // Important: ensures the response is treated as a file blob
    });
  }

  /**
   * Retrieves the employee document PDF (for accountant) from the backend.
   * @param id The ID of the employee.
   * @returns Observable<Blob> - The PDF content as a Blob.
   */
  getDocument(id: string | number): Observable<Blob> { // Accept string or number for ID
    return this.http.get(`${this.API_URL}/${id}/document`, {
      responseType: \'blob\' // Important: ensures the response is treated as a file blob
    });
  }

  // Add other methods later as needed (e.g., getEmployees, getEmployeeById, update, delete)
}

