import { NgModule } from '@angular/core';
import { RecoverPage } from './recover';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
      RecoverPage,
  ],
  imports: [
      IonicPageModule.forChild(RecoverPage),
  ],
  exports: [
      RecoverPage
  ]
})
export class RecoverPagePageModule {}
