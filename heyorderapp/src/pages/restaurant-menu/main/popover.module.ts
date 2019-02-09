import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantPopoverPage } from './popover';

@NgModule({
  declarations: [
      RestaurantPopoverPage,
    ],
  imports: [
      IonicPageModule.forChild(RestaurantPopoverPage)
  ],
  exports: [
      RestaurantPopoverPage,
  ]
})
export class RestaurantPopoverPageModule {}
