// Definições de Enums baseadas no modelo de dados
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

export enum EmployeeCargo {
  PROFESSOR = 'PROFESSOR',
  COORDENADOR = 'COORDENADOR',
  COORDENADOR_PEDAGOGICO = 'COORDENADOR_PEDAGOGICO',
  DIRETOR = 'DIRETOR',
  SECRETARIA = 'SECRETARIA',
  PEDAGOGO = 'PEDAGOGO',
  AUXILIAR_SERVICOS_GERAIS = 'AUXILIAR_SERVICOS_GERAIS',
  MOTORISTA = 'MOTORISTA',
  MONITOR = 'MONITOR',
  ESTAGIARIO = 'ESTAGIARIO',
  AUXILIAR_PEDAGOGICO = 'AUXILIAR_PEDAGOGICO',
  ASSISTENTE_TRAINEE_6H = 'ASSISTENTE_TRAINEE_6H',
  ASSISTENTE_SENIOR_6H_II = 'ASSISTENTE_SENIOR_6H_II',
  PROF_ED_FUNDAMENTAL_I_1_E_2 = 'PROF_ED_FUNDAMENTAL_I_1_E_2',
  PROF_ED_FUNDAMENTAL_I = 'PROF_ED_FUNDAMENTAL_I',
  PROFESSOR_EDUC_INFANTIL_ASSIST_4H = 'PROFESSOR_EDUC_INFANTIL_ASSIST_4H',
  JOVEM_APRENDIZ = 'JOVEM_APRENDIZ',
  AUXILIAR_DE_COZINHA = 'AUXILIAR_DE_COZINHA',
  INSPETOR_DE_ALUNOS = 'INSPETOR_DE_ALUNOS',
  PROFESSOR_MUSICA = 'PROFESSOR_MUSICA',
  INSTRUTOR_EDUCACIONAL_SENIOR_8_HORAS_ASSISTENTE = 'INSTRUTOR_EDUCACIONAL_SENIOR_8_HORAS_ASSISTENTE',
  PROFESSOR_EDUC_INFANTIL_SENIOR_2 = 'PROFESSOR_EDUC_INFANTIL_SENIOR_2',
  PROF_ED_INFANTIL_SENIOR = 'PROF_ED_INFANTIL_SENIOR',
  ASSISTENTE_JUNIOR_6H = 'ASSISTENTE_JUNIOR_6H',
  AUXILIAR_ADMINISTRATIVO = 'AUXILIAR_ADMINISTRATIVO',
  ASSISTENTE_II_6_HORAS = 'ASSISTENTE_II_6_HORAS',
  AUXILIAR_DE_LIMPEZA = 'AUXILIAR_DE_LIMPEZA',
  PROFESSOR_EDUC_INFANTIL_INSTRUTOR_4H = 'PROFESSOR_EDUC_INFANTIL_INSTRUTOR_4H',
  AUXILIAR_ADMINISTRATIVO_I = 'AUXILIAR_ADMINISTRATIVO_I',
  ASSISTENTE_ADMINISTRATIVO_FINANCEIRO = 'ASSISTENTE_ADMINISTRATIVO_FINANCEIRO',
  AUXILIAR_DE_MANUTENCAO = 'AUXILIAR_DE_MANUTENCAO',
  INSPETORA_DE_ALUNOS_6_HORAS = 'INSPETORA_DE_ALUNOS_6_HORAS',
  PROFESSOR_EDUC_INFANTIL = 'PROFESSOR_EDUC_INFANTIL',
  SUPERVISORA_OPERACIONAL = 'SUPERVISORA_OPERACIONAL',
  OUTRO = 'OUTRO'
}

export enum EmployeeContractStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum EmployeeGender {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  OTHER = 'OTHER',
  NO_ONE = 'NO_ONE'
}

export enum EmployeeGraduation {
  ENSINO_FUNDAMENTAL = 'ENSINO_FUNDAMENTAL',
  ENSINO_MEDIO = 'ENSINO_MEDIO',
  ENSINO_SUPERIOR_CURSANDO = 'ENSINO_SUPERIOR_CURSANDO',
  ENSINO_SUPERIOR_COMPLETO = 'ENSINO_SUPERIOR_COMPLETO',
  POS_GRADUACAO_CURSANDO = 'POS_GRADUACAO_CURSANDO',
  POS_GRADUACAO_COMPLETO = 'POS_GRADUACAO_COMPLETO',
  MESTRADO_CURSANDO = 'MESTRADO_CURSANDO',
  MESTRADO_COMPLETO = 'MESTRADO_COMPLETO',
  DOUTORADO_CURSANDO = 'DOUTORADO_CURSANDO',
  DOUTORADO_COMPLETO = 'DOUTORADO_COMPLETO',
  POS_DOUTORADO_CURSANDO = 'POS_DOUTORADO_CURSANDO',
  POS_DOUTORADO_COMPLETO = 'POS_DOUTORADO_COMPLETO',
  OUTRO = 'OUTRO'
}

