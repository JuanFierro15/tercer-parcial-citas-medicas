import { Injectable, inject } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private readonly toastCtrl = inject(ToastController);
  private readonly alertCtrl = inject(AlertController);


  async showToast(
    message: string,
    color: 'success' | 'danger' | 'warning' | 'primary' = 'primary',
    duration: number = 2500
  ): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color,
      position: 'bottom',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  async showAlert(
    header: string,
    subHeader: string,
    message: string,
    confirmButtonText: string = 'Aceptar'
  ): Promise<void> {
    const alert = await this.alertCtrl.create({
      header,
      subHeader,
      message,
      buttons: [
        {
          text: confirmButtonText,
          role: 'confirm'
        }
      ]
    });
    await alert.present();
  }
}
