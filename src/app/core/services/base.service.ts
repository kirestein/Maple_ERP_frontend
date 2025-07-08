import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected apiUrl: string;
  protected envService: EnvironmentService;

  constructor(protected http: HttpClient, envService?: EnvironmentService) {
    this.envService = envService || new EnvironmentService();
    this.apiUrl = this.envService.apiUrl;
  }

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
        errorMessage = this.envService.config.errorMessages.network;
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
        errorMessage = this.envService.config.errorMessages.server;
        break;
      case 503:
        errorMessage = 'Serviços indisponíveis. Tente novamente mais tarde.';
        break;
      default:
        errorMessage = this.envService.config.errorMessages.default;
        break;
    }

    this.envService.log('Erro na API:', error);
    return throwError(() => new Error(errorMessage));
  }
}