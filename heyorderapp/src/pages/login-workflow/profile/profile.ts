import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, ToastController, NavParams } from 'ionic-angular';
import { AuthData } from '../../../providers/auth-data/auth-data';

import { AngularFireDatabase} from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class AfterLoginPage {
  isEditing: boolean;
  profile: any = {};
    uid:any;

    constructor(public navCtrl: NavController, public authData: AuthData, public alertCtrl: AlertController,
        public loadingCtrl: LoadingController, private toastCtrl: ToastController, public afAuth: AngularFireAuth,
        public afDb: AngularFireDatabase, public navParams: NavParams) {

  }
    ionViewWillLoad() {

      this.afAuth.authState.subscribe(userAuth => {

        if(userAuth) {
          this.uid = userAuth.uid;

          this.afDb.object('/userProfile/'+this.uid ).subscribe((profile) => {
            this.profile = profile;
          })

        } else {
          console.log('auth false');
          this.navCtrl.setRoot('LoginPage');
        }

      });
  }

  logout(){
        this.authData.logoutUser()
        .then( authData => {
          console.log("Logout realizado com sucesso");
          // toast message
          this.presentToast('bottom', 'Você saiu do sistema');
          this.navCtrl.setRoot('LoginPage');
        }, error => {
          var errorMessage: string = error.message;
          console.log(errorMessage);
          //this.presentAlert(errorMessage);
        });
  }

  presentAlert(title) {
    let alert = this.alertCtrl.create({
      title: title,
      buttons: ['OK']
    });
    alert.present();
  }

  presentToast(position: string,message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: 3000
    });
    toast.present();
  }

  saveProfileInfo() {
    this.afDb.database.ref().child('/userProfile/' + this.uid).set(this.profile).then((e) => {
      this.isEditing = false;
    });
  }

}
