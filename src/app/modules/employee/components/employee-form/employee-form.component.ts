import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../shared/models/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
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
      // Informações Básicas
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

      // Documentação
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

      // Contato e Endereço
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
      }),

      // Informações Profissionais
      professionalInfo: this.fb.group({
        position: [''],
        department: [''],
        admissionDate: [''],
        salary: [''],
        workload: [''],
        contractType: ['']
      }),

      // Contatos de Emergência
      emergencyContacts: this.fb.array([]),

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

