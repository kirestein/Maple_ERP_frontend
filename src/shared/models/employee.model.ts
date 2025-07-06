// Enums para Employee
export enum EmployeeGender {
  MASCULINO = 'Masculino',
  FEMININO = 'Feminino',
  OUTRO = 'Outro',
  NAO_INFORMADO = 'Não informado'
}

export enum EmployeeMaritalStatus {
  SOLTEIRO = 'Solteiro(a)',
  CASADO = 'Casado(a)',
  DIVORCIADO = 'Divorciado(a)',
  VIUVO = 'Viúvo(a)',
  UNIAO_ESTAVEL = 'União Estável'
}

export enum EmployeeGraduation {
  FUNDAMENTAL_INCOMPLETO = 'Ensino Fundamental Incompleto',
  FUNDAMENTAL_COMPLETO = 'Ensino Fundamental Completo',
  MEDIO_INCOMPLETO = 'Ensino Médio Incompleto',
  MEDIO_COMPLETO = 'Ensino Médio Completo',
  SUPERIOR_INCOMPLETO = 'Superior Incompleto',
  SUPERIOR_COMPLETO = 'Superior Completo',
  ESPECIALIZAÇÃO = 'Especialização',
  MESTRADO = 'Mestrado',
  DOUTORADO = 'Doutorado'
}

export enum EmployeeSkinColor {
  BRANCO = 'Branco',
  PARDO = 'Pardo',
  NEGRO = 'Negro',
  AMARELO = 'Amarelo',
  INDIGENA = 'Indígena',
  NAO_DECLARADO = 'Não declarado'
}

export enum EmployeeCargo {
  PROFESSOR = 'Professor',
  COORDENADOR = 'Coordenador',
  DIRETOR = 'Diretor',
  AUXILIAR = 'Auxiliar',
  SECRETARIO = 'Secretário',
  ZELADOR = 'Zelador',
  COZINHEIRO = 'Cozinheiro',
  PORTEIRO = 'Porteiro',
  OUTROS = 'Outros'
}

export enum EmployeeContractStatus {
  ACTIVE = 'Ativo',
  INACTIVE = 'Inativo',
  SUSPENDED = 'Suspenso',
  TERMINATED = 'Demitido'
}

export enum DriverLicenseCategory {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  AB = 'AB',
  AC = 'AC',
  AD = 'AD',
  AE = 'AE'
}

export enum EmployeeRelationship {
  FILHO = 'Filho(a)',
  CONJUGE = 'Cônjuge',
  PAI = 'Pai',
  MAE = 'Mãe',
  IRMAO = 'Irmão(ã)',
  OUTRO = 'Outro'
}

// Interface para Contato de Emergência
export interface EmployeeContact {
  id?: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  contactRelationship: EmployeeRelationship;
}

// Interface para Dependente
export interface EmployeeDependent {
  id?: string;
  dependentName: string;
  dependentCpf?: string;
  dependentBirthday?: Date;
  dependentRelationship: EmployeeRelationship;
}

// Interface principal do Employee
export interface Employee {
  id?: string;
  
  // Informações Básicas
  fullName: string;
  email?: string;
  tagName?: string;
  tagLastName?: string;
  birthday?: Date;
  gender?: EmployeeGender;
  maritalStatus?: EmployeeMaritalStatus;
  skinColor?: EmployeeSkinColor;
  graduation?: EmployeeGraduation;
  naturalness?: string;
  nationality?: string;
  fatherName?: string;
  motherName?: string;
  
  // Documentação
  cpf?: string;
  rg?: string;
  rgEmitter?: string;
  rgEmissionDate?: Date;
  pisPasep?: string;
  voterTitle?: string;
  voterZone?: string;
  voterSection?: string;
  voterEmission?: Date;
  militaryCertificate?: string;
  ctps?: string;
  ctpsSerie?: string;
  driversLicense?: boolean;
  driversLicenseNumber?: string;
  driversLicenseCategory?: DriverLicenseCategory;
  driversLicenseEmissionDate?: Date;
  driversLicenseExpirationDate?: Date;
  
  // Contato e Endereço
  phone?: string;
  mobile?: string;
  cep?: string;
  employeeAddress?: string;
  employeeAddressNumber?: string;
  employeeAddressComplement?: string;
  employeeNeighborhood?: string;
  employeeAddressCity?: string;
  employeeAddressState?: string;
  
  // Informações Familiares
  partnerName?: string;
  partnerCpf?: string;
  partnerBirthday?: Date;
  partnerRg?: string;
  
  // Informações Profissionais
  jobPosition?: EmployeeCargo;
  jobFunctions?: string;
  admissionDate?: Date;
  period?: string;
  contractExpirationDate?: Date;
  dailyHours?: string;
  weeklyHours?: string;
  monthlyHours?: string;
  weeklyClasses?: string;
  hasAccumulate?: boolean;
  hasAccumulateCompany?: string;
  status?: EmployeeContractStatus;
  
  // Informações Financeiras
  salary?: number;
  salaryBank?: string;
  salaryAgency?: string;
  salaryAccount?: string;
  salaryAccountType?: string;
  familySalary?: number;
  parenting?: string;
  IRPF?: string;
  
  // Benefícios e Adicionais
  mealValue?: number;
  transport?: boolean;
  trasportType?: string;
  transportValue?: number;
  healthPlan?: string;
  healthCardNumber?: string;
  deficiency?: boolean;
  deficiencyDescription?: string;
  
  // Informações de Estágio/Faculdade
  college?: string;
  course?: string;
  trainingPeriod?: string;
  ra?: string;
  collegeCep?: string;
  traineeAddress?: string;
  traineeAddressNumber?: number;
  traineeAddressNeighborhood?: string;
  traineeAddressComplement?: string;
  traineeAddressCity?: string;
  traineeAddressState?: string;
  lifInsurancePolicy?: string;
  
  // Relacionamentos
  employeeContact?: EmployeeContact[];
  employeeDependent?: EmployeeDependent[];
  
  // Metadados
  createdAt?: Date;
  updatedAt?: Date;
  photoUrl?: string;
}

// Classe DTO para criação de Employee
export class CreateEmployeeDto implements Partial<Employee> {
  fullName!: string;
  email?: string;
  cpf?: string;
  rg?: string;
  phone?: string;
  mobile?: string;
  jobPosition?: EmployeeCargo;
  admissionDate?: Date;
  status?: EmployeeContractStatus;
  
  constructor(data: Partial<Employee>) {
    Object.assign(this, data);
  }
}

// Classe DTO para atualização de Employee
export class UpdateEmployeeDto implements Partial<Employee> {
  constructor(data: Partial<Employee>) {
    Object.assign(this, data);
  }
}