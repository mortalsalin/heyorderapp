import { IonicPage, NavController,LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../../providers/auth-data/auth-data';


@IonicPage()
@Component({
  selector: 'page-recover',
  templateUrl: 'recover.html'
})
export class RecoverPage {
  public resetPasswordForm;
  public backgroundImage: any = "./assets/bg3.jpg";

  constructor(public authData: AuthData, public fb: FormBuilder, public nav: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

      let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      this.resetPasswordForm = fb.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      });
  }

  resetPassword(){
    if (!this.resetPasswordForm.valid) {
      this.presentAlert("Form is invalid");
    } else {
      this.authData.resetPassword(this.resetPasswordForm.value.email)
      .then((user) => {
          this.presentAlert("Foi enviado um link em seu email para resetar a senha");
          this.nav.push('LoginPage');
      }, (error) => {
          var errorMessage: string = error.message;
          this.presentAlert(errorMessage);
      });
    }
  }

  presentAlert(title) {
    let alert = this.alertCtrl.create({
      title: title,
      buttons: ['OK']
    });
    alert.present();
  }
}
