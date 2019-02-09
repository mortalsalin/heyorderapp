import { Component, ViewChild } from '@angular/core';
import { IonicPage, Platform, NavController, AlertController, Tabs } from "ionic-angular";

import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { config } from '../../config/config';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
  })
export class TabsPage {

  @ViewChild('myTabs') tabRef: Tabs;

  restaurant = 'RestaurantCategoryPage';
  cart = 'CartPage';
  promotions = 'NotificationsPage';
  profile = 'AfterLoginPage';

  constructor(private navCtrl: NavController, private platform: Platform, private push: Push, private afAuth: AngularFireAuth, private afDB: AngularFireDatabase,
    private alertCtrl: AlertController) {
    this.platform.ready().then(() => {

      if ((<any>window).cordova) {
        this.setUpPushNotification();
      }
    });
  }

  setUpPushNotification() {
    const options: PushOptions = {
      android: {
        senderID: config.messagingSenderId
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      //alert('Received a notification ' + JSON.stringify(notification));
      if (!notification.additionalData || !notification.additionalData.extras) {
        return;
      }
      this.tabRef.select(2);
      //this.navCtrl.push('NotificationsPage', { title: notification.additionalData.extras.landingTitle, body: notification.additionalData.extras.landingText });
    });

    pushObject.on('registration').subscribe((registration) => {
      this.afAuth.authState.subscribe(userAuth => {
        if (!!userAuth) {
          this.afDB.object('/userProfile/' + userAuth.uid).update({ pushTocken: registration.registrationId });
          return;
        } else {
          let prompt = this.alertCtrl.create({
            title: 'Login',
            message: "Você precisa estar logado para receber notificações!",

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
      });
      //alert('Device registered ' + JSON.stringify(registration));
    });

    pushObject.on('error').subscribe(error => {
      alert('Erro: ' + JSON.stringify(error))
    });
  }
}
