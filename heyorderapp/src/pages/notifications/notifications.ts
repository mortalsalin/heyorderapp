import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import * as moment from 'moment';
/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  notifications: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private afDB: AngularFireDatabase) {
    //let notificationName = this.navParams.get('notificationName');
    afDB.list('sentNotifications').subscribe((e) => {
      let arr = [];
      if (e) {
        e.forEach((n) => {
          let noStartEndDate = !n.runStartDate && !n.runEndDate;
          let noEndDate = !!n.runStartDate && moment().diff(n.runStartDate.formatted, 'days') >= 0 && !n.runEndDate;
          let withinTheRange = !!n.runStartDate && !!n.runEndDate && moment().diff(n.runStartDate.formatted, 'days') >= 0 && moment().diff(n.runEndDate.formatted, 'days') <= 0
          //console.log(moment().diff(n.runStartDate.formatted, 'days'))
          //if active end and start date
          if (noStartEndDate || noEndDate || withinTheRange) {
            //console.log(JSON.stringify(n));
            arr.push(n);
          }
        });
      }
      this.notifications = arr;
    });
  }


}
