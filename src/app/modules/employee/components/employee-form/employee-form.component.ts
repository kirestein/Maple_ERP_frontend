import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../shared/models/employee.model';

@Component({
  selector: 'app-employee-form',

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
  employeeForm!: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;
  selectedPhotoUrl: string | ArrayBuffer | null = null;
  photoError: string | null = null;


  // Opções para os selects
  genderOptions = ['Masculino', 'Feminino', 'Outro'];
  maritalStatusOptions = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'];
  skinColorOptions = ['Branca', 'Preta', 'Parda', 'Amarela', 'Indígena'];
  graduationOptions = [
    'Ensino Fundamental Incompleto',
    'Ensino Fundamental Completo',
    'Ensino Médio Incompleto',
    'Ensino Médio Completo',
    'Ensino Superior Incompleto',
    'Ensino Superior Completo',
    'Pós-graduação',
    'Mestrado',
    'Doutorado'

  isLoading = false;
  isSubmitting = false;
  error: string | null = null;

  // Enums para os selects
//   genderOptions = Object.values(EmployeeGender);
//   maritalStatusOptions = Object.values(EmployeeMaritalStatus);
//   graduationOptions = Object.values(EmployeeGraduation);
//   skinColorOptions = Object.values(EmployeeSkinColor);
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
  driverLicenseCategoryOptions = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();

  }

  private initializeForm(): void {
    this.employeeForm = this.fb.group({
      basicInfo: this.fb.group({
        fullName: ['', [Validators.required]],
        tagName: ['', [Validators.required]],
        tagLastName: ['', [Validators.required]],
        email: ['', [Validators.email]],
        birthday: [''],
        gender: [''],
        maritalStatus: [''],
        skinColor: [''],

        naturalness: [''],
        nationality: [''],
        graduation: [''],
        fatherName: [''],
        motherName: ['']
      }),
      documents: this.fb.group({
        cpf: [''],
        rg: [''],
        rgEmitter: [''],
        rgEmissionDate: [''],
        pisPasep: [''],
        voterTitle: [''],
        voterZone: [''],
        voterSection: [''],
        voterEmission: [''],
        militaryCertificate: [''],
        ctps: [''],
        ctpsSerie: [''],
        driversLicense: [false],
        driversLicenseNumber: [''],
        driversLicenseCategory: [''],
        driversLicenseEmissionDate: [''],
        driversLicenseExpirationDate: ['']
      }),
      contactAddress: this.fb.group({
        phone: [''],
        mobile: [''],
        cep: [''],
        employeeAddress: [''],
        employeeAddressNumber: [''],
        employeeAddressComplement: [''],
        employeeNeighborhood: [''],
        employeeCity: [''],
        employeeState: [''],
        employeeCountry: ['Brasil']
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
        lifeInsurancePolicy: [''],
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
          if (employee.employeePhoto) {
            this.selectedPhotoUrl = employee.employeePhoto;
          }
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

      // Dependentes
      dependents: this.fb.array([])
    });
  }

  private checkEditMode(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployee(this.employeeId);
    }
  }

  private loadEmployee(id: string): void {
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        this.populateForm(employee);
      },
      error: (error) => {
        console.error('Erro ao carregar funcionário:', error);
        this.snackBar.open('Erro ao carregar dados do funcionário', 'OK', {
          duration: 3000
        });
      }
    });
  }

  private populateForm(employee: Employee): void {
    // Preencher informações básicas
    this.employeeForm.patchValue({
      basicInfo: {
        fullName: employee.fullName,
        tagName: employee.tagName,
        tagLastName: employee.tagLastName,
        email: employee.email,
        birthday: employee.birthday,
        gender: employee.gender,
        maritalStatus: employee.maritalStatus,
        skinColor: employee.skinColor,
        naturalness: employee.naturalness,
        nationality: employee.nationality,
        graduation: employee.graduation,
        fatherName: employee.fatherName,
        motherName: employee.motherName
      },
      documents: {
        cpf: employee.cpf,
        rg: employee.rg,
        rgEmitter: employee.rgEmitter,
        rgEmissionDate: employee.rgEmissionDate,
        pisPasep: employee.pisPasep,
        voterTitle: employee.voterTitle,
        voterZone: employee.voterZone,
        voterSection: employee.voterSection,
        voterEmission: employee.voterEmission,
        militaryCertificate: employee.militaryCertificate,
        ctps: employee.ctps,
        ctpsSerie: employee.ctpsSerie,
        driversLicense: employee.driversLicense,
        driversLicenseNumber: employee.driversLicenseNumber,
        driversLicenseCategory: employee.driversLicenseCategory,
        driversLicenseEmissionDate: employee.driversLicenseEmissionDate,
        driversLicenseExpirationDate: employee.driversLicenseExpirationDate
      },
      contactAddress: {
        phone: employee.phone,
        mobile: employee.mobile,
        cep: employee.cep,
        employeeAddress: employee.employeeAddress,
        employeeAddressNumber: employee.employeeAddressNumber,
        employeeAddressComplement: employee.employeeAddressComplement,
        employeeNeighborhood: employee.employeeNeighborhood,
        employeeCity: employee.employeeCity,
        employeeState: employee.employeeState,
        employeeCountry: employee.employeeCountry
      },
      professionalInfo: {
        position: employee.position,
        department: employee.department,
        admissionDate: employee.admissionDate,
        salary: employee.salary,
        workload: employee.workload,
        contractType: employee.contractType
      }
    });

    // Preencher foto se existir
    if (employee.photo) {
      this.selectedPhotoUrl = employee.photo;
    }
  }

  // Métodos para upload de foto
   onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
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

 

      
      // Validar tipo de arquivo
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        this.photoError = 'Apenas arquivos JPG e PNG são permitidos.';
        return;
      }
      
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.photoError = 'O arquivo deve ter no máximo 5MB.';
        return;
      }
      
      this.photoError = null;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedPhotoUrl = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.selectedPhotoUrl = null;
    this.photoError = null;
  }

