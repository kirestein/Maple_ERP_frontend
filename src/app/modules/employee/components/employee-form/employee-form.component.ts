import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

// Material Imports
import { MatStepperModule } from '@angular/material/stepper';
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
import {
  Employee,
  EmployeeGender,
  EmployeeMaritalStatus,
  EmployeeGraduation,
  EmployeeSkinColor,
  EmployeeCargo,
  EmployeeContractStatus,
  DriverLicenseCategory,
  EmployeeRelationship
} from '../../../../../shared/models/employee.model';

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
    NgxMaskDirective
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;
  selectedPhotoUrl: string | ArrayBuffer | null = null;
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
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    try {
      this.initForm();
      
      // Verificar se estamos em modo de edição
      this.route.paramMap.subscribe(params => {
        this.employeeId = params.get('id');
        if (this.employeeId) {
          this.isEditMode = true;
          this.loadEmployeeData(this.employeeId);
          // Aqui carregaríamos os dados do funcionário para edição
          // this.loadEmployeeData(this.employeeId);
        }
      });


      // Adicionar listeners para campos dependentes
      this.setupFormListeners();
    } catch (error) {
      console.error('Erro ao inicializar o componente:', error);
      this.snackBar.open('Erro ao carregar o formulário. Recarregue a página.', 'OK', {
        duration: 3000
      });
    }
  }

  initForm(): void {
    try {
      this.employeeForm = this.fb.group({
        // Informações Básicas
        basicInfo: this.fb.group({
          fullName: ['', [Validators.required]],
          email: [''],
          tagName: [''],
          tagLastName: [''],
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

        // Documentação
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

        // Contato e Endereço
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

        // Informações Familiares
        familyInfo: this.fb.group({
          partnerName: [''],
          partnerCpf: [''],
          partnerBirthday: [null],
          partnerRg: [''],
          dependents: this.fb.array([])
        }),

        // Informações Profissionais
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

        // Informações Financeiras
        financialInfo: this.fb.group({
          salary: [null],
          salaryBank: [''],
          salaryAgency: [''],
          salaryAccount: [''],
          salaryAccountType: [''],
          familySalary: [null],
          parenting: [''],
          IRPF: [''],
        }),

        // Benefícios e Adicionais
        benefits: this.fb.group({
          mealValue: [null],
          transport: [false],
          trasportType: [''],
          transportValue: [null],
          healthPlan: [''],
          healthCardNumber: [''],
          deficiency: [false],
          deficiencyDescription: [''],
        }),

        // Informações de Estágio/Faculdade (quando aplicável)
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

        // Contatos de Emergência
        emergencyContacts: this.fb.array([this.createEmergencyContactForm()]),
      });
    } catch (error) {
      console.error('Erro ao criar formulário:', error);
      throw error;
    }

  }

  // Carregar dados do funcionário para edição
  loadEmployeeData(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.employeeService.getEmployeeById(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (employee) => {
          this.populateForm(employee);
          if (employee.employeePhoto) {
            this.selectedPhotoUrl = employee.employeePhoto;
          }
        },
        error: (err) => {
          this.error = err.message || 'Erro ao carregar dados do funcionário';
          this.snackBar.open(this.error || 'Erro ao carregar dados do funcionário', 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  // Preencher formulário com dados do funcionário
  populateForm(employee: Employee): void {
    // Informações Básicas
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

    // Documentação
    this.employeeForm.get('documents')?.patchValue({
      cpf: employee.cpf,
      rg: employee.rg,
      rgEmitter: employee.rgEmitter,
      rgEmissionDate: employee.rgEmissionDate ? new Date(employee.rgEmissionDate) : null,
      pisPasep: employee.pisPasep,
      voterTitle: employee.voterTitle,
      voterZone: employee.voterZone,
      voterSection: employee.voterSection,
      voterEmission: employee.voterEmission ? new Date(employee.voterEmission) : null,
      militaryCertificate: employee.militaryCertificate,
      ctps: employee.ctps,
      ctpsSerie: employee.ctpsSerie,
      driversLicense: employee.driversLicense,
      driversLicenseNumber: employee.driversLicenseNumber,
      driversLicenseCategory: employee.driversLicenseCategory,
      driversLicenseEmissionDate: employee.driversLicenseEmissionDate ? new Date(employee.driversLicenseEmissionDate) : null,
      driversLicenseExpirationDate: employee.driversLicenseExpirationDate ? new Date(employee.driversLicenseExpirationDate) : null,
    });

    // Contato e Endereço
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

    // Informações Familiares
    this.employeeForm.get('familyInfo')?.patchValue({
      partnerName: employee.partnerName,
      partnerCpf: employee.partnerCpf,
      partnerBirthday: employee.partnerBirthday ? new Date(employee.partnerBirthday) : null,
      partnerRg: employee.partnerRg,
    });

    // Limpar e adicionar dependentes
    const dependentsArray = this.employeeForm.get('familyInfo.dependents') as FormArray;
    dependentsArray.clear();
    
    if (employee.employeeDependent && employee.employeeDependent.length > 0) {
      employee.employeeDependent.forEach(dependent => {
        const dependentForm = this.createDependentForm();
        dependentForm.patchValue({
          dependentName: dependent.dependentName,
          dependentCpf: dependent.dependentCpf,
          dependentBirthday: dependent.dependentBirthday ? new Date(dependent.dependentBirthday) : null,
          dependentRelationship: dependent.dependentRelationship,
        });
        dependentsArray.push(dependentForm);
      });
    }

    // Informações Profissionais
    this.employeeForm.get('professionalInfo')?.patchValue({
      jobPosition: employee.jobPosition,
      jobFunctions: employee.jobFunctions,
      admissionDate: employee.admissionDate ? new Date(employee.admissionDate) : null,
      period: employee.period,
      contractExpirationDate: employee.contractExpirationDate ? new Date(employee.contractExpirationDate) : null,
      dailyHours: employee.dailyHours,
      weeklyHours: employee.weeklyHours,
      monthlyHours: employee.monthlyHours,
      weeklyClasses: employee.weeklyClasses,
      hasAccumulate: employee.hasAccumulate,
      hasAccumulateCompany: employee.hasAccumulateCompany,
      status: employee.status,
    });

    // Informações Financeiras
    this.employeeForm.get('financialInfo')?.patchValue({
      salary: employee.salary,
      salaryBank: employee.salaryBank,
      salaryAgency: employee.salaryAgency,
      salaryAccount: employee.salaryAccount,
      salaryAccountType: employee.salaryAccountType,
      familySalary: employee.familySalary,
      parenting: employee.parenting,
      IRPF: employee.IRPF,
    });

    // Benefícios e Adicionais
    this.employeeForm.get('benefits')?.patchValue({
      mealValue: employee.mealValue,
      transport: employee.transport,
      trasportType: employee.trasportType,
      transportValue: employee.transportValue,
      healthPlan: employee.healthPlan,
      healthCardNumber: employee.healthCardNumber,
      deficiency: employee.deficiency,
      deficiencyDescription: employee.deficiencyDescription,
    });

    // Informações de Estágio/Faculdade
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
      lifInsurancePolicy: employee.lifInsurancePolicy,
    });

    // Limpar e adicionar contatos de emergência
    const contactsArray = this.employeeForm.get('emergencyContacts') as FormArray;
    contactsArray.clear();
    
    if (employee.employeeContact && employee.employeeContact.length > 0) {
      employee.employeeContact.forEach(contact => {
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
      // Adicionar pelo menos um contato vazio
      contactsArray.push(this.createEmergencyContactForm());
    }
  }

  // Criar formulário para contato de emergência
  createEmergencyContactForm(): FormGroup {
    try {
      return this.fb.group({
        contactName: [''],
        contactPhone: [''],
        contactEmail: [''],
        contactRelationship: [null],
      });
    } catch (error) {
      console.error('Erro ao criar formulário de contato de emergência:', error);
      return this.fb.group({
        contactName: [''],
        contactPhone: [''],
        contactEmail: [''],
        contactRelationship: [null],
      });
    }
  }

  // Criar formulário para dependente
  createDependentForm(): FormGroup {
    try {
      return this.fb.group({
        dependentName: [''],
        dependentCpf: [''],
        dependentBirthday: [null],
        dependentRelationship: [null],
      });
    } catch (error) {
      console.error('Erro ao criar formulário de dependente:', error);
      return this.fb.group({
        dependentName: [''],
        dependentCpf: [''],
        dependentBirthday: [null],
        dependentRelationship: [null],
      });
    }
  }

  // Getters seguros para os FormArrays
  get emergencyContacts(): FormArray {
    try {
      return this.employeeForm?.get('emergencyContacts') as FormArray;
    } catch (error) {
      console.warn('Erro ao acessar emergencyContacts:', error);
      return this.fb.array([]);
    }
  }

  get dependents(): FormArray {
    try {
      return this.employeeForm?.get('familyInfo.dependents') as FormArray;
    } catch (error) {
      console.warn('Erro ao acessar dependents:', error);
      return this.fb.array([]);
    }
  }

  // Adicionar contato de emergência
  addEmergencyContact(): void {
    try {
      this.emergencyContacts.push(this.createEmergencyContactForm());
    } catch (error) {
      console.error('Erro ao adicionar contato de emergência:', error);
      this.snackBar.open('Erro ao adicionar contato de emergência', 'OK', {
        duration: 3000
      });
    }
  }

  // Remover contato de emergência
  removeEmergencyContact(index: number): void {
    try {
      if (this.emergencyContacts.length > 1) {
        this.emergencyContacts.removeAt(index);
      } else {
        this.snackBar.open('É necessário manter pelo menos um contato de emergência', 'OK', {
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Erro ao remover contato de emergência:', error);
    }
  }

  // Adicionar dependente
  addDependent(): void {
    try {
      this.dependents.push(this.createDependentForm());
    } catch (error) {
      console.error('Erro ao adicionar dependente:', error);
      this.snackBar.open('Erro ao adicionar dependente', 'OK', {
        duration: 3000
      });
    }
  }

  // Remover dependente
  removeDependent(index: number): void {
    try {
      this.dependents.removeAt(index);
    } catch (error) {
      console.error('Erro ao remover dependente:', error);
    }
  }

  // Configurar listeners para campos dependentes
  setupFormListeners(): void {
    try {
      // Exemplo: Habilitar/desabilitar campos de CNH baseado no checkbox
      const driversLicenseControl = this.employeeForm?.get('documents.driversLicense');
      if (driversLicenseControl) {
        const driversLicenseFields = [
          this.employeeForm.get('documents.driversLicenseNumber'),
          this.employeeForm.get('documents.driversLicenseCategory'),
          this.employeeForm.get('documents.driversLicenseEmissionDate'),
          this.employeeForm.get('documents.driversLicenseExpirationDate')
        ].filter(field => field !== null);

        driversLicenseControl.valueChanges.subscribe(hasLicense => {
          if (hasLicense) {
            driversLicenseFields.forEach(field => field?.enable());
          } else {
            driversLicenseFields.forEach(field => {
              field?.disable();
              field?.setValue(null);
            });
          }
        });

        // Inicializar estado dos campos de CNH
        if (!driversLicenseControl.value) {
          driversLicenseFields.forEach(field => field?.disable());
        }
      }
    } catch (error) {
      console.warn('Erro ao configurar listeners:', error);
    }
  }

  // Método para upload de foto
  onPhotoSelected(event: Event): void {
    try {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length) {
        const file = input.files[0];
        const reader = new FileReader();
        
        reader.onload = () => {
          this.selectedPhotoUrl = reader.result;
        };
        
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
      this.snackBar.open('Erro ao carregar a foto', 'OK', {
        duration: 3000
      });

    }
  }

  // Método para remover foto
  removePhoto(): void {
    this.selectedPhotoUrl = null;
    this.photoError = null;
    this.employeeForm.get('basicInfo.employeePhoto')?.setValue(null);
  }

  // Buscar endereço pelo CEP
  searchAddressByCep(cepField: string): void {
    try {
      const cep = this.employeeForm?.get(cepField)?.value;
      if (cep && cep.length === 8) {
        // Implementar chamada para API de CEP (ViaCEP, por exemplo)
        // e preencher os campos de endereço automaticamente
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  }

  // Enviar formulário
  onSubmit(): void {
    try {
      if (!this.employeeForm || this.employeeForm.invalid) {
        this.markFormGroupTouched(this.employeeForm);
        this.snackBar.open('Por favor, corrija os erros no formulário antes de enviar.', 'OK', {
          duration: 3000
        });
        return;
      }


      // Construir objeto Employee a partir do formulário
      const employeeData = this.prepareEmployeeData();
      
      // Criar FormData para envio com arquivo
      const formData = new FormData();
      
      // Adicionar dados do funcionário como JSON
      formData.append('employee', JSON.stringify(employeeData));
      
      // Adicionar foto se houver
      if (this.selectedPhotoUrl && typeof this.selectedPhotoUrl !== 'string') {
        // Converter base64 para Blob
        // Implementar conversão
      }
      
      // Enviar para o serviço
      if (this.isEditMode && this.employeeId) {
        // Atualizar funcionário existente
        // this.employeeService.updateEmployee(this.employeeId, formData)...
        this.snackBar.open('Funcionalidade de edição em desenvolvimento', 'OK', {
          duration: 3000
        });
      } else {
        // Criar novo funcionário
        this.employeeService.createEmployee(formData).subscribe({
          next: (response) => {
            this.snackBar.open('Funcionário cadastrado com sucesso!', 'OK', {
              duration: 3000
            });
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            this.snackBar.open('Erro ao cadastrar funcionário. Verifique a conexão com o servidor.', 'OK', {
              duration: 3000
            });
            console.warn('Erro ao cadastrar funcionário:', error);
          }
        });
      }
    } catch (error) {
      console.error('Erro no onSubmit:', error);
      this.snackBar.open('Erro inesperado. Tente novamente.', 'OK', {
        duration: 3000
      });

    }
  }

  // Cancelar formulário e voltar à lista
  cancel(): void {
    try {
      this.router.navigate(['/employees']);
    } catch (error) {
      console.error('Erro ao cancelar:', error);
    }
  }

  // Preparar dados do funcionário para envio
  prepareEmployeeData(): Employee {
    try {
      const formValue = this.employeeForm?.value || {};
      
      // Combinar todos os grupos em um único objeto Employee
      const employee: Employee = {
        ...formValue.basicInfo || {},
        ...formValue.documents || {},
        ...formValue.contactAddress || {},
        ...formValue.professionalInfo || {},
        ...formValue.financialInfo || {},
        ...formValue.benefits || {},
        ...formValue.collegeInfo || {},
        
        // Campos específicos de outros grupos
        partnerName: formValue.familyInfo?.partnerName || '',
        partnerCpf: formValue.familyInfo?.partnerCpf || '',
        partnerBirthday: formValue.familyInfo?.partnerBirthday || null,
        partnerRg: formValue.familyInfo?.partnerRg || '',
        
        // Relacionamentos
        employeeContact: formValue.emergencyContacts || [],
        employeeDependent: formValue.familyInfo?.dependents || [],
      };
      
      return employee;
    } catch (error) {
      console.warn('Erro ao preparar dados do funcionário:', error);
      return {} as Employee;
    }
  }

  // Marcar todos os campos como touched para mostrar validações
  markFormGroupTouched(formGroup: FormGroup): void {
    try {
      if (!formGroup || !formGroup.controls) {
        return;
      }
      
      Object.values(formGroup.controls).forEach(control => {
        if (control) {
          control.markAsTouched();
          
          if (control instanceof FormGroup) {
            this.markFormGroupTouched(control);
          } else if (control instanceof FormArray) {
            control.controls.forEach(arrayControl => {
              if (arrayControl instanceof FormGroup) {
                this.markFormGroupTouched(arrayControl);
              }
            });
          }
        }
      });
    } catch (error) {
      console.warn('Erro ao marcar campos como touched:', error);
    }
  }

  // Resetar formulário
  resetForm(): void {
    try {
      this.employeeForm?.reset();
      this.selectedPhotoUrl = null;
      
      // Resetar arrays para estado inicial
      while (this.emergencyContacts.length > 1) {
        this.emergencyContacts.removeAt(1);
      }
      
      while (this.dependents.length > 0) {
        this.dependents.removeAt(0);
      }
      
      // Restaurar valores padrão
      this.employeeForm?.get('basicInfo.maritalStatus')?.setValue(EmployeeMaritalStatus.SOLTEIRO);
      this.employeeForm?.get('professionalInfo.status')?.setValue(EmployeeContractStatus.ACTIVE);
    } catch (error) {
      console.error('Erro ao resetar formulário:', error);
    }
  }

  // Método auxiliar para verificar se um campo tem erro
  hasFieldError(fieldPath: string, errorType?: string): boolean {
    try {
      const field = this.employeeForm?.get(fieldPath);
      if (!field) return false;
      
      if (errorType) {
        return field.hasError(errorType) && (field.dirty || field.touched);
      }
      
      return field.invalid && (field.dirty || field.touched);
    } catch (error) {
      console.warn('Erro ao verificar erro do campo:', error);
      return false;
    }

  // Método auxiliar para obter mensagem de erro
  getFieldError(fieldPath: string): string {
    try {
      const field = this.employeeForm?.get(fieldPath);
      if (!field || !field.errors) return '';
      
      const errors = field.errors;
      
      if (errors['required']) return 'Campo obrigatório';
      if (errors['email']) return 'Email inválido';
      if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
      if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
      
      return 'Campo inválido';
    } catch (error) {
      console.warn('Erro ao obter mensagem de erro:', error);
      return '';
    }
  }
}
    
    // Restaurar valores padrão
    this.employeeForm.get('basicInfo.maritalStatus')?.setValue(EmployeeMaritalStatus.SOLTEIRO);
    this.employeeForm.get('professionalInfo.status')?.setValue(EmployeeContractStatus.ACTIVE);
  }
}

  // Validação de CPF
  validateCpf(): void {
    const cpfControl = this.employeeForm.get('documents.cpf');
    if (cpfControl && cpfControl.value) {
      const cpf = cpfControl.value.replace(/\D/g, '');
      
      if (!this.isValidCpf(cpf)) {
        cpfControl.setErrors({ invalidCpf: true });
      } else {
        // Remove o erro se o CPF for válido
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
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
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
    return '(00) 00000-0000'; // Padrão para celular
  }

  // Validação de telefone
  onPhoneInput(fieldName: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const control = this.employeeForm.get(`contactAddress.${fieldName}`);
    
    if (control && input.value) {
      const digits = input.value.replace(/\D/g, '');
      
      // Validar quantidade de dígitos
      if (digits.length < 10 || digits.length > 11) {
        control.setErrors({ invalidPhone: true });
      } else {
        // Remove o erro se o telefone for válido
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

  // Sobrescrever o método onSubmit para incluir foco no primeiro campo inválido
  onSubmitWithFocus(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched(this.employeeForm);
      this.focusFirstInvalidField();
      this.snackBar.open('Por favor, corrija os erros no formulário antes de enviar.', 'OK', {
        duration: 3000
      });
      return;
    }
    
    this.onSubmit();
  }

