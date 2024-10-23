import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonItem, IonInput, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, eye } from 'ionicons/icons';
import { NavController } from '@ionic/angular/standalone';

/* SERVICES */
import { OnesignalService } from '../../../app/services/onesignal.service';
import { LoginService } from '../../../app/services/login.service';
import { StorageService } from '../../../app/services/storage.service';
import { AlertService } from '../../../app/services/alert.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonImg,
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    ReactiveFormsModule
  ]
})
export class LoginPage implements OnInit {

  passwordVisible: boolean = false;

  private onesignal = inject(OnesignalService);
  private loginService = inject(LoginService);
  private storageService = inject(StorageService);
  private alertService = inject(AlertService);

  onesigal_id?: string | null;

  loginForm = new FormGroup({
    usuario: new FormControl('mperalta', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('123456', [Validators.required, Validators.minLength(4)])
  });

  constructor(
    private navCtrl: NavController
  ) {
    addIcons({ person, eye });
  }

  async ngOnInit() {
    await this.onesignal.OneSignalIOSPermission();
  }

  async ingresar() {
    if (!this.loginForm.valid) {
      this.alertService.showSimpleAlert('Complete los datos del formulario correctamente', 'INFO');
      return;
    }

    if(Capacitor.getPlatform() !== 'web') {
      this.onesigal_id = await this.onesignal.getOneSignalId();
    }
    const usuario = this.loginForm.controls['usuario'].value!.trim().toLocaleLowerCase();
    const password = this.loginForm.controls['password'].value!.trim();

    this.loginService.login(usuario, password, this.onesigal_id).subscribe(async (resp: any) => {
      await this.storageService.set('usuario', JSON.stringify(resp.usuario));
      this.navCtrl.navigateRoot('home');
    }, (err) => {
      this.alertService.showSimpleAlert(err.error.message, 'Error');
    });
  }

}
