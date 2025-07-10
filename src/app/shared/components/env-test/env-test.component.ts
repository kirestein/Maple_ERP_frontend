import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-env-test',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="env-test-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>settings</mat-icon>
          Teste de Variáveis de Ambiente
        </mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div class="env-info">
          <h3>🌍 Configurações da API</h3>
          <div class="env-item">
            <strong>Environment:</strong> 
            <span [class]="getEnvironmentClass()">{{ environment }}</span>
          </div>
          <div class="env-item">
            <strong>API URL:</strong> 
            <span class="api-url">{{ apiUrl }}</span>
          </div>
          <div class="env-item">
            <strong>App Name:</strong> {{ appName }}
          </div>
          <div class="env-item">
            <strong>App Version:</strong> {{ appVersion }}
          </div>
          
          <h3>🔧 Configurações de Debug</h3>
          <div class="env-item">
            <strong>Debug Logs:</strong> 
            <span [class]="debugLogs === 'true' ? 'enabled' : 'disabled'">
              {{ debugLogs === 'true' ? 'Habilitado' : 'Desabilitado' }}
            </span>
          </div>
          
          <h3>📁 Configurações de Upload</h3>
          <div class="env-item">
            <strong>Tamanho Máximo:</strong> {{ formatFileSize(maxFileSize) }}
          </div>
          <div class="env-item">
            <strong>Tipos Permitidos:</strong> {{ allowedFileTypes }}
          </div>
          
          <h3>📄 Configurações de Paginação</h3>
          <div class="env-item">
            <strong>Tamanho Padrão da Página:</strong> {{ defaultPageSize }}
          </div>
          
          <h3>🔗 Endpoints da API</h3>
          <div class="env-item">
            <strong>Employees:</strong> {{ apiUrl }}{{ employeesEndpoint }}
          </div>
          <div class="env-item">
            <strong>Health Check:</strong> {{ apiUrl }}{{ healthEndpoint }}
          </div>
        </div>
        
        <div class="test-actions">
          <button mat-raised-button color="primary" (click)="testApiConnection()">
            <mat-icon>wifi</mat-icon>
            Testar Conexão API
          </button>
          
          <button mat-raised-button color="accent" (click)="logAllEnvVars()">
            <mat-icon>bug_report</mat-icon>
            Log Todas as Variáveis
          </button>
        </div>
        
        <div *ngIf="testResult" class="test-result" [class]="testResult.success ? 'success' : 'error'">
          <mat-icon>{{ testResult.success ? 'check_circle' : 'error' }}</mat-icon>
          {{ testResult.message }}
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .env-test-card {
      max-width: 800px;
      margin: 20px auto;
    }
    
    .env-info {
      margin: 20px 0;
    }
    
    .env-item {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      padding: 8px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    
    .env-item strong {
      color: #333;
    }
    
    .api-url {
      color: #1976d2;
      font-family: monospace;
    }
    
    .production {
      color: #4caf50;
      font-weight: bold;
    }
    
    .development {
      color: #ff9800;
      font-weight: bold;
    }
    
    .enabled {
      color: #4caf50;
    }
    
    .disabled {
      color: #f44336;
    }
    
    .test-actions {
      display: flex;
      gap: 15px;
      margin: 20px 0;
    }
    
    .test-result {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
    }
    
    .test-result.success {
      background: #d4edda;
      color: #155724;
    }
    
    .test-result.error {
      background: #f8d7da;
      color: #721c24;
    }
    
    h3 {
      color: #1976d2;
      margin: 20px 0 10px 0;
    }
  `]
})
export class EnvTestComponent {
  // Variáveis de ambiente
  environment = this.getEnvVar('VITE_APP_ENVIRONMENT', 'unknown');
  apiUrl = this.getApiUrl();
  appName = this.getEnvVar('VITE_APP_NAME', 'Unknown App');
  appVersion = this.getEnvVar('VITE_APP_VERSION', '0.0.0');
  debugLogs = this.getEnvVar('VITE_ENABLE_DEBUG_LOGS', 'false');
  maxFileSize = this.getEnvVar('VITE_MAX_FILE_SIZE', '5242880');
  allowedFileTypes = this.getEnvVar('VITE_ALLOWED_FILE_TYPES', 'image/jpeg,image/png');
  defaultPageSize = this.getEnvVar('VITE_DEFAULT_PAGE_SIZE', '20');
  employeesEndpoint = this.getEnvVar('VITE_API_EMPLOYEES_ENDPOINT', '/employees');
  healthEndpoint = this.getEnvVar('VITE_API_HEALTH_ENDPOINT', '/health-check');
  
  testResult: { success: boolean; message: string } | null = null;

  private getEnvVar(key: string, defaultValue: string = ''): string {
    // Tentar diferentes formas de acessar as variáveis
    if (typeof window !== 'undefined' && (window as any).env) {
      return (window as any).env[key] || defaultValue;
    }
    
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return (import.meta.env as any)[key] || defaultValue;
    }
    
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || defaultValue;
    }
    
    return defaultValue;
  }

  private getApiUrl(): string {
    const environment = this.getEnvVar('VITE_APP_ENVIRONMENT', 'development');
    
    if (environment === 'production') {
      return this.getEnvVar('VITE_API_URL_PROD', 'https://maple-erp-backend.onrender.com');
    } else {
      return this.getEnvVar('VITE_API_URL_DEV', 'http://localhost:4000');
    }
  }

  getEnvironmentClass(): string {
    return this.environment === 'production' ? 'production' : 'development';
  }

  formatFileSize(bytes: string): string {
    const size = parseInt(bytes);
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }

  async testApiConnection(): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}${this.healthEndpoint}`);
      
      if (response.ok) {
        const data = await response.json();
        this.testResult = {
          success: true,
          message: `✅ API conectada! Status: ${data.status || 'OK'}`
        };
      } else {
        this.testResult = {
          success: false,
          message: `❌ API retornou erro: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      this.testResult = {
        success: false,
        message: `❌ Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  logAllEnvVars(): void {
    console.group('🔧 Variáveis de Ambiente - Maple ERP');
    
    const envVars = [
      'VITE_APP_ENVIRONMENT',
      'VITE_API_URL_DEV',
      'VITE_API_URL_PROD',
      'VITE_APP_NAME',
      'VITE_APP_VERSION',
      'VITE_ENABLE_DEBUG_LOGS',
      'VITE_API_EMPLOYEES_ENDPOINT',
      'VITE_API_HEALTH_ENDPOINT',
      'VITE_MAX_FILE_SIZE',
      'VITE_ALLOWED_FILE_TYPES',
      'VITE_DEFAULT_PAGE_SIZE'
    ];
    
    envVars.forEach(varName => {
      const value = this.getEnvVar(varName, 'NOT_SET');
      console.log(`${varName}:`, value);
    });
    
    console.log('🌍 API URL Atual:', this.apiUrl);
    console.log('🔗 Health Check URL:', `${this.apiUrl}${this.healthEndpoint}`);
    
    console.groupEnd();
    
    alert('Variáveis logadas no console! Abra o DevTools (F12) para ver.');
  }
}