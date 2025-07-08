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