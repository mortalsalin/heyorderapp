import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StripePage } from './stripe';

@NgModule({
  declarations: [
    StripePage,
  ],
  imports: [
      IonicPageModule.forChild(StripePage),
  ],
  exports: [
    StripePage
  ]
})
export class StripePageModule {}