// =======
//   removePhoto(): void {
//     this.selectedPhotoUrl = null;
//     this.photoError = null;
//     // Se houver campo de foto no form, limpe aqui
//     // this.employeeForm.get('basicInfo.employeePhoto')?.setValue(null);
//   }

//   // Buscar endereço pelo CEP (placeholder)
//   searchAddressByCep(cepField: string): void {
//     const cep = this.employeeForm?.get(cepField)?.value;
//     if (cep && cep.length === 8) {
//       // Implementar integração com API de CEP
//     }
//   }

//   // Enviar formulário
//   onSubmit(): void {
//     if (!this.employeeForm || this.employeeForm.invalid) {
//       this.markFormGroupTouched(this.employeeForm);
//       this.snackBar.open(
//         'Por favor, corrija os erros no formulário antes de enviar.',
//         'OK',
//         { duration: 3000 }
//       );
//       return;
//     }
//     const employeeData = this.prepareEmployeeData();
//     const formData = new FormData();
//     formData.append('employee', JSON.stringify(employeeData));
//     // Adicionar foto se necessário
//     // if (this.selectedPhotoUrl && typeof this.selectedPhotoUrl !== 'string') { ... }
//     if (this.isEditMode && this.employeeId) {
//       // this.employeeService.updateEmployee(this.employeeId, formData)...
//       this.snackBar.open('Funcionalidade de edição em desenvolvimento', 'OK', {
//         duration: 3000,
//       });
//     } else {
//       this.employeeService.createEmployee(formData).subscribe({
//         next: () => {
//           this.snackBar.open('Funcionário cadastrado com sucesso!', 'OK', {
//             duration: 3000,
//           });
//           this.router.navigate(['/employees']);
//         },
//         error: () => {
//           this.snackBar.open(
//             'Erro ao cadastrar funcionário. Verifique a conexão com o servidor.',
//             'OK',
//             { duration: 3000 }
//           );
//         },
//       });
//     }
//   }

