import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, PopoverController, Platform, AlertController, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { DatabaseProvider } from '../../../providers/database/database';
import { CallNumber } from "@ionic-native/call-number";

@IonicPage({
    name: 'RestaurantCategoryPage',
    segment: 'restaurant-category-reference'
})
@Component({
  selector: 'page-category-restaurant',
  templateUrl: 'main.html'
})

export class RestaurantCategoryPage {
  viewType: string = "Menu";
  categories: any[] = [];
  items: any[] = [];
  restaurantInfo: {} = {
      address: 'R. Barra Funda, 550',
      phone: '(14)3333-2222',
      web: 'www.bardoze.com.br',
      lat: '-23.5489',
      lng: '-46.6388',
      location: 'São Paulo, SP'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public afDB: AngularFireDatabase,
      public db: DatabaseProvider, public modalCtrl: ModalController, public popoverCtrl: PopoverController, public platform: Platform, public alertCtrl: AlertController,
      private callNumber: CallNumber, private toastCtrl: ToastController) {

    let that = this;
    db.getAllDocuments('restaurant')
        .then(function (e) {
            if (!!e) {
                console.log(e)
                that.categories = e;
                let promoArr = [];

                e.forEach((p) => {
                    db.getSubCategoryCondition('restaurant', p.$key, 'sub', ['promotion', '==', true])
                    .then(function (promotions) {

                        if (!!promotions) {
                            promotions.forEach((k) => {
                                k.$parentKey = p.$key;
                            })
                            promoArr.push.apply(promoArr, promotions);
                        }
                    });
                });
                that.items = promoArr;
            }

        });

  }


  showMap() {
      let mapModal = this.modalCtrl.create('RestaurantMapPage', { info: this.restaurantInfo });
      mapModal.present();
  }

  openList(obj){
      this.navCtrl.push('RestaurantListPage',{categoryId:obj.$key, name: obj.name });
  }

  goToDetail(obj){
      this.navCtrl.push('RestaurantDetailPage', { itemId: obj.$parentKey, subDoc: obj.$key});
  }

  presentPopover(myEvent) {
      let popover = this.popoverCtrl.create('RestaurantPopoverPage');
      popover.present({
          ev: myEvent
      });

      popover.onDidDismiss(data => {
          switch (data) {
              case 1:
                  this.viewType = 'Menu'
                  break;
              case 2:
                  this.viewType = 'Promoções'
                  break;
              case 3:
                  this.viewType = 'Info'
                  break;
          }
      });
  }

  launchNavigation(latitude, longitude, label = 'map') {
      let destination = latitude + ',' + longitude;

      if (this.platform.is('ios')) {
          window.open('maps://?q=' + destination, '_system');
      } else {
          let label = encodeURI('');
          window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
      }
  }

  MakeCall(number) {
      if (!(<any>window).cordova) {
          let alert = this.alertCtrl.create({
              title: 'Atenção',
              subTitle: 'Este dispositivo não é compatível com essa funcionalidade!',
              buttons: ['OK']
          });
          alert.present();
          return;
      }
      if (this.callNumber.isCallSupported()) {
          this.callNumber.callNumber(number, true)
              .then(() => {
                  console.log('Launched dialer!')
              })
              .catch(() => {
                  this.presentToast('bottom', 'Erro ao realizar ligação.');
                  console.log('Error launching dialer')
              });
      } else {
          let alert = this.alertCtrl.create({
              title: 'Attention',
              subTitle: 'Este dispositivo não é compatível com essa funcionalidade!',
              buttons: ['OK']
          });
          alert.present();
      }
  }

  presentToast(position: string, message: string) {
      let toast = this.toastCtrl.create({
          message: message,
          position: position,
          duration: 1000
      });
      toast.present();
  }

}
