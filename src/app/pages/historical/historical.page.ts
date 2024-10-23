import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonCol,
  IonRow,
  IonGrid, 
  IonButton, 
  IonIcon,
  IonCard,
  IonCardContent, IonChip, IonCardHeader, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { SimpleToolbarComponent } from '../../../app/components/simple-toolbar/simple-toolbar.component';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { MoneyRequestService } from '../../../app/services/money-request.service';
import { AlertService } from '../../../app/services/alert.service';
import { StorageService } from '../../../app/services/storage.service';

@Component({
  selector: 'app-historical',
  templateUrl: './historical.page.html',
  styleUrls: ['./historical.page.scss'],
  standalone: true,
  imports: [IonInfiniteScroll, IonCardHeader, IonChip, IonIcon, IonButton, 
    IonCol, 
    IonContent, 
    CommonModule, 
    FormsModule, 
    SimpleToolbarComponent,
    IonRow,
    IonGrid,
    IonCard,
    IonCardContent, 
    IonInfiniteScrollContent
  ]
})
export class HistoricalPage implements OnInit {

  items: number[] = [1,2,3,4,5];

  moneyRequests: any;

  page: number = 0;

  usuario: any;

  disableInfiniteScroll: boolean = false;

  private moneyRequestService = inject(MoneyRequestService);
  private alertService = inject(AlertService);
  private storageService = inject(StorageService);

  constructor() { }

  async ngOnInit() {
    this.usuario = JSON.parse(await this.storageService.get('usuario'));
    this.chargeFirstPageMoneyRequests();
  }

  chargeFirstPageMoneyRequests() {
    this.moneyRequestService.getMoneyRequestsByPage(this.page, this.usuario._id).subscribe(({count, money_requests}: any) => {
      if(!this.moneyRequests) {
        this.moneyRequests = money_requests;
      }else {
        this.moneyRequests.push(money_requests);
      }
    }, (err) => {
      this.alertService.showSimpleToast('ERROR', err.error.message, 'danger');
    });
  }
  
  onIonInfinite(event: InfiniteScrollCustomEvent){
    this.page++;
    this.moneyRequestService.getMoneyRequestsByPage(this.page, this.usuario._id).subscribe(({count, money_requests}: any) => {
      if(money_requests.length === 0) {
        this.disableInfiniteScroll = true;
      }else {
        money_requests.forEach((moneyReq: any) => {
          this.moneyRequests.push(moneyReq);
        });
      }
      event.target.complete();
    }, (err) => {
      this.alertService.showSimpleToast('ERROR', err.error.message, 'danger');
    });
  }

}
