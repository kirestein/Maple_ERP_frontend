import { Injectable } from '@angular/core';

export interface AppEnvironment {
  production: boolean;
  apiUrl: string;
  appName: string;
  appVersion: string;
  endpoints: {
    employees: string;
    healthCheck: string;
    template: string;
  };
  fileUpload: {
    maxSize: number;
    allowedTypes: string[];
  };
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };
  ui: {
    defaultLanguage: string;
    dateFormat: string;
    currency: string;
  };
  features: {
    enableHealthCheck: boolean;
    enableExportFeatures: boolean;
    enableBadgeGeneration: boolean;
    enableMultipleBadgeGeneration: boolean;
  };
  errorMessages: {
    default: string;
    network: string;
    server: string;
  };
  timeouts: {
    loading: number;
    request: number;
  };
  debug: {
    enableLogs: boolean;
    enableMockData: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private environment: AppEnvironment;

  constructor() {
    this.environment = this.loadEnvironment();
  }

  private loadEnvironment(): AppEnvironment {
    const isProduction = this.getEnvVar('VITE_APP_ENVIRONMENT') === 'production';
    
    // TEMPORARY FIX: Forçar uso da API de produção
    const apiUrl = 'https://maple-erp-backend.onrender.com';
    
    return {
      production: isProduction,
      apiUrl: apiUrl,
      appName: this.getEnvVar('VITE_APP_NAME', 'Maple ERP Frontend'),
      appVersion: this.getEnvVar('VITE_APP_VERSION', '1.0.0'),
      endpoints: {
        employees: this.getEnvVar('VITE_API_EMPLOYEES_ENDPOINT', '/employees'),
        healthCheck: this.getEnvVar('VITE_API_HEALTH_ENDPOINT', '/health-check'),
        template: this.getEnvVar('VITE_API_TEMPLATE_ENDPOINT', '/template-cracha')
      },
      fileUpload: {
        maxSize: parseInt(this.getEnvVar('VITE_MAX_FILE_SIZE', '5242880')),
        allowedTypes: this.getEnvVar('VITE_ALLOWED_FILE_TYPES', 'image/jpeg,image/png,image/jpg').split(',')
      },
      pagination: {
        defaultPageSize: parseInt(this.getEnvVar('VITE_DEFAULT_PAGE_SIZE', '20')),
        maxPageSize: parseInt(this.getEnvVar('VITE_MAX_PAGE_SIZE', '100'))
      },
      ui: {
        defaultLanguage: this.getEnvVar('VITE_DEFAULT_LANGUAGE', 'pt-BR'),
        dateFormat: this.getEnvVar('VITE_DATE_FORMAT', 'DD/MM/YYYY'),
        currency: this.getEnvVar('VITE_CURRENCY', 'BRL')
      },
      features: {
        enableHealthCheck: this.getBooleanEnvVar('VITE_ENABLE_HEALTH_CHECK', true),
        enableExportFeatures: this.getBooleanEnvVar('VITE_ENABLE_EXPORT_FEATURES', true),
        enableBadgeGeneration: this.getBooleanEnvVar('VITE_ENABLE_BADGE_GENERATION', true),
        enableMultipleBadgeGeneration: this.getBooleanEnvVar('VITE_ENABLE_MULTIPLE_BADGE_GENERATION', true)
      },
      errorMessages: {
        default: this.getEnvVar('VITE_DEFAULT_ERROR_MESSAGE', 'Ocorreu um erro inesperado. Tente novamente.'),
        network: this.getEnvVar('VITE_NETWORK_ERROR_MESSAGE', 'Erro de conexão. Verifique sua internet.'),
        server: this.getEnvVar('VITE_SERVER_ERROR_MESSAGE', 'Erro interno do servidor. Tente novamente mais tarde.')
      },
      timeouts: {
        loading: parseInt(this.getEnvVar('VITE_LOADING_TIMEOUT', '30000')),
        request: parseInt(this.getEnvVar('VITE_REQUEST_TIMEOUT', '10000'))
      },
      debug: {
        enableLogs: this.getBooleanEnvVar('VITE_ENABLE_DEBUG_LOGS', false),
        enableMockData: this.getBooleanEnvVar('VITE_ENABLE_MOCK_DATA', false)
      }
    };
  }

  private getEnvVar(key: string, defaultValue: string = ''): string {
    // Primeiro, tentar import.meta.env (Vite)
    try {
      if (import.meta && import.meta.env) {
        return import.meta.env[key] || defaultValue;
      }
    } catch (e) {
      // import.meta não disponível
    }
    
    // Fallback para window.env (para build)
    if (typeof window !== 'undefined' && (window as any).env) {
      return (window as any).env[key] || defaultValue;
    }
    
    // Fallback para process.env (se disponível)
    if (typeof process !== 'undefined' && process?.env) {
      return process.env[key] || defaultValue;
    }
    
    return defaultValue;
  }

  private getBooleanEnvVar(key: string, defaultValue: boolean = false): boolean {
    const value = this.getEnvVar(key, defaultValue.toString());
    return value.toLowerCase() === 'true';
  }

  // Getters públicos
  get config(): AppEnvironment {
    return this.environment;
  }

  get apiUrl(): string {
    return this.environment.apiUrl;
  }

  get isProduction(): boolean {
    return this.environment.production;
  }

  get isDevelopment(): boolean {
    return !this.environment.production;
  }

  get enableDebugLogs(): boolean {
    return this.environment.debug.enableLogs;
  }

  // Método para log condicional
  log(message: string, ...args: any[]): void {
    if (this.enableDebugLogs) {
      console.log(`[${this.environment.appName}] ${message}`, ...args);
    }
  }

  // Método para obter URL completa de endpoint
  getEndpointUrl(endpoint: keyof AppEnvironment['endpoints']): string {
    return `${this.apiUrl}${this.environment.endpoints[endpoint]}`;
  }

  // Método para validar arquivo
  isValidFile(file: File): { valid: boolean; error?: string } {
    if (file.size > this.environment.fileUpload.maxSize) {
      return {
        valid: false,
        error: `Arquivo muito grande. Máximo ${this.environment.fileUpload.maxSize / 1024 / 1024}MB permitido.`
      };
    }

    if (!this.environment.fileUpload.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Tipo de arquivo não permitido. Tipos aceitos: ${this.environment.fileUpload.allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }
}