//   // Cancelar formulário e voltar à lista
//   cancel(): void {
//     this.router.navigate(['/employees']);
//   }

//   // Preparar dados do funcionário para envio
//   prepareEmployeeData(): Employee {
//     const formValue = this.employeeForm?.value || {};
//     const employee: Employee = {
//       ...(formValue.basicInfo || {}),
//       ...(formValue.documents || {}),
//       ...(formValue.contactAddress || {}),
//       ...(formValue.professionalInfo || {}),
//       ...(formValue.financialInfo || {}),
//       ...(formValue.benefits || {}),
//       ...(formValue.collegeInfo || {}),
//       partnerName: formValue.familyInfo?.partnerName || '',
//       partnerCpf: formValue.familyInfo?.partnerCpf || '',
//       partnerBirthday: formValue.familyInfo?.partnerBirthday || null,
//       partnerRg: formValue.familyInfo?.partnerRg || '',
//       employeeContact: formValue.emergencyContacts || [],
//       employeeDependent: formValue.familyInfo?.dependents || [],
//     };
//     return employee;
//   }

//   // Marcar todos os campos como touched para mostrar validações
//   markFormGroupTouched(formGroup: FormGroup): void {
//     if (!formGroup || !formGroup.controls) return;
//     Object.values(formGroup.controls).forEach((control) => {
//       control.markAsTouched();
//       if (control instanceof FormGroup) {
//         this.markFormGroupTouched(control);
//       } else if (control instanceof FormArray) {
//         control.controls.forEach((arrayControl) => {
//           if (arrayControl instanceof FormGroup) {
//             this.markFormGroupTouched(arrayControl);
//           }
//         });
//       }
//     });
//   }

//   // Resetar formulário
//   resetForm(): void {
//     this.employeeForm?.reset();
//     this.selectedPhotoUrl = null;
//     while (this.emergencyContacts.length > 1) {
//       this.emergencyContacts.removeAt(1);
//     }
//     while (this.dependents.length > 0) {
//       this.dependents.removeAt(0);
//     }
//     this.employeeForm
//       ?.get('basicInfo.maritalStatus')
//       ?.setValue(EmployeeMaritalStatus.SOLTEIRO);
//     this.employeeForm
//       ?.get('professionalInfo.status')
//       ?.setValue(EmployeeContractStatus.ACTIVE);
//   }

//   // Métodos auxiliares para validação e mensagens de erro
//   hasFieldError(fieldPath: string, errorType?: string): boolean {
//     const field = this.employeeForm?.get(fieldPath);
//     if (!field) return false;
//     if (errorType) {
//       return field.hasError(errorType) && (field.dirty || field.touched);
//     }
//     return field.invalid && (field.dirty || field.touched);
//   }

//   getFieldError(fieldPath: string): string {
//     const field = this.employeeForm?.get(fieldPath);
//     if (!field || !field.errors) return '';
//     const errors = field.errors;
//     if (errors['required']) return 'Campo obrigatório';
//     if (errors['email']) return 'Email inválido';
//     if (errors['minlength'])
//       return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
//     if (errors['maxlength'])
//       return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
//     if (errors['invalidCpf']) return 'CPF inválido';
//     if (errors['invalidPhone']) return 'Telefone inválido';
//     return 'Campo inválido';
//   }

