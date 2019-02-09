import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database-deprecated";
import { DatabaseProvider } from "../../../providers/database/database";

/**
 * Generated class for the CheckoutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
    cartItems: any;
    total: any;
    address: any;
    profileArray: any;
    profilePicture: any;
    profile: any;
    phone: any;
    name: any;
    email: any;
    uid: any;
    checkoutForm: FormGroup;
    showPaymentMethod: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder, public afAuth: AngularFireAuth, public afDb: AngularFireDatabase,
        public loadingCtrl: LoadingController, public alertCtrl: AlertController, public db: DatabaseProvider, private toastCtrl: ToastController) {
        this.checkoutForm = fb.group({
            'fullname': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
            'address': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(500)])],
            'email': [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(500)])],
            'phone': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(500)])],
        });

        this.total = this.navParams.get('total');
        this.cartItems = this.navParams.get('items');
  }

    ionViewWillLoad() {
        this.afAuth.authState.subscribe(userAuth => {
            if (userAuth) {

                this.db.getDocuments('checkoutProfile', ['uid', '==', userAuth.uid]).then((x) => {
                    if (!!x) {
                        let item = x[0];
                        this.uid = item.uid;
                        this.email = item.email;
                        this.name = item.fullname;
                        this.phone = item.phone;
                        this.address = item.address;

                        this.showPaymentMethod = true;
                    } else {
                        this.showPaymentMethod = false;
                    }
                });


            } else {

                this.showLoginChoise();
            }

        });
    }

    saveCheckoutProfile(val) {

        let obj = {
            fullname: val.fullname,
            address: val.address,
            email: val.email,
            phone: val.phone,
            uid: this.uid
        }
        this.db.getDocuments('checkoutProfile', ['uid', '==', this.uid]).then((x) => {
            if (!!x) {
                let item = x[0];
                this.db.updateDocument('checkoutProfile', item.$key, obj).then((x) => {
                    this.showPaymentMethod = true;
                    this.presentToast('Perfil salvo');
                });
            } else {
                this.db.addDocument('checkoutProfile', obj).then((x) => {
                    this.showPaymentMethod = true
                    this.presentToast('Perfil salvo');
                });
            }
        });
    }

    presentToast(text) {
        const toast = this.toastCtrl.create({
            message: text,
            position: 'bottom',
            duration: 3000
        });
        toast.present();
    }

    getDataFromLoggedUser() {
        this.afAuth.authState.subscribe(userAuth => {

            if (userAuth) {

                this.profile = this.afDb.object('/userProfile/' + userAuth.uid);
                this.profile.subscribe((profile) => {
                    let p = (<any>profile);
                    this.uid = userAuth.uid;
                    this.email = userAuth.email;
                    this.name = p.name;
                    this.phone = p.phone;
                    this.profilePicture = p.pic;
                    this.profileArray = profile;
                });
            }
        });
    }

    showLoginChoise() {
        let prompt = this.alertCtrl.create({
            title: 'Login',
            message: "Você precisa estar logado para visualizar os itens do pedido",

            buttons: [
                {
                    text: 'Login',
                    handler: data => {
                        this.navCtrl.push('LoginPage');
                    }
                }
            ]
        });
        prompt.present();
    }

    selectPaymentMethod() {
        this.navCtrl.push('PaymentPage', { total: this.total, items: this.cartItems });
    }

 }