export enum EmployeeMaritalStatus {
  SOLTEIRO = 'SOLTEIRO',
  CASADO = 'CASADO',
  DIVORCIADO = 'DIVORCIADO',
  VIUVO = 'VIUVO',
  OUTRO = 'OUTRO'
}

export enum EmployeeRelationship {
  PAI = 'PAI',
  MAE = 'MAE',
  FILHO = 'FILHO',
  FILHA = 'FILHA',
  ESPOSO = 'ESPOSO',
  ESPOSA = 'ESPOSA',
  IRMAO = 'IRMAO',
  IRMA = 'IRMA',
  OUTRO = 'OUTRO'
}

export enum EmployeeSkinColor {
  BRANCO = 'BRANCO',
  NEGRO = 'NEGRO',
  PRETO = 'PRETO',
  AMARELO = 'AMARELO',
  PARDO = 'PARDO',
  INDIGENAS = 'INDIGENAS',
  OUTRO = 'OUTRO'
}

// Interfaces para os modelos de dados
export interface EmployeeContact {
  contactId?: string;
  employeeId?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactRelationship?: EmployeeRelationship;
}

export interface EmployeeDependent {
  dependentId?: string;
  employeeId?: string;
  dependentName?: string;
  dependentCpf?: string;
  dependentBirthday?: Date | string;
  dependentRelationship?: EmployeeRelationship;
}

export interface Department {
  cargoId?: string;
  employeetId?: string;
  salario?: number;
  bonusSalario?: number;
  cargaHoraria?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  cargo?: EmployeeCargo;
}

export interface Employee {
  id?: string;
  companyNumber?: number;
  companyName?: string;
  fullName?: string;
  email?: string;
  tagName?: string;
  tagLastName?: string;
  birthday?: Date | string;
  age?: string;
  cep?: string;
  employeeAddress?: string;
  employeeAddressNumber?: string;
  employeeAddressComplement?: string;
  employeeAddressState?: string;
  employeeAddressCity?: string;
  phone?: string;
  mobile?: string;
  naturalness?: string;
  nationality?: string;
  fatherName?: string;
  motherName?: string;
  mealValue?: number;
  deficiency?: boolean;
  deficiencyDescription?: string;
  transport?: boolean;
  trasportType?: string;
  transportValue?: number;
  partnerName?: string;
  partnerCpf?: string;
  partnerBirthday?: Date | string;
  partnerRg?: string;
  employeePhoto?: string | ArrayBuffer | null; // Para upload de foto
  employeeNeighborhood?: string;
  gender?: EmployeeGender;
  maritalStatus?: EmployeeMaritalStatus;
  graduation?: EmployeeGraduation;
  skinColor?: EmployeeSkinColor;
  rg?: string;
  rgEmitter?: string;
  rgEmissionDate?: Date | string;
  cpf?: string;
  pisPasep?: string;
  voterTitle?: string;
  voterZone?: string;
  voterSection?: string;
  voterEmission?: Date | string;
  militaryCertificate?: string;
  ctps?: string;
  ctpsSerie?: string;
  driversLicense?: boolean;
  driversLicenseNumber?: string;
  driversLicenseEmissionDate?: Date | string;
  driversLicenseExpirationDate?: Date | string;
  healthPlan?: string;
  healthCardNumber?: string;
  driversLicenseCategory?: DriverLicenseCategory;
  collegeCep?: string;
  traineeAddress?: string;
  traineeAddressNumber?: number;
  traineeAddressNeighborhood?: string;
  traineeAddressComplement?: string;
  traineeAddressState?: string;
  traineeAddressCity?: string;
  college?: string;
  course?: string;
  trainingPeriod?: string;
  lifInsurancePolicy?: string;
  ra?: string;
  jobFunctions?: string;
  admissionDate?: Date | string;
  period?: string;
  contractExpirationDate?: Date | string;
  dailyHours?: string;
  weeklyHours?: string;
  monthlyHours?: string;
  weeklyClasses?: string;
  hasAccumulate?: boolean;
  hasAccumulateCompany?: string;
  salary?: number;
  salaryBank?: string;
  salaryAgency?: string;
  salaryAccount?: string;
  salaryAccountType?: string;
  familySalary?: number;
  parenting?: string;
  IRPF?: string;
  status?: EmployeeContractStatus;
  jobPosition?: EmployeeCargo;
  department?: Department;
  userId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  
  // Relacionamentos
  employeeContact?: EmployeeContact[];
  employeeDependent?: EmployeeDependent[];
}
