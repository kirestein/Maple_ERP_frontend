import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HealthService, HealthStatus } from '../../../core/services/health.service';

@Component({
  selector: 'app-health-check',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <mat-card class="health-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>health_and_safety</mat-icon>
          Status da API
        </mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div *ngIf="isLoading" class="loading">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Verificando status...</p>
        </div>
        
        <div *ngIf="!isLoading && healthStatus" class="health-info">
          <div class="status-item">
            <mat-icon [class]="getStatusClass()">{{ getStatusIcon() }}</mat-icon>
            <span>Status: {{ healthStatus.status }}</span>
          </div>
          
          <div class="status-item">
            <mat-icon>schedule</mat-icon>
            <span>Uptime: {{ formatUptime(healthStatus.uptime) }}</span>
          </div>
          
          <div class="status-item">
            <mat-icon>storage</mat-icon>
            <span>Database: {{ healthStatus.database }}</span>
          </div>
          
          <div class="status-item">
            <mat-icon>cloud</mat-icon>
            <span>Cloudinary: {{ healthStatus.cloudinary }}</span>
          </div>
          
          <div class="status-item">
            <mat-icon>info</mat-icon>
            <span>Environment: {{ healthStatus.environment }}</span>
          </div>
          
          <div class="status-item">
            <mat-icon>label</mat-icon>
            <span>Version: {{ healthStatus.version }}</span>
          </div>
        </div>
        
        <div *ngIf="!isLoading && error" class="error">
          <mat-icon>error</mat-icon>
          <p>{{ error }}</p>
        </div>
      </mat-card-content>
      
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="checkHealth()" [disabled]="isLoading">
          <mat-icon>refresh</mat-icon>
          Verificar Novamente
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .health-card {
      max-width: 500px;
      margin: 20px auto;
    }
    
    .loading {
      text-align: center;
      padding: 20px;
    }
    
    .health-info {
      padding: 10px 0;
    }
    
    .status-item {
      display: flex;
      align-items: center;
      margin: 10px 0;
      gap: 10px;
    }
    
    .status-ok {
      color: #4caf50;
    }
    
    .status-error {
      color: #f44336;
    }
    
    .status-warning {
      color: #ff9800;
    }
    
    .error {
      text-align: center;
      color: #f44336;
      padding: 20px;
    }
    
    .error mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
  `]
})
export class HealthCheckComponent implements OnInit {
  healthStatus: HealthStatus | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private healthService: HealthService) {}

  ngOnInit(): void {
    this.checkHealth();
  }

  checkHealth(): void {
    this.isLoading = true;
    this.error = null;
    this.healthStatus = null;

    this.healthService.checkHealth().subscribe({
      next: (status) => {
        this.healthStatus = status;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Erro ao verificar status da API';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(): string {
    if (!this.healthStatus) return '';
    
    switch (this.healthStatus.status) {
      case 'ok':
        return 'status-ok';
      case 'degraded':
        return 'status-warning';
      default:
        return 'status-error';
    }
  }

  getStatusIcon(): string {
    if (!this.healthStatus) return 'help';
    
    switch (this.healthStatus.status) {
      case 'ok':
        return 'check_circle';
      case 'degraded':
        return 'warning';
      default:
        return 'error';
    }
  }

  formatUptime(uptime: number): string {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  }
}