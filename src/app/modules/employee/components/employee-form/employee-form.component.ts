import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

// Material Imports
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Serviços e Modelos
import { EmployeeService } from '../../../../core/services/employee.service';
import { CepService, AddressData } from '../../../../core/services/cep.service';
import {
  Employee,
  EmployeeGender,
  EmployeeMaritalStatus,
  EmployeeGraduation,
  EmployeeSkinColor,
  EmployeeCargo,
  EmployeeContractStatus,
  DriverLicenseCategory,
  EmployeeRelationship,
} from '../../../../shared/models/employee.model';

// Diretivas de Máscara (ngx-mask)
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  employeeForm!: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;
  selectedPhotoUrl: string | ArrayBuffer | null = null;
  selectedPhotoFile: File | null = null;
  photoError: string | null = null;
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;

  // Enums para os selects
  genderOptions = Object.values(EmployeeGender);
  maritalStatusOptions = Object.values(EmployeeMaritalStatus);
  graduationOptions = Object.values(EmployeeGraduation);
  skinColorOptions = Object.values(EmployeeSkinColor);
  cargoOptions = Object.values(EmployeeCargo);
  statusOptions = Object.values(EmployeeContractStatus);
  driverLicenseCategoryOptions = Object.values(DriverLicenseCategory);
  relationshipOptions = Object.values(EmployeeRelationship);

  // Estados brasileiros
  states = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private cepService: CepService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Primeiro verifica se é modo de edição
    this.route.paramMap.subscribe((params) => {
      this.employeeId = params.get('id');
      if (this.employeeId) {
        this.isEditMode = true;
      }
      // Inicializa o formulário após definir o modo
      this.initForm();
      
      // Se for edição, carrega os dados
      if (this.isEditMode) {
        this.loadEmployeeData(this.employeeId!);
      }
    });
    this.setupFormListeners();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      basicInfo: this.fb.group({
        fullName: this.isEditMode ? [''] : ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.email]],
        tagName: this.isEditMode ? [''] : ['', [Validators.required]],
        tagLastName: this.isEditMode ? [''] : ['', [Validators.required]],
        birthday: [null],
        gender: [null],
        maritalStatus: [EmployeeMaritalStatus.SOLTEIRO],
        skinColor: [null],
        graduation: [null],
        naturalness: [''],
        nationality: [''],
        fatherName: [''],
        motherName: [''],
      }),
      documents: this.fb.group({
        cpf: [''],
        rg: [''],
        rgEmitter: [''],
        rgEmissionDate: [null],
        pisPasep: [''],
        voterTitle: [''],
        voterZone: [''],
        voterSection: [''],
        voterEmission: [null],
        militaryCertificate: [''],
        ctps: [''],
        ctpsSerie: [''],
        driversLicense: [false],
        driversLicenseNumber: [''],
        driversLicenseCategory: [null],
        driversLicenseEmissionDate: [null],
        driversLicenseExpirationDate: [null],
      }),
      contactAddress: this.fb.group({
        phone: [''],
        mobile: [''],
        cep: [''],
        employeeAddress: [''],
        employeeAddressNumber: [''],
        employeeAddressComplement: [''],
        employeeNeighborhood: [''],
        employeeAddressCity: [''],
        employeeAddressState: [''],
      }),
      familyInfo: this.fb.group({
        partnerName: [''],
        partnerCpf: [''],
        partnerBirthday: [null],
        partnerRg: [''],
        dependents: this.fb.array([]),
      }),
      professionalInfo: this.fb.group({
        jobPosition: [null],
        jobFunctions: [''],
        admissionDate: [null],
        period: [''],
        contractExpirationDate: [null],
        dailyHours: [''],
        weeklyHours: [''],
        monthlyHours: [''],
        weeklyClasses: [''],
        hasAccumulate: [false],
        hasAccumulateCompany: [''],
        status: [EmployeeContractStatus.ACTIVE],
      }),
      financialInfo: this.fb.group({
        salary: [null],
        salaryBank: [''],
        salaryAgency: [''],
        salaryAccount: [''],
        salaryAccountType: [''],
        familySalary: [null],
        parenting: [''],
        irpf: [''],
      }),
      benefits: this.fb.group({
        mealValue: [null],
        transport: [false],
        transportType: [''],
        transportValue: [null],
        healthPlan: [''],
        healthCardNumber: [''],
        deficiency: [false],
        deficiencyDescription: [''],
      }),
      collegeInfo: this.fb.group({
        college: [''],
        course: [''],
        trainingPeriod: [''],
        ra: [''],
        collegeCep: [''],
        traineeAddress: [''],
        traineeAddressNumber: [null],
        traineeAddressNeighborhood: [''],
        traineeAddressComplement: [''],
        traineeAddressCity: [''],
        traineeAddressState: [''],
        lifInsurancePolicy: [''],
      }),
      emergencyContacts: this.fb.array([this.createEmergencyContactForm()]),
    });
  }

  // Carregar dados do funcionário para edição
  loadEmployeeData(id: string): void {
    this.isLoading = true;
    this.error = null;
    this.employeeService
      .getEmployeeById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (employee) => {
          this.populateForm(employee);
          // Carregar foto do funcionário se existir
          if (employee.photoUrl) {
            this.selectedPhotoUrl = employee.photoUrl;
          }
          // Atualizar validações para modo de edição
          this.updateValidatorsForEditMode();
        },
        error: (err) => {
          this.error = err.message || 'Erro ao carregar dados do funcionário';
          this.snackBar.open(
            this.error || 'Erro ao carregar dados do funcionário',
            'Fechar',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
  }

  // Atualizar validadores para modo de edição (remover campos obrigatórios)
  private updateValidatorsForEditMode(): void {
    if (this.isEditMode) {
      // Remove validadores obrigatórios dos campos principais
      const fullNameControl = this.employeeForm?.get('basicInfo.fullName');
      const tagNameControl = this.employeeForm?.get('basicInfo.tagName');
      const tagLastNameControl = this.employeeForm?.get('basicInfo.tagLastName');
      
      if (fullNameControl) {
        fullNameControl.clearValidators();
        fullNameControl.setValidators([Validators.minLength(2)]);
        fullNameControl.updateValueAndValidity();
      }
      
      if (tagNameControl) {
        tagNameControl.clearValidators();
        tagNameControl.updateValueAndValidity();
      }
      
      if (tagLastNameControl) {
        tagLastNameControl.clearValidators();
        tagLastNameControl.updateValueAndValidity();
      }
    }
  }

  // Preencher formulário com dados do funcionário
  populateForm(employee: Employee): void {
    this.employeeForm.get('basicInfo')?.patchValue({
      fullName: employee.fullName,
      email: employee.email,
      tagName: employee.tagName,
      tagLastName: employee.tagLastName,
      birthday: employee.birthday ? new Date(employee.birthday) : null,
      gender: employee.gender,
      maritalStatus: employee.maritalStatus,
      skinColor: employee.skinColor,
      graduation: employee.graduation,
      naturalness: employee.naturalness,
      nationality: employee.nationality,
      fatherName: employee.fatherName,
      motherName: employee.motherName,
    });
    this.employeeForm.get('documents')?.patchValue({
      cpf: employee.cpf,
      rg: employee.rg,
      rgEmitter: employee.rgEmitter,
      rgEmissionDate: employee.rgEmissionDate
        ? new Date(employee.rgEmissionDate)
        : null,
      pisPasep: employee.pisPasep,
      voterTitle: employee.voterTitle,
      voterZone: employee.voterZone,
      voterSection: employee.voterSection,
      voterEmission: employee.voterEmission
        ? new Date(employee.voterEmission)
        : null,
      militaryCertificate: employee.militaryCertificate,
      ctps: employee.ctps,
      ctpsSerie: employee.ctpsSerie,
      driversLicense: employee.driversLicense,
      driversLicenseNumber: employee.driversLicenseNumber,
      driversLicenseCategory: employee.driversLicenseCategory,
      driversLicenseEmissionDate: employee.driversLicenseEmissionDate
        ? new Date(employee.driversLicenseEmissionDate)
        : null,
      driversLicenseExpirationDate: employee.driversLicenseExpirationDate
        ? new Date(employee.driversLicenseExpirationDate)
        : null,
    });
    this.employeeForm.get('contactAddress')?.patchValue({
      phone: employee.phone,
      mobile: employee.mobile,
      cep: employee.cep,
      employeeAddress: employee.employeeAddress,
      employeeAddressNumber: employee.employeeAddressNumber,
      employeeAddressComplement: employee.employeeAddressComplement,
      employeeNeighborhood: employee.employeeNeighborhood,
      employeeAddressCity: employee.employeeAddressCity,
      employeeAddressState: employee.employeeAddressState,
    });
    this.employeeForm.get('familyInfo')?.patchValue({
      partnerName: employee.partnerName,
      partnerCpf: employee.partnerCpf,
      partnerBirthday: employee.partnerBirthday
        ? new Date(employee.partnerBirthday)
        : null,
      partnerRg: employee.partnerRg,
    });
    // Dependentes
    const dependentsArray = this.employeeForm.get(
      'familyInfo.dependents'
    ) as FormArray;
    dependentsArray.clear();
    if (employee.employeeDependent && employee.employeeDependent.length > 0) {
      employee.employeeDependent.forEach((dependent) => {
        const dependentForm = this.createDependentForm();
        dependentForm.patchValue({
          dependentName: dependent.dependentName,
          dependentCpf: dependent.dependentCpf,
          dependentBirthday: dependent.dependentBirthday
            ? new Date(dependent.dependentBirthday)
            : null,
          dependentRelationship: dependent.dependentRelationship,
        });
        dependentsArray.push(dependentForm);
      });
    }
    this.employeeForm.get('professionalInfo')?.patchValue({
      jobPosition: employee.jobPosition,
      jobFunctions: employee.jobFunctions,
      admissionDate: employee.admissionDate
        ? new Date(employee.admissionDate)
        : null,
      period: employee.period,
      contractExpirationDate: employee.contractExpirationDate
        ? new Date(employee.contractExpirationDate)
        : null,
      dailyHours: employee.dailyHours,
      weeklyHours: employee.weeklyHours,
      monthlyHours: employee.monthlyHours,
      weeklyClasses: employee.weeklyClasses,
      hasAccumulate: employee.hasAccumulate,
      hasAccumulateCompany: employee.hasAccumulateCompany,
      status: employee.status,
    });
    this.employeeForm.get('financialInfo')?.patchValue({
      salary: employee.salary,
      salaryBank: employee.salaryBank,
      salaryAgency: employee.salaryAgency,
      salaryAccount: employee.salaryAccount,
      salaryAccountType: employee.salaryAccountType,
      familySalary: employee.familySalary,
      parenting: employee.parenting,
      irpf: employee.IRPF,
    });
    this.employeeForm.get('benefits')?.patchValue({
      mealValue: employee.mealValue,
      transport: employee.transport,
      transportType: employee.trasportType,
      transportValue: employee.transportValue,
      healthPlan: employee.healthPlan,
      healthCardNumber: employee.healthCardNumber,
      deficiency: employee.deficiency,
      deficiencyDescription: employee.deficiencyDescription,
    });
    this.employeeForm.get('collegeInfo')?.patchValue({
      college: employee.college,
      course: employee.course,
      trainingPeriod: employee.trainingPeriod,
      ra: employee.ra,
      collegeCep: employee.collegeCep,
      traineeAddress: employee.traineeAddress,
      traineeAddressNumber: employee.traineeAddressNumber,
      traineeAddressNeighborhood: employee.traineeAddressNeighborhood,
      traineeAddressComplement: employee.traineeAddressComplement,
      traineeAddressCity: employee.traineeAddressCity,
      traineeAddressState: employee.traineeAddressState,
      lifeInsurancePolicy: employee.lifInsurancePolicy,
    });
    // Contatos de emergência
    const contactsArray = this.employeeForm.get(
      'emergencyContacts'
    ) as FormArray;
    contactsArray.clear();
    if (employee.employeeContact && employee.employeeContact.length > 0) {
      employee.employeeContact.forEach((contact) => {
        const contactForm = this.createEmergencyContactForm();
        contactForm.patchValue({
          contactName: contact.contactName,
          contactPhone: contact.contactPhone,
          contactEmail: contact.contactEmail,
          contactRelationship: contact.contactRelationship,
        });
        contactsArray.push(contactForm);
      });
    } else {
      contactsArray.push(this.createEmergencyContactForm());
    }
  }

  // Criar formulário para contato de emergência
  createEmergencyContactForm(): FormGroup {
    return this.fb.group({
      contactName: [''],
      contactPhone: [''],
      contactEmail: [''],
      contactRelationship: [null],
    });
  }

  // Criar formulário para dependente
  createDependentForm(): FormGroup {
    return this.fb.group({
      dependentName: [''],
      dependentCpf: [''],
      dependentBirthday: [null],
      dependentRelationship: [null],
    });
  }

  // Getters para FormArrays
  get emergencyContacts(): FormArray {
    return this.employeeForm?.get('emergencyContacts') as FormArray;
  }
  get dependents(): FormArray {
    return this.employeeForm?.get('familyInfo.dependents') as FormArray;
  }

  // Adicionar contato de emergência
  addEmergencyContact(): void {
    this.emergencyContacts.push(this.createEmergencyContactForm());
  }
  // Remover contato de emergência
  removeEmergencyContact(index: number): void {
    if (this.emergencyContacts.length > 1) {
      this.emergencyContacts.removeAt(index);
    } else {
      this.snackBar.open(
        'É necessário manter pelo menos um contato de emergência',
        'OK',
        { duration: 3000 }
      );
    }
  }
  // Adicionar dependente
  addDependent(): void {
    this.dependents.push(this.createDependentForm());
  }
  // Remover dependente
  removeDependent(index: number): void {
    this.dependents.removeAt(index);
  }

  // Configurar listeners para campos dependentes
  setupFormListeners(): void {
    const driversLicenseControl = this.employeeForm?.get(
      'documents.driversLicense'
    );
    if (driversLicenseControl) {
      const driversLicenseFields = [
        this.employeeForm.get('documents.driversLicenseNumber'),
        this.employeeForm.get('documents.driversLicenseCategory'),
        this.employeeForm.get('documents.driversLicenseEmissionDate'),
        this.employeeForm.get('documents.driversLicenseExpirationDate'),
      ].filter((field) => field !== null);
      driversLicenseControl.valueChanges.subscribe((hasLicense) => {
        if (hasLicense) {
          driversLicenseFields.forEach((field) => field?.enable());
        } else {
          driversLicenseFields.forEach((field) => {
            field?.disable();
            field?.setValue(null);
          });
        }
      });
      if (!driversLicenseControl.value) {
        driversLicenseFields.forEach((field) => field?.disable());
      }
    }
  }

  // Upload de foto
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      
      // Validar tipo e tamanho do arquivo
      if (!file.type.startsWith('image/')) {
        this.photoError = 'Apenas arquivos de imagem são permitidos.';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        this.photoError = 'A imagem deve ter no máximo 5MB.';
        return;
      }
      
      this.photoError = null;
      this.selectedPhotoFile = file;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPhotoUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  removePhoto(): void {
    this.selectedPhotoUrl = null;
    this.selectedPhotoFile = null;
    this.photoError = null;
    
    // Limpar input de arquivo
    const photoInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (photoInput) {
      photoInput.value = '';
    }
  }

  // Buscar endereço pelo CEP usando ViaCEP
  searchAddressByCep(cepField: string): void {
    const cep = this.employeeForm?.get(cepField)?.value;
    
    if (!cep || !this.cepService.isValidCep(cep)) {
      if (cep && cep.length > 0) {
        this.snackBar.open('CEP inválido. Digite um CEP válido com 8 dígitos.', 'OK', {
          duration: 3000,
          panelClass: ['warning-snackbar']
        });
      }
      return;
    }

    // Mostra loading
    const loadingMessage = this.snackBar.open('Buscando endereço...', '', {
      duration: 0 // Não remove automaticamente
    });

    this.cepService.searchByCep(cep).subscribe({
      next: (addressData: AddressData) => {
        loadingMessage.dismiss();
        this.fillAddressFields(cepField, addressData);
        this.snackBar.open('Endereço encontrado e preenchido automaticamente!', 'OK', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        loadingMessage.dismiss();
        this.snackBar.open(error.message || 'Erro ao buscar CEP', 'OK', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  // Preencher campos de endereço com dados do CEP
  private fillAddressFields(cepField: string, addressData: AddressData): void {
    // Determina qual grupo de endereço estamos preenchendo
    if (cepField.includes('contactAddress')) {
      // Endereço do funcionário
      const addressGroup = this.employeeForm?.get('contactAddress');
      if (addressGroup) {
        addressGroup.patchValue({
          employeeAddress: addressData.street,
          employeeNeighborhood: addressData.neighborhood,
          employeeAddressCity: addressData.city,
          employeeAddressState: addressData.state
        });
        
        // Se houver complemento da API, adiciona ao campo de complemento
        if (addressData.complement) {
          const currentComplement = addressGroup.get('employeeAddressComplement')?.value || '';
          const newComplement = currentComplement ? 
            `${currentComplement}, ${addressData.complement}` : 
            addressData.complement;
          addressGroup.get('employeeAddressComplement')?.setValue(newComplement);
        }
      }
    } else if (cepField.includes('collegeInfo')) {
      // Endereço da faculdade
      const collegeGroup = this.employeeForm?.get('collegeInfo');
      if (collegeGroup) {
        collegeGroup.patchValue({
          traineeAddress: addressData.street,
          traineeAddressNeighborhood: addressData.neighborhood,
          traineeAddressCity: addressData.city,
          traineeAddressState: addressData.state
        });
        
        // Se houver complemento da API, adiciona ao campo de complemento
        if (addressData.complement) {
          const currentComplement = collegeGroup.get('traineeAddressComplement')?.value || '';
          const newComplement = currentComplement ? 
            `${currentComplement}, ${addressData.complement}` : 
            addressData.complement;
          collegeGroup.get('traineeAddressComplement')?.setValue(newComplement);
        }
      }
    }
  }

  // Enviar formulário
  onSubmit(): void {
    // Validar campos obrigatórios personalizados
    const validationErrors = this.validateRequiredFields();
    
    if (!this.employeeForm || this.employeeForm.invalid || validationErrors.length > 0) {
      console.error('Formulário inválido:', this.employeeForm?.errors);
      console.error('Erros de validação customizada:', validationErrors);
      
      this.markFormGroupTouched(this.employeeForm);
      this.logFormErrors(this.employeeForm);
      
      const errorMessage = validationErrors.length > 0 
        ? validationErrors.join(', ') 
        : 'Por favor, corrija os erros no formulário antes de enviar.';
      
      this.snackBar.open(errorMessage, 'OK', { duration: 5000 });
      return;
    }

    this.isSubmitting = true;
    
    try {
      if (this.isEditMode) {
        // Para edição, usar JSON simples (sem foto)
        const updateData = this.prepareUpdateData();
        console.log('Dados para atualização:', updateData);
        console.log('ID do funcionário:', this.employeeId);
        
        if (Object.keys(updateData).length === 0) {
          console.warn('Nenhum dado para atualizar!');
          this.snackBar.open('Nenhuma alteração detectada', 'OK', { duration: 3000 });
          this.isSubmitting = false;
          return;
        }
        
        const operation$ = this.employeeService.updateEmployee(this.employeeId!, updateData);
        
        operation$
          .pipe(finalize(() => (this.isSubmitting = false)))
          .subscribe({
            next: (employee: Employee) => {
              console.log('Funcionário atualizado com sucesso:', employee);
              this.snackBar.open('Funcionário atualizado com sucesso!', 'OK', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.router.navigate(['/employees']);
            },
            error: (error: any) => {
              console.error('Erro ao atualizar funcionário:', error);
              this.snackBar.open(
                `Erro ao atualizar funcionário: ${error.message}`,
                'OK',
                { 
                  duration: 5000,
                  panelClass: ['error-snackbar']
                }
              );
            },
          });
      } else {
        // Para criação, usar FormData com foto
        const formData = this.prepareEmployeeData();
        console.log('FormData preparado para criação');
        
        const operation$ = this.employeeService.createEmployee(formData);
      
        operation$
          .pipe(finalize(() => (this.isSubmitting = false)))
          .subscribe({
            next: (employee: Employee) => {
              this.snackBar.open('Funcionário cadastrado com sucesso!', 'OK', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.router.navigate(['/employees']);
            },
            error: (error: any) => {
              this.snackBar.open(
                `Erro ao cadastrar funcionário: ${error.message}`,
                'OK',
                { 
                  duration: 5000,
                  panelClass: ['error-snackbar']
                }
              );
            },
          });
      }
        
    } catch (error: any) {
      this.isSubmitting = false;
      console.error('Erro ao preparar dados:', error);
      this.snackBar.open(
        `Erro ao preparar dados: ${error.message}`,
        'OK',
        { duration: 5000 }
      );
      return;
    }
  }

  // Método de teste para enviar dados mínimos
  testMinimalSubmit(): void {
    console.log('Testando envio com dados mínimos...');
    
    // Primeiro, vamos verificar os valores atuais do formulário
    const currentValues = this.employeeForm.value;
    console.log('Valores atuais do formulário:', currentValues);
    
    // Preparar dados mínimos apenas com campos básicos
    const minimalData: any = {};
    
    // Campos que sabemos que existem na API
    if (currentValues.basicInfo?.fullName) {
      minimalData.fullName = currentValues.basicInfo.fullName;
    }
    
    if (currentValues.basicInfo?.email) {
      minimalData.email = currentValues.basicInfo.email;
    }
    
    if (currentValues.professionalInfo?.jobFunctions) {
      minimalData.jobFunctions = currentValues.professionalInfo.jobFunctions;
    }
    
    if (currentValues.professionalInfo?.status) {
      minimalData.status = currentValues.professionalInfo.status;
    }
    
    if (currentValues.contactAddress?.phone) {
      minimalData.phone = currentValues.contactAddress.phone;
    }
    
    if (currentValues.contactAddress?.mobile) {
      minimalData.mobile = currentValues.contactAddress.mobile;
    }
    
    console.log('Dados mínimos preparados:', minimalData);
    console.log('ID do funcionário para teste:', this.employeeId);
    
    if (Object.keys(minimalData).length === 0) {
      console.warn('Nenhum campo preenchido para testar!');
      this.snackBar.open('Preencha pelo menos um campo para testar', 'OK', { duration: 3000 });
      return;
    }
    
    this.isSubmitting = true;
    this.employeeService.updateEmployee(this.employeeId!, minimalData)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (result) => {
          console.log('Sucesso no teste mínimo:', result);
          this.snackBar.open('Teste mínimo funcionou! Dados atualizados.', 'OK', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Erro no teste mínimo:', error);
          this.snackBar.open(`Erro no teste mínimo: ${error.message}`, 'OK', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  // Método de teste para verificar se o funcionário existe
  testEmployeeExists(): void {
    console.log('Testando se funcionário existe...');
    console.log('ID do funcionário:', this.employeeId);
    
    this.employeeService.getEmployeeById(this.employeeId!)
      .subscribe({
        next: (employee) => {
          console.log('Funcionário encontrado:', employee);
          this.snackBar.open('Funcionário encontrado!', 'OK', { duration: 3000 });
        },
        error: (error) => {
          console.error('Erro ao buscar funcionário:', error);
          this.snackBar.open(`Erro ao buscar funcionário: ${error.message}`, 'OK', { duration: 5000 });
        }
      });
  }

  // Cancelar formulário e voltar à lista
  cancel(): void {
    this.router.navigate(['/employees']);
  }

  // Preparar dados do funcionário para envio conforme API
  prepareEmployeeData(): FormData {
    const formValue = this.employeeForm?.value || {};
    const basicInfo = formValue.basicInfo || {};
    
    console.log('Valores do formulário (raw):', formValue);
    
    // Criar FormData conforme especificação da API
    const formData = new FormData();
    
    // CAMPOS OBRIGATÓRIOS conforme API
    // Nome completo (obrigatório)
    if (!basicInfo.fullName || !basicInfo.fullName.trim()) {
      throw new Error('Nome completo é obrigatório');
    }
    formData.append('fullName', basicInfo.fullName.trim());
    
    // Nome para crachá (obrigatório)
    if (!basicInfo.tagName || !basicInfo.tagName.trim()) {
      throw new Error('Nome para crachá é obrigatório');
    }
    formData.append('tagName', basicInfo.tagName.trim());
    
    // Sobrenome para crachá (obrigatório)
    if (!basicInfo.tagLastName || !basicInfo.tagLastName.trim()) {
      throw new Error('Sobrenome para crachá é obrigatório');
    }
    formData.append('tagLastName', basicInfo.tagLastName.trim());
    
    // Foto (obrigatória para novos funcionários)
    if (!this.isEditMode && !this.selectedPhotoFile) {
      throw new Error('Foto é obrigatória para novos funcionários');
    }
    if (this.selectedPhotoFile) {
      formData.append('file', this.selectedPhotoFile);
    }
    
    // CAMPOS OPCIONAIS conforme API
    const professionalInfo = formValue.professionalInfo || {};
    
    // Cargo/função (opcional)
    if (professionalInfo.jobFunctions && professionalInfo.jobFunctions.trim()) {
      formData.append('jobFunctions', professionalInfo.jobFunctions.trim());
    }
    
    // Data de nascimento (opcional)
    if (basicInfo.birthday) {
      const birthday = new Date(basicInfo.birthday);
      formData.append('birthday', birthday.toISOString().split('T')[0]); // formato YYYY-MM-DD
    }
    
    console.log('FormData preparado para envio');
    
    // Log para debug
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    
    return formData;
  }

  // Preparar dados para atualização (apenas JSON, sem foto)
  prepareUpdateData(): any {
    const formValue = this.employeeForm?.value || {};
    console.log('Valores completos do formulário:', formValue);
    
    const basicInfo = formValue.basicInfo || {};
    const professionalInfo = formValue.professionalInfo || {};
    const contactAddress = formValue.contactAddress || {};
    const documents = formValue.documents || {};
    const familyInfo = formValue.familyInfo || {};
    const financialInfo = formValue.financialInfo || {};
    const benefits = formValue.benefits || {};
    const collegeInfo = formValue.collegeInfo || {};
    
    const updateData: any = {};
    
    // INFORMAÇÕES BÁSICAS
    if (basicInfo.fullName && basicInfo.fullName.trim()) {
      updateData.fullName = basicInfo.fullName.trim();
    }
    
    if (basicInfo.email && basicInfo.email.trim()) {
      updateData.email = basicInfo.email.trim();
    }
    
    if (basicInfo.tagName && basicInfo.tagName.trim()) {
      updateData.tagName = basicInfo.tagName.trim();
    }
    
    if (basicInfo.tagLastName && basicInfo.tagLastName.trim()) {
      updateData.tagLastName = basicInfo.tagLastName.trim();
    }
    
    if (basicInfo.birthday) {
      const birthday = new Date(basicInfo.birthday);
      updateData.birthday = birthday.toISOString().split('T')[0];
    }
    
    if (basicInfo.gender) {
      updateData.gender = basicInfo.gender;
    }
    
    if (basicInfo.maritalStatus) {
      updateData.maritalStatus = basicInfo.maritalStatus;
    }
    
    if (basicInfo.skinColor) {
      updateData.skinColor = basicInfo.skinColor;
    }
    
    if (basicInfo.graduation) {
      updateData.graduation = basicInfo.graduation;
    }
    
    if (basicInfo.naturalness && basicInfo.naturalness.trim()) {
      updateData.naturalness = basicInfo.naturalness.trim();
    }
    
    if (basicInfo.nationality && basicInfo.nationality.trim()) {
      updateData.nationality = basicInfo.nationality.trim();
    }
    
    if (basicInfo.fatherName && basicInfo.fatherName.trim()) {
      updateData.fatherName = basicInfo.fatherName.trim();
    }
    
    if (basicInfo.motherName && basicInfo.motherName.trim()) {
      updateData.motherName = basicInfo.motherName.trim();
    }
    
    // DOCUMENTOS
    if (documents.cpf && documents.cpf.trim()) {
      updateData.cpf = documents.cpf.trim();
    }
    
    if (documents.rg && documents.rg.trim()) {
      updateData.rg = documents.rg.trim();
    }
    
    if (documents.rgEmitter && documents.rgEmitter.trim()) {
      updateData.rgEmitter = documents.rgEmitter.trim();
    }
    
    if (documents.rgEmissionDate) {
      const rgEmissionDate = new Date(documents.rgEmissionDate);
      updateData.rgEmissionDate = rgEmissionDate.toISOString().split('T')[0];
    }
    
    if (documents.pisPasep && documents.pisPasep.trim()) {
      updateData.pisPasep = documents.pisPasep.trim();
    }
    
    if (documents.voterTitle && documents.voterTitle.trim()) {
      updateData.voterTitle = documents.voterTitle.trim();
    }
    
    if (documents.voterZone && documents.voterZone.trim()) {
      updateData.voterZone = documents.voterZone.trim();
    }
    
    if (documents.voterSection && documents.voterSection.trim()) {
      updateData.voterSection = documents.voterSection.trim();
    }
    
    if (documents.voterEmission) {
      const voterEmission = new Date(documents.voterEmission);
      updateData.voterEmission = voterEmission.toISOString().split('T')[0];
    }
    
    if (documents.militaryCertificate && documents.militaryCertificate.trim()) {
      updateData.militaryCertificate = documents.militaryCertificate.trim();
    }
    
    if (documents.ctps && documents.ctps.trim()) {
      updateData.ctps = documents.ctps.trim();
    }
    
    if (documents.ctpsSerie && documents.ctpsSerie.trim()) {
      updateData.ctpsSerie = documents.ctpsSerie.trim();
    }
    
    if (documents.driversLicense !== undefined) {
      updateData.driversLicense = documents.driversLicense;
    }
    
    if (documents.driversLicenseNumber && documents.driversLicenseNumber.trim()) {
      updateData.driversLicenseNumber = documents.driversLicenseNumber.trim();
    }
    
    if (documents.driversLicenseCategory) {
      updateData.driversLicenseCategory = documents.driversLicenseCategory;
    }
    
    if (documents.driversLicenseEmissionDate) {
      const driversLicenseEmissionDate = new Date(documents.driversLicenseEmissionDate);
      updateData.driversLicenseEmissionDate = driversLicenseEmissionDate.toISOString().split('T')[0];
    }
    
    if (documents.driversLicenseExpirationDate) {
      const driversLicenseExpirationDate = new Date(documents.driversLicenseExpirationDate);
      updateData.driversLicenseExpirationDate = driversLicenseExpirationDate.toISOString().split('T')[0];
    }
    
    // CONTATO E ENDEREÇO
    if (contactAddress.phone && contactAddress.phone.trim()) {
      updateData.phone = contactAddress.phone.trim();
    }
    
    if (contactAddress.mobile && contactAddress.mobile.trim()) {
      updateData.mobile = contactAddress.mobile.trim();
    }
    
    if (contactAddress.cep && contactAddress.cep.trim()) {
      updateData.cep = contactAddress.cep.trim();
    }
    
    if (contactAddress.employeeAddress && contactAddress.employeeAddress.trim()) {
      updateData.employeeAddress = contactAddress.employeeAddress.trim();
    }
    
    if (contactAddress.employeeAddressNumber && contactAddress.employeeAddressNumber.trim()) {
      updateData.employeeAddressNumber = contactAddress.employeeAddressNumber.trim();
    }
    
    if (contactAddress.employeeAddressComplement && contactAddress.employeeAddressComplement.trim()) {
      updateData.employeeAddressComplement = contactAddress.employeeAddressComplement.trim();
    }
    
    if (contactAddress.employeeNeighborhood && contactAddress.employeeNeighborhood.trim()) {
      updateData.employeeNeighborhood = contactAddress.employeeNeighborhood.trim();
    }
    
    if (contactAddress.employeeAddressCity && contactAddress.employeeAddressCity.trim()) {
      updateData.employeeAddressCity = contactAddress.employeeAddressCity.trim();
    }
    
    if (contactAddress.employeeAddressState && contactAddress.employeeAddressState.trim()) {
      updateData.employeeAddressState = contactAddress.employeeAddressState.trim();
    }
    
    // INFORMAÇÕES FAMILIARES
    if (familyInfo.partnerName && familyInfo.partnerName.trim()) {
      updateData.partnerName = familyInfo.partnerName.trim();
    }
    
    if (familyInfo.partnerCpf && familyInfo.partnerCpf.trim()) {
      updateData.partnerCpf = familyInfo.partnerCpf.trim();
    }
    
    if (familyInfo.partnerBirthday) {
      const partnerBirthday = new Date(familyInfo.partnerBirthday);
      updateData.partnerBirthday = partnerBirthday.toISOString().split('T')[0];
    }
    
    if (familyInfo.partnerRg && familyInfo.partnerRg.trim()) {
      updateData.partnerRg = familyInfo.partnerRg.trim();
    }
    
    // INFORMAÇÕES PROFISSIONAIS
    if (professionalInfo.jobPosition) {
      updateData.jobPosition = professionalInfo.jobPosition;
    }
    
    if (professionalInfo.jobFunctions && professionalInfo.jobFunctions.trim()) {
      updateData.jobFunctions = professionalInfo.jobFunctions.trim();
    }
    
    if (professionalInfo.admissionDate) {
      const admissionDate = new Date(professionalInfo.admissionDate);
      updateData.admissionDate = admissionDate.toISOString().split('T')[0];
    }
    
    if (professionalInfo.period && professionalInfo.period.trim()) {
      updateData.period = professionalInfo.period.trim();
    }
    
    if (professionalInfo.contractExpirationDate) {
      const contractExpirationDate = new Date(professionalInfo.contractExpirationDate);
      updateData.contractExpirationDate = contractExpirationDate.toISOString().split('T')[0];
    }
    
    if (professionalInfo.dailyHours && professionalInfo.dailyHours.trim()) {
      updateData.dailyHours = professionalInfo.dailyHours.trim();
    }
    
    if (professionalInfo.weeklyHours && professionalInfo.weeklyHours.trim()) {
      updateData.weeklyHours = professionalInfo.weeklyHours.trim();
    }
    
    if (professionalInfo.monthlyHours && professionalInfo.monthlyHours.trim()) {
      updateData.monthlyHours = professionalInfo.monthlyHours.trim();
    }
    
    if (professionalInfo.weeklyClasses && professionalInfo.weeklyClasses.trim()) {
      updateData.weeklyClasses = professionalInfo.weeklyClasses.trim();
    }
    
    if (professionalInfo.hasAccumulate !== undefined) {
      updateData.hasAccumulate = professionalInfo.hasAccumulate;
    }
    
    if (professionalInfo.hasAccumulateCompany && professionalInfo.hasAccumulateCompany.trim()) {
      updateData.hasAccumulateCompany = professionalInfo.hasAccumulateCompany.trim();
    }
    
    if (professionalInfo.status) {
      updateData.status = professionalInfo.status;
    }
    
    // INFORMAÇÕES FINANCEIRAS
    if (financialInfo.salary !== undefined && financialInfo.salary !== null) {
      updateData.salary = financialInfo.salary;
    }
    
    if (financialInfo.salaryBank && financialInfo.salaryBank.trim()) {
      updateData.salaryBank = financialInfo.salaryBank.trim();
    }
    
    if (financialInfo.salaryAgency && financialInfo.salaryAgency.trim()) {
      updateData.salaryAgency = financialInfo.salaryAgency.trim();
    }
    
    if (financialInfo.salaryAccount && financialInfo.salaryAccount.trim()) {
      updateData.salaryAccount = financialInfo.salaryAccount.trim();
    }
    
    if (financialInfo.salaryAccountType && financialInfo.salaryAccountType.trim()) {
      updateData.salaryAccountType = financialInfo.salaryAccountType.trim();
    }
    
    if (financialInfo.familySalary !== undefined && financialInfo.familySalary !== null) {
      updateData.familySalary = financialInfo.familySalary;
    }
    
    if (financialInfo.parenting && financialInfo.parenting.trim()) {
      updateData.parenting = financialInfo.parenting.trim();
    }
    
    if (financialInfo.irpf && financialInfo.irpf.trim()) {
      updateData.IRPF = financialInfo.irpf.trim();
    }
    
    // BENEFÍCIOS
    if (benefits.mealValue !== undefined && benefits.mealValue !== null) {
      updateData.mealValue = benefits.mealValue;
    }
    
    if (benefits.transport !== undefined) {
      updateData.transport = benefits.transport;
    }
    
    if (benefits.transportType && benefits.transportType.trim()) {
      updateData.trasportType = benefits.transportType.trim(); // Note: API usa 'trasportType' (com 1 's')
    }
    
    if (benefits.transportValue !== undefined && benefits.transportValue !== null) {
      updateData.transportValue = benefits.transportValue;
    }
    
    if (benefits.healthPlan && benefits.healthPlan.trim()) {
      updateData.healthPlan = benefits.healthPlan.trim();
    }
    
    if (benefits.healthCardNumber && benefits.healthCardNumber.trim()) {
      updateData.healthCardNumber = benefits.healthCardNumber.trim();
    }
    
    if (benefits.deficiency !== undefined) {
      updateData.deficiency = benefits.deficiency;
    }
    
    if (benefits.deficiencyDescription && benefits.deficiencyDescription.trim()) {
      updateData.deficiencyDescription = benefits.deficiencyDescription.trim();
    }
    
    // INFORMAÇÕES UNIVERSITÁRIAS
    if (collegeInfo.college && collegeInfo.college.trim()) {
      updateData.college = collegeInfo.college.trim();
    }
    
    if (collegeInfo.course && collegeInfo.course.trim()) {
      updateData.course = collegeInfo.course.trim();
    }
    
    if (collegeInfo.trainingPeriod && collegeInfo.trainingPeriod.trim()) {
      updateData.trainingPeriod = collegeInfo.trainingPeriod.trim();
    }
    
    if (collegeInfo.ra && collegeInfo.ra.trim()) {
      updateData.ra = collegeInfo.ra.trim();
    }
    
    if (collegeInfo.collegeCep && collegeInfo.collegeCep.trim()) {
      updateData.collegeCep = collegeInfo.collegeCep.trim();
    }
    
    if (collegeInfo.traineeAddress && collegeInfo.traineeAddress.trim()) {
      updateData.traineeAddress = collegeInfo.traineeAddress.trim();
    }
    
    if (collegeInfo.traineeAddressNumber !== undefined && collegeInfo.traineeAddressNumber !== null) {
      updateData.traineeAddressNumber = collegeInfo.traineeAddressNumber;
    }
    
    if (collegeInfo.traineeAddressNeighborhood && collegeInfo.traineeAddressNeighborhood.trim()) {
      updateData.traineeAddressNeighborhood = collegeInfo.traineeAddressNeighborhood.trim();
    }
    
    if (collegeInfo.traineeAddressComplement && collegeInfo.traineeAddressComplement.trim()) {
      updateData.traineeAddressComplement = collegeInfo.traineeAddressComplement.trim();
    }
    
    if (collegeInfo.traineeAddressCity && collegeInfo.traineeAddressCity.trim()) {
      updateData.traineeAddressCity = collegeInfo.traineeAddressCity.trim();
    }
    
    if (collegeInfo.traineeAddressState && collegeInfo.traineeAddressState.trim()) {
      updateData.traineeAddressState = collegeInfo.traineeAddressState.trim();
    }
    
    if (collegeInfo.lifeInsurancePolicy && collegeInfo.lifeInsurancePolicy.trim()) {
      updateData.lifInsurancePolicy = collegeInfo.lifeInsurancePolicy.trim();
    }
    
    console.log('Dados preparados para atualização:', updateData);
    console.log('Quantidade de campos para atualizar:', Object.keys(updateData).length);
    
    return updateData;
  }

  // Marcar todos os campos como touched para mostrar validações
  markFormGroupTouched(formGroup: FormGroup): void {
    if (!formGroup || !formGroup.controls) return;
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl) => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
        });
      }
    });
  }

  // Resetar formulário
  resetForm(): void {
    this.employeeForm?.reset();
    this.selectedPhotoUrl = null;
    while (this.emergencyContacts.length > 1) {
      this.emergencyContacts.removeAt(1);
    }
    while (this.dependents.length > 0) {
      this.dependents.removeAt(0);
    }
    this.employeeForm
      ?.get('basicInfo.maritalStatus')
      ?.setValue(EmployeeMaritalStatus.SOLTEIRO);
    this.employeeForm
      ?.get('professionalInfo.status')
      ?.setValue(EmployeeContractStatus.ACTIVE);
  }

  // Métodos auxiliares para validação e mensagens de erro
  hasFieldError(fieldPath: string, errorType?: string): boolean {
    const field = this.employeeForm?.get(fieldPath);
    if (!field) return false;
    if (errorType) {
      return field.hasError(errorType) && (field.dirty || field.touched);
    }
    return field.invalid && (field.dirty || field.touched);
  }

  getFieldError(fieldPath: string): string {
    const field = this.employeeForm?.get(fieldPath);
    if (!field || !field.errors) return '';
    const errors = field.errors;
    if (errors['required']) return 'Campo obrigatório';
    if (errors['email']) return 'Email inválido';
    if (errors['minlength'])
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength'])
      return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['invalidCpf']) return 'CPF inválido';
    if (errors['invalidPhone']) return 'Telefone inválido';
    return 'Campo inválido';
  }

  // Validação de CPF
  validateCpf(): void {
    const cpfControl = this.employeeForm.get('documents.cpf');
    if (cpfControl && cpfControl.value) {
      const cpf = cpfControl.value.replace(/\D/g, '');
      if (!this.isValidCpf(cpf)) {
        cpfControl.setErrors({ invalidCpf: true });
      } else {
        const errors = cpfControl.errors;
        if (errors) {
          delete errors['invalidCpf'];
          cpfControl.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    }
  }

  // Verificar se CPF é válido
  private isValidCpf(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    return true;
  }

  // Máscara dinâmica para telefone
  getPhoneMask(fieldName: string): string {
    const control = this.employeeForm.get(`contactAddress.${fieldName}`);
    if (control && control.value) {
      const digits = control.value.replace(/\D/g, '');
      return digits.length <= 10 ? '(00) 0000-0000' : '(00) 00000-0000';
    }
    return '(00) 00000-0000';
  }

  // Validação de telefone
  onPhoneInput(fieldName: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const control = this.employeeForm.get(`contactAddress.${fieldName}`);
    if (control && input.value) {
      const digits = input.value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 11) {
        control.setErrors({ invalidPhone: true });
      } else {
        const errors = control.errors;
        if (errors) {
          delete errors['invalidPhone'];
          control.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    }
  }

  // Focar no primeiro campo inválido
  private focusFirstInvalidField(): void {
    const firstInvalidControl = document.querySelector('.ng-invalid');
    if (firstInvalidControl) {
      (firstInvalidControl as HTMLElement).focus();
    }
  }

  // Submit com foco no primeiro campo inválido
  onSubmitWithFocus(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched(this.employeeForm);
      this.focusFirstInvalidField();
      this.snackBar.open(
        'Por favor, corrija os erros no formulário antes de enviar.',
        'OK',
        { duration: 3000 }
      );
      return;
    }
    this.onSubmit();
  }

  /**
   * Navegar para um step específico
   */
  goToStep(stepIndex: number): void {
    if (this.stepper && stepIndex >= 0 && stepIndex < this.stepper.steps.length) {
      this.stepper.selectedIndex = stepIndex;
    }
  }

  /**
   * Formatar data para exibição
   */
  formatDate(date: any): string {
    if (!date) return '';
    
    if (date instanceof Date) {
      return date.toLocaleDateString('pt-BR');
    }
    
    // Se for string, tentar converter
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString('pt-BR');
    }
    
    return date.toString();
  }

  /**
   * Formatar valor monetário
   */
  formatCurrency(value: any): string {
    if (!value) return '';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return value.toString();
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  }

  /**
   * Obter endereço completo formatado
   */
  getFullAddress(): string {
    const addressGroup = this.employeeForm?.get('contactAddress');
    if (!addressGroup) return '';

    const getValue = (fieldName: string) => {
      const value = addressGroup.get(fieldName)?.value;
      return value && typeof value === 'string' ? value.trim() : '';
    };

    const address = getValue('employeeAddress');
    const number = getValue('employeeAddressNumber');
    const complement = getValue('employeeAddressComplement');
    const neighborhood = getValue('employeeNeighborhood');
    const city = getValue('employeeAddressCity');
    const state = getValue('employeeAddressState');

    const parts: string[] = [];
    
    // Endereço + número
    if (address || number) {
      if (address && number) {
        parts.push(`${address}, ${number}`);
      } else {
        parts.push(address || number);
      }
    }
    
    // Complemento
    if (complement) {
      parts.push(complement);
    }
    
    // Bairro
    if (neighborhood) {
      parts.push(neighborhood);
    }
    
    // Cidade e estado
    if (city || state) {
      if (city && state) {
        parts.push(`${city} - ${state}`);
      } else {
        parts.push(city || state);
      }
    }

    return parts.join(', ');
  }

  /**
   * Obter resumo de validação
   */
  getValidationSummary(): Array<{valid: boolean, message: string, stepIndex: number}> {
    if (!this.employeeForm) return [];
    
    const summary = [];
    
    // Para novos funcionários, validações mais rigorosas
    if (!this.isEditMode) {
      // Validar foto obrigatória
      summary.push({
        valid: !!(this.selectedPhotoFile || this.selectedPhotoUrl),
        message: 'Foto é obrigatória para novos funcionários',
        stepIndex: 0
      });
      
      // Validar informações básicas obrigatórias
      const basicInfo = this.employeeForm.get('basicInfo');
      const fullName = basicInfo?.get('fullName')?.value;
      summary.push({
        valid: !!(fullName && fullName.trim().length >= 2),
        message: 'Nome completo é obrigatório (mínimo 2 caracteres)',
        stepIndex: 0
      });

      const tagName = basicInfo?.get('tagName')?.value;
      summary.push({
        valid: !!(tagName && tagName.trim()),
        message: 'Nome para crachá é obrigatório',
        stepIndex: 0
      });

      const tagLastName = basicInfo?.get('tagLastName')?.value;
      summary.push({
        valid: !!(tagLastName && tagLastName.trim()),
        message: 'Sobrenome para crachá é obrigatório',
        stepIndex: 0
      });
    }
    
    // Validações comuns (para criação e edição)
    const basicInfo = this.employeeForm.get('basicInfo');
    
    // Validar email se fornecido
    const email = basicInfo?.get('email')?.value;
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      summary.push({
        valid: emailRegex.test(email),
        message: 'E-mail deve ter um formato válido',
        stepIndex: 0
      });
    }
    
    // Para edição, validar apenas se campos estão preenchidos corretamente
    if (this.isEditMode) {
      const fullName = basicInfo?.get('fullName')?.value;
      if (fullName && fullName.trim() && fullName.trim().length < 2) {
        summary.push({
          valid: false,
          message: 'Nome completo deve ter pelo menos 2 caracteres',
          stepIndex: 0
        });
      }
    }

    return summary;
  }

  /**
   * Obter classe CSS para o resumo de validação
   */
  getValidationSummaryClass(): string {
    const summary = this.getValidationSummary();
    const hasErrors = summary.some(item => !item.valid);
    return hasErrors ? 'validation-error' : 'validation-success';
  }

  /**
   * Obter ícone para o resumo de validação
   */
  getValidationIcon(): string {
    const summary = this.getValidationSummary();
    const hasErrors = summary.some(item => !item.valid);
    return hasErrors ? 'warning' : 'check_circle';
  }

  // Log detalhado de erros do formulário
  logFormErrors(formGroup: FormGroup, groupName = ''): void {
    if (!formGroup) return;
    
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      const fullKey = groupName ? `${groupName}.${key}` : key;
      
      if (control instanceof FormGroup) {
        this.logFormErrors(control, fullKey);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl, index) => {
          if (arrayControl instanceof FormGroup) {
            this.logFormErrors(arrayControl, `${fullKey}[${index}]`);
          }
        });
      } else if (control && control.errors) {
        console.error(`Erro no campo ${fullKey}:`, control.errors, 'Valor:', control.value);
      }
    });
  }

  // Validar campos obrigatórios personalizados
  validateRequiredFields(): string[] {
    const errors: string[] = [];
    
    // Para novos funcionários, validações mais rigorosas
    if (!this.isEditMode) {
      // Validar foto obrigatória apenas para novos funcionários
      if (!this.selectedPhotoFile && !this.selectedPhotoUrl) {
        errors.push('Foto é obrigatória para novos funcionários');
      }
      
      // Validar nome completo
      const fullName = this.employeeForm?.get('basicInfo.fullName')?.value;
      if (!fullName || !fullName.trim()) {
        errors.push('Nome completo é obrigatório');
      }
      
      // Validar nome para crachá
      const tagName = this.employeeForm?.get('basicInfo.tagName')?.value;
      if (!tagName || !tagName.trim()) {
        errors.push('Nome para crachá é obrigatório');
      }
      
      // Validar sobrenome para crachá
      const tagLastName = this.employeeForm?.get('basicInfo.tagLastName')?.value;
      if (!tagLastName || !tagLastName.trim()) {
        errors.push('Sobrenome para crachá é obrigatório');
      }
    }
    // Para edição, validações mais flexíveis (apenas se campos estiverem preenchidos)
    else {
      // Validar nome completo se preenchido
      const fullName = this.employeeForm?.get('basicInfo.fullName')?.value;
      if (fullName && fullName.trim() && fullName.trim().length < 2) {
        errors.push('Nome completo deve ter pelo menos 2 caracteres');
      }
      
      // Validar email se preenchido
      const email = this.employeeForm?.get('basicInfo.email')?.value;
      if (email && email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.push('E-mail deve ter um formato válido');
        }
      }
    }
    
    return errors;
  }

  // Método de teste com dados fixos (independente do formulário)
  testFixedDataSubmit(): void {
    console.log('Testando envio com dados fixos...');
    
    // Dados fixos para testar se a API está funcionando
    const fixedData = {
      fullName: 'Teste Atualização',
      email: 'teste.atualizacao@teste.com',
      jobFunctions: 'Função de teste atualizada',
      phone: '(11) 99999-9999',
      status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' // Usando o formato correto para o status
    };
    
    console.log('Dados fixos para teste:', fixedData);
    console.log('ID do funcionário para teste:', this.employeeId);
    console.log('URL completa da requisição:', `${this.employeeService['apiUrl']}${this.employeeService['endpoint']}/${this.employeeId}`);
    
    this.isSubmitting = true;
    this.employeeService.updateEmployee(this.employeeId!, fixedData)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (result) => {
          console.log('Sucesso no teste com dados fixos:', result);
          this.snackBar.open('Teste com dados fixos funcionou! API está OK.', 'OK', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          // Recarregar dados para verificar se realmente foi atualizado
          this.loadEmployeeData(this.employeeId!);
        },
        error: (error) => {
          console.error('Erro no teste com dados fixos:', error);
          console.error('Detalhes do erro:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });
          this.snackBar.open(`Erro no teste fixo: ${error.message}`, 'OK', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  // Método para verificar configuração da API
  testApiConfiguration(): void {
    console.log('=== CONFIGURAÇÃO DA API ===');
    console.log('URL da API:', this.employeeService['apiUrl']);
    console.log('Endpoint employees:', this.employeeService['endpoint']);
    console.log('URL completa:', `${this.employeeService['apiUrl']}${this.employeeService['endpoint']}`);
    console.log('Environment:', {
      production: window.location.hostname !== 'localhost',
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port
    });
    
    // Verificar variáveis de ambiente
    console.log('=== VARIÁVEIS DE AMBIENTE ===');
    try {
      if (import.meta && import.meta.env) {
        console.log('VITE_API_URL_DEV:', import.meta.env.VITE_API_URL_DEV);
        console.log('VITE_API_URL_PROD:', import.meta.env.VITE_API_URL_PROD);
        console.log('VITE_APP_ENVIRONMENT:', import.meta.env.VITE_APP_ENVIRONMENT);
      } else {
        console.log('import.meta.env não disponível');
      }
    } catch (e) {
      console.log('Erro ao acessar import.meta.env:', e);
    }
    
    this.snackBar.open('Configuração da API logada no console', 'OK', { duration: 3000 });
  }
}
