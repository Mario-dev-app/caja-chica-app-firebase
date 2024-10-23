import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonContent,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonButton,
  IonIcon,
  IonImg,
  IonLabel,
  IonLoading, IonChip, IonToolbar, IonHeader, IonModal, IonTitle, IonButtons } from '@ionic/angular/standalone';
import { SimpleToolbarComponent } from '../../../app/components/simple-toolbar/simple-toolbar.component';
import { ApprovalService } from '../../../app/services/approval.service';
import { StorageService } from '../../../app/services/storage.service';
import { AlertService } from '../../../app/services/alert.service';
import { addIcons } from 'ionicons';
import { trashBin, checkmarkCircle } from 'ionicons/icons';
import { MoneyRequestService } from '../../../app/services/money-request.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.page.html',
  styleUrls: ['./approvals.page.scss'],
  standalone: true,
  imports: [IonButtons, IonTitle, IonModal, IonHeader, IonToolbar, IonChip, 
    IonContent,
    CommonModule,
    FormsModule,
    SimpleToolbarComponent,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonButton,
    IonIcon,
    IonImg,
    IonLabel,
    IonLoading
  ]
})
export class ApprovalsPage implements OnInit {

  private approvalService = inject(ApprovalService);
  private storageService = inject(StorageService);
  private alertService = inject(AlertService);
  private moneyRequestService = inject(MoneyRequestService);

  pendingsMoneyRequest: any;

  isOFModalOpen: boolean = false;

  selectedMoneyReq: any;

  constructor(
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ trashBin, checkmarkCircle });
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getPendingsMoneyRequest();
  }

  async getPendingsMoneyRequest() {
    const usuario = JSON.parse(await this.storageService.get('usuario'));
    this.approvalService.getPendingMoneyRequests(usuario._id).subscribe(({ moneyRequests }: any) => {
      this.pendingsMoneyRequest = moneyRequests;
    }, (err) => {
      this.alertService.showSimpleToast('ERROR', err.error.message, 'danger');
    });
  }

  async action(tipo: string, money_request_id: string) {
    let alert;
    switch (tipo) {
      case 'reject':
        alert = await this.alertCtrl.create({
          subHeader: 'Indique la observación por la cuál está rechazando la solicitud',
          animated: true,
          translucent: true,
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              id: 'cancel-button'
            },
            {
              text: 'Aceptar',
              handler: (inputs) => {
                const observacion = inputs.obs;
                if (observacion.length === 0) {
                  this.alertService.showSimpleToast('ALERTA', 'No puede rechazar una solicitud sin una observación', 'warning');
                  return;
                }else {
                  this.showLoading('Rechazando..');
                  const body = { observacion, estado: 'RECHAZADO' };
                  this.moneyRequestService.updateMoneyRequest(body, money_request_id).subscribe((resp) => {
                    this.pendingsMoneyRequest = this.pendingsMoneyRequest.filter((item: any) => {
                      return item._id !== money_request_id;
                    });
                    this.cdr.detectChanges();
                    this.loadingCtrl.dismiss();
                    this.alertService.showSimpleToast('SUCCESS', 'Se rechazó la solicitud correctamente', 'success');
                  }, (err) => {
                    this.alertService.showSimpleToast('ERROR', err.error.message, 'danger');
                  });
                }
              },
              id: 'my-gradient-button'
            }
          ],
          inputs: [
            {
              type: 'textarea',
              name: 'obs',
              placeholder: 'Observación',
            }
          ],
        });

        await alert.present();
        break;
      case 'accept':
        alert = await this.alertCtrl.create({
          subHeader: '¿Está seguro de aprobar la solicitud?',
          animated: true,
          translucent: true,
          buttons: [
            {
              text: 'CANCELAR',
              role: 'cancel',
              id: 'cancel-button'
            },
            {
              text: 'SI',
              id: 'my-gradient-button',
              handler: () => {
                this.showLoading('Aprobando...');
                const body = { estado: 'APROBADO' };
                this.moneyRequestService.updateMoneyRequest(body, money_request_id).subscribe((resp) => {
                  this.pendingsMoneyRequest = this.pendingsMoneyRequest.filter((item: any) => {
                    return item._id !== money_request_id;
                  });
                  this.cdr.detectChanges();
                  this.loadingCtrl.dismiss();
                  this.alertService.showSimpleToast('SUCCESS', 'Solicitud aprobada correctamente', 'success');
                }, (err) => {
                  this.alertService.showSimpleToast('ERROR', err.error.message, 'danger');
                });
              }
            }
          ]
        });

        await alert.present();
        break;
      default:
        break;
    }
  }

  async showLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message,
    });

    loading.present();
  }

  setOpen(isOpen: boolean) {
    this.isOFModalOpen = isOpen;
  }

  viewOFdetail(id: string) {
    this.isOFModalOpen = true;
    this.selectedMoneyReq = this.pendingsMoneyRequest.find((moneyReq: any) => moneyReq._id === id);
  }

}
