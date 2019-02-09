import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage({ name: "RestaurantPopoverPage", segment: "restaurant-popover-page" })
@Component({
    template: `
    <ion-list>
      <button ion-item (click)="close(1)">Menu</button>
      <button ion-item (click)="close(2)">Promoções</button>
      <button ion-item (click)="close(3)">Info</button>
    </ion-list>
  `
})
export class RestaurantPopoverPage {
    constructor(public viewCtrl: ViewController) { }

    close(index) {
        this.viewCtrl.dismiss(index);
    }
}