// >>>>>>> main
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
    return remainder === parseInt(cpf.charAt(10));
  }

  // Máscara dinâmica para telefone
  getPhoneMask(fieldName: string): string {
    const control = this.employeeForm.get(`contactAddress.${fieldName}`);
    if (control && control.value) {
      const digits = control.value.replace(/\D/g, '');
      if (digits.length <= 10) {
        return '(00) 0000-0000';
      }
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

  // Buscar endereço por CEP
  searchAddressByCep(cepFieldPath: string): void {
    const cepControl = this.employeeForm.get(cepFieldPath);
    if (cepControl && cepControl.value) {
      const cep = cepControl.value.replace(/\D/g, '');
      if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then(response => response.json())
          .then(data => {
            if (!data.erro) {
              const addressGroup = this.employeeForm.get('contactAddress');
              if (addressGroup) {
                addressGroup.patchValue({
                  employeeAddress: data.logradouro,
                  employeeNeighborhood: data.bairro,
                  employeeCity: data.localidade,
                  employeeState: data.uf
                });
              }
            }
          })
          .catch(error => {
            console.error('Erro ao buscar CEP:', error);
          });
      }
    }
  }

  // Métodos para arrays dinâmicos
  get emergencyContacts(): FormArray {
    return this.employeeForm.get('emergencyContacts') as FormArray;
  }

  get dependents(): FormArray {
    return this.employeeForm.get('dependents') as FormArray;
  }

  addEmergencyContact(): void {
    const contactGroup = this.fb.group({
      name: ['', Validators.required],
      relationship: ['', Validators.required],
      phone: ['', Validators.required],
      mobile: ['']
    });
    this.emergencyContacts.push(contactGroup);
  }

  removeEmergencyContact(index: number): void {
    this.emergencyContacts.removeAt(index);
  }

  addDependent(): void {
    const dependentGroup = this.fb.group({
      name: ['', Validators.required],
      relationship: ['', Validators.required],
      birthday: [''],
      cpf: ['']
    });
    this.dependents.push(dependentGroup);
  }

  removeDependent(index: number): void {
    this.dependents.removeAt(index);
  }

  // Marcar todos os campos como tocados
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  // Preparar dados do funcionário
  private prepareEmployeeData(): FormData {
    const formData = new FormData();
    const formValue = this.employeeForm.value;

    // Flatten the nested form structure
    const flattenedData = {
      ...formValue.basicInfo,
      ...formValue.documents,
      ...formValue.contactAddress,
      ...formValue.professionalInfo,
      emergencyContacts: formValue.emergencyContacts,
      dependents: formValue.dependents
    };

    // Append all fields to FormData
    Object.keys(flattenedData).forEach(key => {
      if (flattenedData[key] !== null && flattenedData[key] !== undefined) {
        if (Array.isArray(flattenedData[key])) {
          formData.append(key, JSON.stringify(flattenedData[key]));
        } else {
          formData.append(key, flattenedData[key]);
        }
      }
    });

    return formData;
  }

  // Submit do formulário
  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData = this.prepareEmployeeData();

      if (this.isEditMode && this.employeeId) {
        this.employeeService.updateEmployee(this.employeeId, employeeData).subscribe({
          next: () => {
            this.snackBar.open('Funcionário atualizado com sucesso!', 'OK', {
              duration: 3000
            });
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            console.error('Erro ao atualizar funcionário:', error);
            this.snackBar.open('Erro ao atualizar funcionário', 'OK', {
              duration: 3000
            });
          }
        });
      } else {
        this.employeeService.createEmployee(employeeData).subscribe({
          next: () => {
            this.snackBar.open('Funcionário cadastrado com sucesso!', 'OK', {
              duration: 3000
            });
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            console.error('Erro ao cadastrar funcionário:', error);
            this.snackBar.open('Erro ao cadastrar funcionário', 'OK', {
              duration: 3000
            });
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.employeeForm);
      this.snackBar.open('Por favor, corrija os erros no formulário antes de enviar.', 'OK', {
        duration: 3000
      });
    }
  }

  // Cancelar e voltar
  cancel(): void {
    this.router.navigate(['/employees']);
  }
}

// =======
//   // Submit com foco no primeiro campo inválido
//   onSubmitWithFocus(): void {
//     if (this.employeeForm.invalid) {
//       this.markFormGroupTouched(this.employeeForm);
//       this.focusFirstInvalidField();
//       this.snackBar.open(
//         'Por favor, corrija os erros no formulário antes de enviar.',
//         'OK',
//         { duration: 3000 }
//       );
//       return;
//     }
//     this.onSubmit();
//   }
// }
// >>>>>>> main
