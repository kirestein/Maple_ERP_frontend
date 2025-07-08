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