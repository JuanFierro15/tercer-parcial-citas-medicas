import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonBadge,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonButtons,
  IonModal,
  IonInput,
  IonDatetime,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { Specialist } from '../models/specialist.model';
import { Appointment } from '../models/appointment.model';
import { SpecialistsService } from '../services/specialists.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonBadge,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonButtons,
    IonModal,
    IonInput,
    IonDatetime
  ]
})
export class HomePage implements OnInit {
  private readonly specialistsService = inject(SpecialistsService);
  private readonly toastCtrl = inject(ToastController);
  private readonly alertCtrl = inject(AlertController);

  specialists: Specialist[] = [];
  filteredSpecialists: Specialist[] = [];
  appointments: Appointment[] = [];
  cities: string[] = [];
  companies: string[] = [];
  selectedCity: string = '';
  selectedCompany: string = '';

  isModalOpen: boolean = false;
  selectedSpecialist: Specialist | null = null;
  patientName: string = '';
  appointmentDateTime: string = '';
  minDateTime: string = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  ngOnInit(): void {
    this.specialistsService.getSpecialists().subscribe({
      next: (specialists) => {
        this.specialists = specialists;
        this.cities = this.getDistinctValues(specialists.map(specialist => specialist.city));
        this.companies = this.getDistinctValues(specialists.map(specialist => specialist.company));
        this.applyFilters();
      },
      error: () => {
        this.showToast('No se pudieron cargar los especialistas', 'danger');
      }
    });
  }

  getDistinctValues(values: string[]): string[] {
    return values
      .filter((value, index) => values.indexOf(value) === index)
      .sort((a, b) => a.localeCompare(b, 'es'));
  }

  applyFilters(): void {
    this.filteredSpecialists = this.specialists
      .filter(specialist =>
        (!this.selectedCity || specialist.city === this.selectedCity) &&
        (!this.selectedCompany || specialist.company === this.selectedCompany)
      )
      .sort((a, b) => a.lastName.localeCompare(b.lastName, 'es'));
  }

  clearFilters(): void {
    this.selectedCity = '';
    this.selectedCompany = '';
    this.applyFilters();
  }

  countCities(): number {
    return this.filteredSpecialists.reduce(
      (cities: string[], specialist) => cities.includes(specialist.city) ? cities : [...cities, specialist.city],
      []
    ).length;
  }

  countAppointments(specialistId: number): number {
    return this.appointments.filter(appointment => appointment.specialistId === specialistId).length;
  }

  openModal(specialist: Specialist): void {
    this.selectedSpecialist = specialist;
    this.patientName = '';
    this.appointmentDateTime = '';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  async scheduleAppointment(): Promise<void> {
    if (!this.selectedSpecialist || !this.patientName.trim() || !this.appointmentDateTime) {
      await this.showToast('Ingresa el nombre del paciente y la fecha de la cita', 'danger');
      return;
    }

    if (this.patientName.trim().length < 3) {
      await this.showToast('El nombre del paciente debe tener al menos 3 letras', 'danger');
      return;
    }

    if (/\d/.test(this.patientName)) {
      await this.showToast('El nombre del paciente no puede tener números', 'danger');
      return;
    }

    const specialist = this.selectedSpecialist;
    const alert = await this.alertCtrl.create({
      header: 'Confirmar reserva',
      message: `
        <strong>Especialista:</strong> ${specialist.fullName}<br>
        <strong>Paciente:</strong> ${this.patientName.trim()}<br>
        <strong>Fecha:</strong> ${new Date(this.appointmentDateTime).toLocaleString('es-CO')}
      `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.confirmAppointment(specialist);
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmAppointment(specialist: Specialist): Promise<void> {
    this.appointments.push({
      id: this.appointments.length + 1,
      specialistId: specialist.id,
      specialistName: specialist.fullName,
      patientName: this.patientName.trim(),
      dateTime: this.appointmentDateTime
    });
    this.closeModal();
    await this.showToast(`Cita agendada con ${specialist.fullName}`, 'success');
  }

  async showToast(message: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
