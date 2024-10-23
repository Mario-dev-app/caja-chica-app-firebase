import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonButtons,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  IonGrid,
  IonCol,
  IonRow,
  IonImg,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircle, cog, power } from 'ionicons/icons';
import { StorageService } from 'src/app/services/storage.service';
import { NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonIcon,
    IonButtons,
    IonPopover,
    IonList,
    IonItem,
    IonLabel,
    IonGrid,
    IonCol,
    IonRow,
    IonImg,
    IonText
  ]
})
export class HomePage implements OnInit {

  usuario: any;

  private storageService = inject(StorageService);

  constructor(
    private navCtrl: NavController
  ) {
    addIcons({ personCircle, cog, power });
  }

  ngOnInit() { }

  async ionViewWillEnter() {
    if (!this.usuario) {
      this.usuario = JSON.parse(await this.storageService.get('usuario'));
      /* console.log(this.usuario); */
    }
  }

  logout() {
    this.storageService.remove('usuario');
    this.navCtrl.navigateRoot('login');
  }

  requestMoney() {
    this.navCtrl.navigateForward('money-request');
  }

  historical() {
    this.navCtrl.navigateForward('historical');
  }

  approvals() {
    this.navCtrl.navigateForward('approvals');
  }

  navigateToConfig() {
    this.navCtrl.navigateForward('config');
  }
}
