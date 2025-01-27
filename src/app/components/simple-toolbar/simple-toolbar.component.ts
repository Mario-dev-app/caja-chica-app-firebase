import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonIcon, IonTitle } from '@ionic/angular/standalone';
import { Component, Input, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  standalone: true,
  selector: 'app-simple-toolbar',
  templateUrl: './simple-toolbar.component.html',
  styleUrls: ['./simple-toolbar.component.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonIcon, IonTitle]
})
export class SimpleToolbarComponent  implements OnInit {

  @Input('title') title?: string;

  constructor() { 
    addIcons({ arrowBack });
  }

  ngOnInit() {}

}
