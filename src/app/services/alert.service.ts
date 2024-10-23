import { AlertController, ToastController } from '@ionic/angular/standalone';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  async showSimpleToast(header: string, message: string, color: string) {
    let toast = await this.toastCtrl.create({
      header,
      message,
      /* buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ], */
      position: 'bottom',
      color,
      duration: 4000,
      cssClass: 'text-white',
      translucent: true,
      animated: true
    });

    await toast.present();
  }

  async showSimpleAlert(message: string, header: string) {
    let alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ],
    });

    await alert.present();
  }

  async showLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message,
    });

    loading.present();
  }

  dismissLoading() {
    this.loadingCtrl.dismiss();
  }

}
