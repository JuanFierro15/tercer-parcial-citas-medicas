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
  ToastController
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
    IonButton
  ]
})
export class HomePage implements OnInit {
  private readonly specialistsService = inject(SpecialistsService);
  private readonly toastCtrl = inject(ToastController);

  specialists: Specialist[] = [];
  filteredSpecialists: Specialist[] = [];
  appointments: Appointment[] = [];
  cities: string[] = [];
  companies: string[] = [];
  selectedCity: string = '';
  selectedCompany: string = '';

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
