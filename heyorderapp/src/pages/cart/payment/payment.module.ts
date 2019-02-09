import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentPage } from './payment';
import { PayPal } from '@ionic-native/paypal';

@NgModule({
  declarations: [
    PaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentPage),
  ],
  exports: [
    PaymentPage
  ],
  providers: [
    PayPal
  ]
})
export class PaymentPageModule {}
