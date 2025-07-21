import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private readonly viaCepUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  /**
   * Busca informações de endereço pelo CEP usando a API ViaCEP
   * @param cep CEP para buscar (pode conter ou não formatação)
   * @returns Observable com os dados do endereço
   */
  searchByCep(cep: string): Observable<AddressData> {
    // Remove formatação do CEP (deixa apenas números)
    const cleanCep = cep.replace(/\D/g, '');
    
    // Valida se o CEP tem 8 dígitos
    if (cleanCep.length !== 8) {
      return throwError(() => new Error('CEP deve conter 8 dígitos'));
    }

    // Valida se o CEP não é uma sequência de números iguais
    if (/^(\d)\1{7}$/.test(cleanCep)) {
      return throwError(() => new Error('CEP inválido'));
    }

    const url = `${this.viaCepUrl}/${cleanCep}/json/`;

    return this.http.get<ViaCepResponse>(url).pipe(
      map((response: ViaCepResponse) => {
        // Verifica se a API retornou erro
        if (response.erro) {
          throw new Error('CEP não encontrado');
        }

        // Converte a resposta da ViaCEP para o formato usado no sistema
        return {
          street: response.logradouro || '',
          neighborhood: response.bairro || '',
          city: response.localidade || '',
          state: response.uf || '',
          complement: response.complemento || ''
        };
      }),
      catchError((error) => {
        console.error('Erro ao buscar CEP:', error);
        
        // Trata diferentes tipos de erro
        if (error.status === 0) {
          return throwError(() => new Error('Erro de conexão. Verifique sua internet.'));
        } else if (error.status === 404) {
          return throwError(() => new Error('CEP não encontrado'));
        } else if (error.message) {
          return throwError(() => new Error(error.message));
        } else {
          return throwError(() => new Error('Erro ao buscar informações do CEP'));
        }
      })
    );
  }

  /**
   * Formata CEP para exibição (00000-000)
   * @param cep CEP sem formatação
   * @returns CEP formatado
   */
  formatCep(cep: string): string {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
    }
    return cep;
  }

  /**
   * Remove formatação do CEP
   * @param cep CEP formatado
   * @returns CEP apenas com números
   */
  cleanCep(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  /**
   * Valida se o CEP tem formato válido
   * @param cep CEP para validar
   * @returns true se válido, false caso contrário
   */
  isValidCep(cep: string): boolean {
    const cleanCep = this.cleanCep(cep);
    
    // Deve ter exatamente 8 dígitos
    if (cleanCep.length !== 8) {
      return false;
    }

    // Não pode ser uma sequência de números iguais
    if (/^(\d)\1{7}$/.test(cleanCep)) {
      return false;
    }

    return true;
  }
}