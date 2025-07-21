import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CepService, ViaCepResponse, AddressData } from './cep.service';

describe('CepService', () => {
  let service: CepService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CepService]
    });
    service = TestBed.inject(CepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search CEP successfully', () => {
    const mockResponse: ViaCepResponse = {
      cep: '01310-100',
      logradouro: 'Avenida Paulista',
      complemento: '',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP',
      ibge: '3550308',
      gia: '1004',
      ddd: '11',
      siafi: '7107'
    };

    const expectedResult: AddressData = {
      street: 'Avenida Paulista',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      complement: ''
    };

    service.searchByCep('01310-100').subscribe(result => {
      expect(result).toEqual(expectedResult);
    });

    const req = httpMock.expectOne('https://viacep.com.br/ws/01310100/json/');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle CEP not found error', () => {
    const mockErrorResponse: ViaCepResponse = {
      cep: '',
      logradouro: '',
      complemento: '',
      bairro: '',
      localidade: '',
      uf: '',
      ibge: '',
      gia: '',
      ddd: '',
      siafi: '',
      erro: true
    };

    service.searchByCep('00000-000').subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.message).toBe('CEP não encontrado');
      }
    });

    const req = httpMock.expectOne('https://viacep.com.br/ws/00000000/json/');
    req.flush(mockErrorResponse);
  });

  it('should validate CEP format correctly', () => {
    expect(service.isValidCep('01310-100')).toBeTruthy();
    expect(service.isValidCep('01310100')).toBeTruthy();
    expect(service.isValidCep('123')).toBeFalsy();
    expect(service.isValidCep('11111111')).toBeFalsy(); // Sequência de números iguais
    expect(service.isValidCep('')).toBeFalsy();
  });

  it('should format CEP correctly', () => {
    expect(service.formatCep('01310100')).toBe('01310-100');
    expect(service.formatCep('123')).toBe('123');
  });

  it('should clean CEP correctly', () => {
    expect(service.cleanCep('01310-100')).toBe('01310100');
    expect(service.cleanCep('01.310-100')).toBe('01310100');
    expect(service.cleanCep('01310100')).toBe('01310100');
  });
});