import { NgModule } from '@angular/core';
import { RestaurantListPage } from './list';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
      RestaurantListPage,
  ],
  imports: [
      IonicPageModule.forChild(RestaurantListPage),
  ],
  exports: [
      RestaurantListPage
  ]
})
export class RestaurantListPageModule {}
