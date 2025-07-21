import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
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
};