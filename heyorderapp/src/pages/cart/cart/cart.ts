import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { DatabaseProvider } from "../../../providers/database/database";
import { AngularFireAuth } from "angularfire2/auth";

/**
 * Generated class for the CartPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
    })

export class CartPage {
    alertOptions: any;
  total: number;
  aditions: number = 0;
    view: string = 'cart';

    uid: any= null;
    cartItems: Array<CartItem>;
    historyItems: Array<CartItem>;
    constructor(private navCtrl: NavController, private navParams: NavParams, private loadingCtrl: LoadingController, private db: DatabaseProvider, private afAuth: AngularFireAuth,
        public alertCtrl: AlertController) {
        if (this.navParams.get('goToHistory') == true) {
            this.switchView('history');
        }

    }
  ionViewDidEnter() {
    this.loadData();
  }

    switchView(view) {
        this.view = view;
    }

    qtyChanged(item) {

        this.db.updateDocument('cart', item.$key, item).then((e) => {
            console.log(item.qty);
            this.loadData();
        })

    }
  refresh(refresher) {
    this.loadData();
    refresher.complete();
  }

    loadData() {

        let that = this;
        this.afAuth.authState.subscribe(userAuth => {
            if (!userAuth) {
                this.showLoginChoise();
                return;
            }

            this.uid = !!userAuth ? userAuth.uid : null;
            this.db.getDocuments('cart', ['uid', '==', this.uid])
                .then(function (e) {
                  if (!!e) {
                    e = e.filter((x) => {
                      return x.type == 'restaurant';
                    });

                        let cart = e.filter((x) => {
                            return !x.bought
                        });

                        let history = e.filter((x) => {
                            return x.bought
                        });

                        that.cartItems = cart;
                        that.historyItems = history;

                        //calculate total
                        that.total = 0;
                        cart.forEach((x) => {
                          let finalPice = (x.discount ? x.discoutPrice : x.price)*1;

                          if (x.selectedOptions && x.selectedOptions.length > 0) {
                            let extraTotal = 0;
                            x.selectedOptions.forEach((k) => {
                              extraTotal += k.price*1;
                            });
                            finalPice += extraTotal*1;
                            x.aditions = extraTotal*1;
                          }

                          that.total += (finalPice * Number.parseInt(x.qty))*1;

                        })
                    } else {
                        that.total = 0;
                        that.cartItems = null;
                    }
                });
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
                  this.navCtrl.parent.select(3);
                    }
                }
            ]
        });
        prompt.present();
    }

    deleteConfirm(key) {
        let prompt = this.alertCtrl.create({
            title: 'Delete',
            message: "Confirma a exclusão desse item?",

            buttons: [
                {
                    text: 'Yes',
                    handler: data => {
                        this.deleteItem(key);
                        this.loadData();
                    }
                },
                {
                    text: 'No',
                    handler: data => {

                    }
                }
            ]
        });
        prompt.present();
    }


    deleteItem(key) {
        this.db.deleteDocument('cart', key).then((e) => {

            this.loadData();
        });
  }


  checkout() {
      this.navCtrl.push('CheckoutPage', { total: this.total, items: this.cartItems});
  }

  goToItemDescription(item) {
          this.navCtrl.push('RestaurantDetailPage', { itemId: item.categoryKey, subDoc: item.itemKey, item: item });
  }

}





interface CartItem {
    type: string;
    categoryKey: string;
    itemKey: string;
    img: string;
    price: number;
    name: string;
    uid: string;
    qty: number;
  $key: string;
  selectedOptions: string,
  selectedSize: string
}
