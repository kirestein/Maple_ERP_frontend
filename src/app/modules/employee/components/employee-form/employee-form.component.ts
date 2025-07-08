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
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe((params) => {
      this.employeeId = params.get('id');
      if (this.employeeId) {
        this.isEditMode = true;
        this.loadEmployeeData(this.employeeId);
      }
    });
    this.setupFormListeners();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      basicInfo: this.fb.group({
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.email]],
        tagName: ['', [Validators.required]],
        tagLastName: ['', [Validators.required]],
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
          // TODO: Implementar carregamento de foto
          // if (employee.photoUrl) {
          //   this.selectedPhotoUrl = employee.photoUrl;
          // }
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

  // Buscar endereço pelo CEP (placeholder)
  searchAddressByCep(cepField: string): void {
    const cep = this.employeeForm?.get(cepField)?.value;
    if (cep && cep.length === 8) {
      // Implementar integração com API de CEP
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
        
        const operation$ = this.employeeService.updateEmployee(this.employeeId!, updateData);
        
        operation$
          .pipe(finalize(() => (this.isSubmitting = false)))
          .subscribe({
            next: (employee: Employee) => {
              this.snackBar.open('Funcionário atualizado com sucesso!', 'OK', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.router.navigate(['/employees']);
            },
            error: (error: any) => {
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
    
    const minimalData = {
      fullName: 'Teste Funcionário',
      cpf: '12345678901',
      jobPosition: EmployeeCargo.PROFESSOR,
      admissionDate: new Date(),
      status: EmployeeContractStatus.ACTIVE
    };
    
    console.log('Dados mínimos:', minimalData);
    
    this.isSubmitting = true;
    this.employeeService.createEmployee(minimalData as any)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (result) => {
          console.log('Sucesso no teste mínimo:', result);
          this.snackBar.open('Teste mínimo funcionou!', 'OK', { duration: 3000 });
        },
        error: (error) => {
          console.error('Erro no teste mínimo:', error);
          this.snackBar.open(`Erro no teste mínimo: ${error.message}`, 'OK', { duration: 5000 });
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
    const basicInfo = formValue.basicInfo || {};
    const professionalInfo = formValue.professionalInfo || {};
    const contactAddress = formValue.contactAddress || {};
    
    const updateData: any = {};
    
    // Campos que podem ser atualizados conforme API
    if (basicInfo.fullName && basicInfo.fullName.trim()) {
      updateData.fullName = basicInfo.fullName.trim();
    }
    
    if (professionalInfo.jobFunctions && professionalInfo.jobFunctions.trim()) {
      updateData.jobFunctions = professionalInfo.jobFunctions.trim();
    }
    
    if (basicInfo.birthday) {
      const birthday = new Date(basicInfo.birthday);
      updateData.birthday = birthday.toISOString().split('T')[0];
    }
    
    if (basicInfo.email && basicInfo.email.trim()) {
      updateData.email = basicInfo.email.trim();
    }
    
    if (contactAddress.phone && contactAddress.phone.trim()) {
      updateData.phone = contactAddress.phone.trim();
    }
    
    if (contactAddress.mobile && contactAddress.mobile.trim()) {
      updateData.mobile = contactAddress.mobile.trim();
    }
    
    if (professionalInfo.status) {
      updateData.status = professionalInfo.status;
    }
    
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
    
    // Validar foto obrigatória
    summary.push({
      valid: !!(this.selectedPhotoFile || this.selectedPhotoUrl),
      message: 'Foto é obrigatória',
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
    
    // Validar foto obrigatória
    if (!this.selectedPhotoFile && !this.selectedPhotoUrl) {
      errors.push('Foto é obrigatória');
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
    
    return errors;
  }
}
