import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    NgxMaskDirective
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;
  selectedPhotoUrl: string | ArrayBuffer | null = null;
  
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
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Verificar se estamos em modo de edição
    this.route.paramMap.subscribe(params => {
      this.employeeId = params.get('id');
      if (this.employeeId) {
        this.isEditMode = true;
        // Aqui carregaríamos os dados do funcionário para edição
        // this.loadEmployeeData(this.employeeId);
      }
    });

    // Adicionar listeners para campos dependentes
    this.setupFormListeners();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      // Informações Básicas
      basicInfo: this.fb.group({
        fullName: ['', [Validators.required]],
        email: ['', [Validators.email]],
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
        cpf: ['', [Validators.minLength(11)]],
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
  }

  // Criar formulário para contato de emergência
  createEmergencyContactForm(): FormGroup {
    return this.fb.group({
      contactName: [''],
      contactPhone: [''],
      contactEmail: ['', [Validators.email]],
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

  // Getters para os FormArrays
  get emergencyContacts(): FormArray {
    return this.employeeForm.get('emergencyContacts') as FormArray;
  }

  get dependents(): FormArray {
    return this.employeeForm.get('familyInfo.dependents') as FormArray;
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
      this.snackBar.open('É necessário manter pelo menos um contato de emergência', 'OK', {
        duration: 3000
      });
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
    // Exemplo: Habilitar/desabilitar campos de CNH baseado no checkbox
    const driversLicenseControl = this.employeeForm.get('documents.driversLicense');
    const driversLicenseFields = [
      this.employeeForm.get('documents.driversLicenseNumber'),
      this.employeeForm.get('documents.driversLicenseCategory'),
      this.employeeForm.get('documents.driversLicenseEmissionDate'),
      this.employeeForm.get('documents.driversLicenseExpirationDate')
    ];

    driversLicenseControl?.valueChanges.subscribe(hasLicense => {
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
    if (!driversLicenseControl?.value) {
      driversLicenseFields.forEach(field => field?.disable());
    }

    // Outros listeners similares para campos dependentes
    // ...
  }

  // Método para upload de foto
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        this.selectedPhotoUrl = reader.result;
      };
      
      reader.readAsDataURL(file);
    }
  }

  // Buscar endereço pelo CEP
  searchAddressByCep(cepField: string): void {
    const cep = this.employeeForm.get(cepField)?.value;
    if (cep && cep.length === 8) {
      // Implementar chamada para API de CEP (ViaCEP, por exemplo)
      // e preencher os campos de endereço automaticamente
    }
  }

  // Enviar formulário
  onSubmit(): void {
    if (this.employeeForm.invalid) {
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
          this.snackBar.open('Erro ao cadastrar funcionário. Tente novamente.', 'OK', {
            duration: 3000
          });
          console.error('Erro ao cadastrar funcionário:', error);
        }
      });
    }
  }

  // Cancelar formulário e voltar à lista
  cancel(): void {
    this.router.navigate(['/employees']);
  }

  // Preparar dados do funcionário para envio
  prepareEmployeeData(): Employee {
    const formValue = this.employeeForm.value;
    
    // Combinar todos os grupos em um único objeto Employee
    const employee: Employee = {
      ...formValue.basicInfo,
      ...formValue.documents,
      ...formValue.contactAddress,
      ...formValue.professionalInfo,
      ...formValue.financialInfo,
      ...formValue.benefits,
      ...formValue.collegeInfo,
      
      // Campos específicos de outros grupos
      partnerName: formValue.familyInfo?.partnerName,
      partnerCpf: formValue.familyInfo?.partnerCpf,
      partnerBirthday: formValue.familyInfo?.partnerBirthday,
      partnerRg: formValue.familyInfo?.partnerRg,
      
      // Relacionamentos
      employeeContact: formValue.emergencyContacts,
      employeeDependent: formValue.familyInfo?.dependents,
    };
    
    return employee;
  }

  // Marcar todos os campos como touched para mostrar validações
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
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
    });
  }

  // Resetar formulário
  resetForm(): void {
    this.employeeForm.reset();
    this.selectedPhotoUrl = null;
    
    // Resetar arrays para estado inicial
    while (this.emergencyContacts.length > 1) {
      this.emergencyContacts.removeAt(1);
    }
    
    while (this.dependents.length > 0) {
      this.dependents.removeAt(0);
    }
    
    // Restaurar valores padrão
    this.employeeForm.get('basicInfo.maritalStatus')?.setValue(EmployeeMaritalStatus.SOLTEIRO);
    this.employeeForm.get('professionalInfo.status')?.setValue(EmployeeContractStatus.ACTIVE);

  }
}
