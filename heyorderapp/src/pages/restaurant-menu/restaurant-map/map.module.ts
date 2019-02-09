import { NgModule } from '@angular/core';
import { RestaurantMapPage } from './map';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
      RestaurantMapPage,
  ],
  imports: [
      IonicPageModule.forChild(RestaurantMapPage),
  ],
  exports: [
      RestaurantMapPage
  ]
})
export class RestaurantMapPageModule {}
