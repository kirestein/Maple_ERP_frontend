import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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

    // Mensagens específicas por status code
    switch (error.status) {
      case 0:
        errorMessage = 'Erro de conexão. Verifique sua internet e se o servidor está rodando.';
        break;
      case 400:
        errorMessage = error.error?.message || 'Dados inválidos. Verifique os campos obrigatórios.';
        break;
      case 403:
        errorMessage = 'Erro de CORS. Verifique se a URL está configurada no backend.';
        break;
      case 404:
        errorMessage = 'Recurso não encontrado.';
        break;
      case 409:
        errorMessage = 'Dados duplicados. Verifique se o funcionário já existe.';
        break;
      case 500:
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        break;
      case 503:
        errorMessage = 'Serviços indisponíveis. Tente novamente mais tarde.';
        break;
    }

    console.error('Erro na API:', error);
    return throwError(() => new Error(errorMessage));
  }
}