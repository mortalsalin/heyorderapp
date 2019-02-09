import { NgModule } from '@angular/core';
import { RestaurantCategoryPage } from './main';
import { IonicPageModule } from 'ionic-angular';
import { CallNumber } from "@ionic-native/call-number";

@NgModule({
  declarations: [
      RestaurantCategoryPage,
  ],
  imports: [
      IonicPageModule.forChild(RestaurantCategoryPage),
  ],
  exports: [
      RestaurantCategoryPage
  ],
  providers: [
    CallNumber
  ]
})
export class RestaurantCategoryPageModule {}
