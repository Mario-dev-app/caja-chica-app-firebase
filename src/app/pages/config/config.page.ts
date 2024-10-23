import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonText, IonInput, IonItem, IonCol, IonRow, IonGrid, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';
import { StorageService } from '../../../app/services/storage.service';
import { SimpleToolbarComponent } from '../../../app/components/simple-toolbar/simple-toolbar.component';
import { AlertService } from '../../../app/services/alert.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonItem, IonCol, IonText, IonInput, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SimpleToolbarComponent, ReactiveFormsModule]
})
export class ConfigPage implements OnInit {

  usuario: any;

  passwordVisible: boolean = false;

  confirmPasswordVisible: boolean = false;

  /* personalDataForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    apellidos: new FormControl('', [Validators.required, Validators.minLength(5)])
  }); */

  changePasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  private alertService = inject(AlertService);

  constructor() {
    addIcons({ eye, eyeOff });
  }

  private storageService = inject(StorageService);
  private usuarioService = inject(UsuarioService);

  async ngOnInit() {
    this.usuario = JSON.parse(await this.storageService.get('usuario'));
    /* this.personalDataForm.controls['nombre'].setValue(this.usuario.nombre);
    this.personalDataForm.controls['apellidos'].setValue(this.usuario.apellidos); */
  }

  /* updatePersonalData() { } */

  updatePassword() {
    if(!this.changePasswordForm.valid) {
      this.alertService.showSimpleToast('WARNING', 'Debe completar ambos campos.', 'warning');
      return;
    }
    
    const password = this.changePasswordForm.controls['password'].value;
    const confirmPassword = this.changePasswordForm.controls['confirmPassword'].value;
    
    if(password !== confirmPassword) {
      this.alertService.showSimpleToast('WARNING', 'Las contraseñas no coinciden.', 'warning');
      return;
    }

    this.alertService.showLoading('Cargando...');
    
    this.usuarioService.updateUserData(this.usuario._id, { password }).subscribe((resp: any) => {
      this.alertService.dismissLoading();
      this.alertService.showSimpleToast('SUCCESS', 'Contraseña actualizada', 'success');
      this.changePasswordForm.reset();
    }, (err) => {
      this.alertService.dismissLoading();
      this.alertService.showSimpleToast('ERROR', err.error.message, 'danger');
    });
  }

}
