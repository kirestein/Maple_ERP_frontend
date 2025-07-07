import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../app/shared/models/employee.model';

@Component({
  selector: 'app-cracha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cracha.component.html',
  styleUrls: ['./cracha.component.scss']
})
export class CrachaComponent {
  @Input() employee!: Employee;
  @Input() showPreview: boolean = false;
  
  templateUrl = 'https://maple-erp-backend.onrender.com/template-cracha';

  constructor() {}

  get employeeName(): string {
    if (this.employee?.tagName && this.employee?.tagLastName) {
      return `${this.employee.tagName} ${this.employee.tagLastName}`;
    }
    return this.employee?.fullName || 'Nome não informado';
  }

  get employeePosition(): string {
    return this.employee?.jobFunctions || this.employee?.jobPosition?.toString() || 'Cargo não informado';
  }

  get employeePhoto(): string {
    return this.employee?.employeePhoto as string || '/assets/images/default-avatar.png';
  }

  get employeeDepartment(): string {
    return this.employee?.department?.toString() || '';
  }

  downloadCracha(): void {
    // Implementar funcionalidade de download do crachá
    console.log('Download do crachá solicitado para:', this.employeeName);
  }

  printCracha(): void {
    // Implementar funcionalidade de impressão do crachá
    window.print();
  }
}

