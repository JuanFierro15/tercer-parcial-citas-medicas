import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonBadge,
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
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonBadge
  ]
})
export class HomePage implements OnInit {
  private readonly specialistsService = inject(SpecialistsService);
  private readonly toastCtrl = inject(ToastController);

  specialists: Specialist[] = [];
  filteredSpecialists: Specialist[] = [];
  appointments: Appointment[] = [];

  ngOnInit(): void {
    this.specialistsService.getSpecialists().subscribe({
      next: (specialists) => {
        this.specialists = specialists;
        this.filteredSpecialists = [...specialists];
      },
      error: () => {
        this.showToast('No se pudieron cargar los especialistas', 'danger');
      }
    });
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
