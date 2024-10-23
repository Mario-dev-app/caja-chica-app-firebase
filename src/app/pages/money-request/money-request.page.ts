import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonItem,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonProgressBar,
  IonCheckbox,
  IonCard,
  IonIcon,
  IonLabel, 
  IonList,
  IonItemGroup
 } from '@ionic/angular/standalone';
import { SimpleToolbarComponent } from '../../../app/components/simple-toolbar/simple-toolbar.component';
import { MoneyRequestService } from '../../../app/services/money-request.service';
import { AlertService } from '../../../app/services/alert.service';
import { StorageService } from '../../../app/services/storage.service';
import { LoadingController } from '@ionic/angular';
import { addOutline, removeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { UsuarioService } from '../../../app/services/usuario.service';
import { UtilsService } from '../../../app/services/utils.service';

@Component({
  selector: 'app-money-request',
  templateUrl: './money-request.page.html',
  styleUrls: ['./money-request.page.scss'],
  standalone: true,
  imports: [IonList, 
    SimpleToolbarComponent,
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonItem,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonProgressBar,
    IonCheckbox,
    IonCard,
    IonIcon,
    IonLabel,
    IonItemGroup
  ]
})
export class MoneyRequestPage implements OnInit {

  usuario: any;

  areas: any;

  usuariosAdmin: any;

  concepts: any;

  private moneyRequestService = inject(MoneyRequestService);
  private alertService = inject(AlertService);
  private storageService = inject(StorageService);
  private usuarioService = inject(UsuarioService);
  private utilsService = inject(UtilsService);

  total: number = 0;

  moneyRequestForm = new FormGroup({
    /* factura: new FormControl(true),
    notaDePago: new FormControl(false), */
    area: new FormControl('', [Validators.required]),
    caja: new FormControl('', [Validators.required]),
    dynamicMontoConcepto: new FormArray([
      new FormGroup(
        {
          monto: new FormControl('', [Validators.required, Validators.min(10)]),
          concepto: new FormControl('', [Validators.required])
        }
      )
    ]),
    /* monto: new FormControl('', [Validators.required, Validators.min(10)]),
    concepto: new FormControl('', [Validators.required]), */
    descripcion: new FormControl('', [Validators.required, Validators.minLength(10)]),
    cargadoOF: new FormControl(false),
    numeroOF: new FormControl('', [Validators.minLength(9)])
  });

  dataOF: any;

  isOFvalid: boolean = false;

  constructor(
    private loadingCtrl: LoadingController
  ) {
    addIcons({ addOutline, removeOutline });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getAreas();
    this.getConcepts();
    this.getAllActiveAdminUsers();
  }

  getAreas() {
    this.moneyRequestService.getAreas().subscribe(({ areas }: any) => {
      this.areas = areas;
    }, (err) => {
      this.alertService.showSimpleToast('ERROR', err.error.message, 'danger');
    });
  }
  
  getAllActiveAdminUsers() {
    this.usuarioService.getAllActiveAdminUsers().subscribe(({ usuarios }: any) => {
      this.usuariosAdmin = usuarios;
    }, (err) => {
      this.alertService.showSimpleToast('ERROR', err.error.message, 'danger');
    });
  }

  getConcepts() {
    this.moneyRequestService.getConcepts().subscribe(({ concepts }: any) => {
      this.concepts = concepts;
    }, (err) => {
      this.alertService.showSimpleToast('ERROR', err.error.message, 'danger');
    });
  }

  async register() {
    if (!this.moneyRequestForm.valid) {
      this.alertService.showSimpleToast('ALERTA', 'Rellene correctamente todos los campos del formulario', 'warning');
      return;
    }

    /* if(this.moneyRequestForm.controls['notaDePago'].value) {
      if(this.total > 60) {
        this.alertService.showSimpleToast('ALERTA', 'Su solicitud excede el monto máximo de S/. 60.00 para una nota de pago', 'warning');
        return;
      }
    } */

    this.showLoading('Cargando...');

    this.usuario = JSON.parse(await this.storageService.get('usuario'));

    /* const factura = this.moneyRequestForm.controls['factura'].value; */
    /* const notaDePago = this.moneyRequestForm.controls['notaDePago'].value; */
    const descripcion = this.moneyRequestForm.controls['descripcion'].value;
    const area_id = this.moneyRequestForm.controls['area'].value;
    const caja = this.moneyRequestForm.controls['caja'].value;
    const details: any = [];
    this.dynamicMontoConcepto.controls.forEach((group) => {
      const detail = {
        monto: group.get('monto')!.value,
        concepto: group.get('concepto')!.value
      };
      details.push(detail);
    });

    const cargadoOF = this.moneyRequestForm.controls['cargadoOF'].value;

    /* console.log(details); */

    let body: any = { 
      descripcion, 
      details,
      monto_total: this.total,
      /* tipo_doc: (factura) ? 'FACTURA' : 'NOTA DE PAGO', */
      area_id, 
      caja,
      user_id: this.usuario._id
     };

     /* if(cargadoOF) {
      if(!this.isOFvalid) {
        this.loadingCtrl.dismiss();
        this.alertService.showSimpleToast('ERROR', 'OF ingresada no es válida', 'danger');
        return;
      }

      body = {
        ...body,
        OF_card_name: this.dataOF.CardName,
        OF_create_date: this.dataOF.CreateDate,
        OF_doc_num: this.dataOF.DocNum,
        OF_item_code: this.dataOF.ItemCode,
        OF_prod_name: this.dataOF.ProdName,
        OF_sucursal: this.dataOF.U_EXM_SUCURSAL
      }
     } */


    this.moneyRequestService.registerMoneyRequest(body).subscribe((resp: any) => {
      this.moneyRequestForm.reset();
      this.total = 0;
      this.loadingCtrl.dismiss();
      this.alertService.showSimpleToast('SUCCESS', resp.message, 'success');
    }, (err) => {
      this.loadingCtrl.dismiss();
      console.log(err);
      this.alertService.showSimpleToast('ERROR', err.error.message, 'danger');
    });

  }

  async showLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message,
    });

    loading.present();
  }

  /* onCheckButtonChange(tipoDoc: string) {
    if (tipoDoc === 'factura') {
      this.moneyRequestForm.controls['factura'].setValue(true);
      this.moneyRequestForm.controls['notaDePago'].setValue(false);
    } else {
      this.moneyRequestForm.controls['notaDePago'].setValue(true);
      this.moneyRequestForm.controls['factura'].setValue(false);
    }
  } */

  get dynamicMontoConcepto() {
    return this.moneyRequestForm.controls['dynamicMontoConcepto'] as FormArray;
  }

  addLineaMontoConcepto() {
    const lineaMontoConcepto = new FormGroup({
      monto: new FormControl('', [Validators.required, Validators.min(10)]),
      concepto: new FormControl('', [Validators.required]),
    });
    this.dynamicMontoConcepto.push(lineaMontoConcepto);
  }

  removeLineaMontoConcepto() {
    this.dynamicMontoConcepto.removeAt(this.dynamicMontoConcepto.length - 1);
  }

  onMontoInputChange(event: any) {
    this.total = 0;
    this.dynamicMontoConcepto.controls.forEach((group: any) => {
      this.total += group.get('monto').value;
    });
    /* if(event.detail && event.detail.value.length > 0){
      this.total += Number(event.detail.value);
    } */
  }

  onOFInputChange(event: any) {
    if(event.detail && event.detail.value.length === 9) {
      this.utilsService.valideOF(event.detail.value).subscribe(({of}: any) => {
        this.alertService.showSimpleAlert('OF válida', 'INFO');
        console.log(of[0]);
        this.dataOF = of[0];
        this.isOFvalid = true;
      }, (err) => {
        this.isOFvalid = false;
        this.alertService.showSimpleToast('ERROR', err.error.message, 'danger');
      });
    }else {
      this.isOFvalid = false;
      this.alertService.showSimpleToast('WARNING', 'El formato de OF no es el correcto', 'warning');
    }
  }

}
