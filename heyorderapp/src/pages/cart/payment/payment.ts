import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { DatabaseProvider } from "../../../providers/database/database";
import { payPalEnvironmentSandbox } from "../../../config/config";
/**
 * Generated class for the PaymentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
    cartItems: any;
    total: any;
    name: string = "";
    email: string = "";


    constructor(public navCtrl: NavController, public navParams: NavParams, private payPal: PayPal, public alertCtrl: AlertController, public db: DatabaseProvider, private toastCtrl: ToastController) {

        this.total = this.navParams.get('total');
        this.cartItems = this.navParams.get('items');
  }

    payWtihPaypal() {
        this.payPal.init({
            PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
            PayPalEnvironmentSandbox: payPalEnvironmentSandbox//YOUR_SANDBOX_CLIENT_ID
        }).then(() => {
            // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
            this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
                // Only needed if you get an "Internal Service Error" after PayPal login!
                //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
            })).then(() => {
                let payment = new PayPalPayment(this.total, 'USD', 'Description', 'sale');
                this.payPal.renderSinglePaymentUI(payment).then(() => {
                    // Successfully paid

                    // Example sandbox response
                    //
                    // {
                    //   "client": {
                    //     "environment": "sandbox",
                    //     "product_name": "PayPal iOS SDK",
                    //     "paypal_sdk_version": "2.16.0",
                    //     "platform": "iOS"
                    //   },
                    //   "response_type": "payment",
                    //   "response": {
                    //     "id": "PAY-1AB23456CD789012EF34GHIJ",
                    //     "state": "approved",
                    //     "create_time": "2016-10-03T13:33:33Z",
                    //     "intent": "sale"
                    //   }
                    // }
                }, () => {
                    // Error or render dialog closed without being successful
                    this.precentAlert('Alert', 'Error or render dialog closed without being successful')
                });
            }, () => {
                // Error in configuration
                this.precentAlert('Alert', 'Erro na configuração do paypal.');
            });
        }, () => {
            // Error in initialization, maybe PayPal isn't supported or something else
            this.precentAlert('Alert', 'Erro na inicialização, PayPal não é suportado no browser \'t por favor utilize o app');
        });
    }

    precentAlert(title, text) {
        let prompt = this.alertCtrl.create({
            title: title,
            message: text,

            buttons: [
                {
                    text: 'Ok',
                    handler: data => {

                    }
                }
            ]
        });
        prompt.present();
    }

    payCash() {
        this.markItemsAsBought();
    }

    markItemsAsBought() {

        let total = this.cartItems.length-1;

        this.cartItems.forEach((e, i) => {
            e.bought = true;
            e.boughtDate = this.getDate();
            this.db.updateDocument('cart', e.$key, e).then((c) => {
                if (i == total) {
                    const toast = this.toastCtrl.create({
                        message: 'Pedido realizado com sucesso.',
                        position: 'bottom',
                        duration: 3000
                    });
                    toast.present();
                    this.navCtrl.push('CartPage', {goToHistory: true});

                }
            });
        });
    }

    getDate() {
        var currentDate = new Date()
        var day = currentDate.getDate()
        var month = currentDate.getMonth() + 1
        var year = currentDate.getFullYear()
        return month + "/" + day + "/" + year;
    }

    payWtihStripe() {
        this.navCtrl.push('StripePage', {total: this.total, email: this.email, name: this.name });
    }
}
