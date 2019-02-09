import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http, Headers } from '@angular/http';
import { Stripe } from '@ionic-native/stripe/ngx';
import { stripeKey, stripeBackendEndPoint } from '../../../../config/config';

@IonicPage()
@Component({
  selector: 'page-stripe',
  templateUrl: 'stripe.html',
})
export class StripePage {
    email: any;
    name: any;
    total: any;


    cardinfo: any = {
        number: '',
        expMonth: '',
        expYear: '',
        cvc: ''
    }

    constructor(public navCtrl: NavController, public navParams: NavParams, private stripe: Stripe, private http: Http) {
        this.total = this.navParams.get('total');
        this.name = this.navParams.get('name');
        this.email = this.navParams.get('email');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StripePage');
  }

  pay() {
      this.stripe.setPublishableKey(stripeKey);
      this.stripe.createCardToken(this.cardinfo).then((token) => {
          console.log(token);
          var query = '?stripetoken=' + token.id + '&amount=' + this.total;
          var headers = new Headers();
          headers.append('Conent-Type', 'application/x-www-form-urlencoded');
          this.http.post(stripeBackendEndPoint + query, {}, { headers: headers }).subscribe((res) => {
              if (res.json().success) {
                  alert('Transação realizada com sucesso!');
                  //put your code here for when the transaction is successfull
              }
          });
      }).catch((err) => {

          alert(err);
      });
  }

   demo() {
        this.cardinfo.number = '4242424242424242'
        this.cardinfo.expMonth = '12';
        this.cardinfo.expYear = '21';
        this.cardinfo.cvc = '123';
    }
}
