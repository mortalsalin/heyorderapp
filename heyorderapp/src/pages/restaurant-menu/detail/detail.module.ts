import { NgModule } from '@angular/core';
import { RestaurantDetailPage } from './detail';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    RestaurantDetailPage,
  ],
  imports: [
      IonicPageModule.forChild(RestaurantDetailPage),
  ],
  exports: [
      RestaurantDetailPage
  ]
})
export class RestaurantDetailPageModule {}
