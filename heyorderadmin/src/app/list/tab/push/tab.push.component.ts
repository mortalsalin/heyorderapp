import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Push, PushViewModel } from './push';
import _ from "lodash";
import { FirestoreService } from '../../../firestore/firestore.service';
import { pushAuthKey } from '../../../config/config';
import { Observable } from "rxjs/Observable";
import * as moment from 'moment';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';


@Component({
  selector: 'tab-push',
  templateUrl: './tab.push.component.html',
  styleUrls: ['tab.push.component.scss']
})
export class PushComponent {
  channels: any[];
  channelsFromDb: any[];
  groupCheck: boolean;
  userCheck: boolean;
  selectedUsersGroup: any[] = [];
  selectedChannels: any[] = [];
  toggleSelectAllGroups: boolean = false;
  groups: any[];
  groupSearchTerm: string = '';
  channelSearchTerm: string = '';
  toggle: string = 'users';
  groupsActive: boolean = false;
  channelsActive: boolean = false;
  userActive: boolean = true;
  usersGroups: any[];
  selectedUsers: Array<any> = [];
  error: boolean;
  status: string;
  success: boolean;
  toggleSelectAll: boolean = false;
    pp: any;
    itemsSentNotifications: any;
    searchTermSentNotifications: string ='';
    sentNotifications: any;
    sentNotifications$: any;
    totalSelected: number = 0;
    modalRef: any;
    model: Push = new Push();
    items: any;
    searchTerm: string = '';
    users: any;
    isLoading: boolean;
    users$: FirebaseListObservable<any[]>;
    authorizationKey: any = pushAuthKey;
    myDatePickerOptions: IMyDpOptions = {
      // other options...
      dateFormat: 'mm/dd/yyyy',
    };
    constructor(private http: Http, private af: AngularFireDatabase, private modalService: BsModalService) {
        this.loadData();

  }

    recipientSelected() {
      if (this.selectedUsers.length > 0 || this.selectedUsersGroup.length > 0 || this.selectedChannels.length > 0) {
        return true;
      }
      return false;
    }

    changed(user) {
   

        if (!!user) {
          if (!!user.checked) {
            this.selectedUsers.push(user);
          } else {
            let email = this.selectedUsers.map((x) => { return x.email })
            this.selectedUsers.splice(email.indexOf(user.email), 1);
          }
        }
    }

    changedGroup(group) {
      if (!!group) {
        if (!!group.checked) {
          this.selectedUsersGroup.push(group);
        } else {
          let key = this.selectedUsersGroup.map((x) => { return x.$key })
          this.selectedUsersGroup.splice(key.indexOf(group.$key), 1);
        }
      }
    }

    changedChannel(channel) {
      if (!!channel) {
        if (!!channel.checked) {
          this.selectedChannels.push(channel);
        } else {
          let key = this.selectedChannels.map((x) => { return x.$key })
          this.selectedChannels.splice(key.indexOf(channel.$key), 1);
        }
      }
    }

    loadData() {
        this.isLoading = true; 
        this.users$ = this.af.list('/userProfile', {});
        this.users$.subscribe((e) => {
            this.isLoading = false;
            this.users = e;
            this.search();
        });

        this.af.list('/userGroups', {}).subscribe((e) => {
          this.isLoading = false;
          this.usersGroups = e;
          this.searchGroups();
        });

        this.af.list('/ChannelsTopics', {}).subscribe((e) => {
          this.isLoading = false;
          this.channelsFromDb = e;
          this.searchChannels();
        });
    }

    toggleTabs(tab) {
      this.userActive = false;
      this.groupsActive = false;
        this.channelsActive = false;
        if (tab == 'users') {
        this.userActive = true;
      } else if (tab == 'groups') {
        this.groupsActive = true;
        this.searchGroups();
      } else if (tab == 'channels') {
          this.channelsActive = true;
          this.searchChannels()
      }
      this.toggle = tab;
    }

    loadSavedNotificationData() {
        this.isLoading = true;
        this.sentNotifications$ = this.af.list('/sentNotifications', {});
        this.sentNotifications$.subscribe((e) => {
          this.isLoading = false;
          this.sentNotifications = new Push();
                this.sentNotifications = e;
            
            this.searchSentNotifications();
        });
    }

    searchSentNotifications() {
        if (this.searchTermSentNotifications == '') {
            this.itemsSentNotifications = this.sentNotifications;
        } else if (this.itemsSentNotifications && this.searchTermSentNotifications != undefined) {
            let res = this.sentNotifications.filter((e) => {
                e.name == e.name || '';
                return (e.name.toLowerCase().indexOf(this.searchTermSentNotifications.toLowerCase()) > -1);
            });
            this.itemsSentNotifications = res;
        }
    }

    searchGroups() {
      if (this.groupSearchTerm == '') {
        this.groups = this.usersGroups;
      } else if (this.groups && this.groupSearchTerm != undefined) {
        let res = this.usersGroups.filter((e) => {
          e.name = !!e.name ? e.name : '';
          return (e.name.toLowerCase().indexOf(this.groupSearchTerm.toLowerCase()) > -1);
        });
        this.groups = res;
      }
    }

    searchChannels() {
      if (this.channelSearchTerm == '') {
        this.channels = this.channelsFromDb;
      } else if (this.groups && this.channelSearchTerm != undefined) {
        let res = this.channelsFromDb.filter((e) => {
          e.name = !!e.name ? e.name : '';
          return (e.name.toLowerCase().indexOf(this.channelSearchTerm.toLowerCase()) > -1);
        });
        this.channels = res;
      }
    }


    search() {
        if (this.searchTerm == '') {
            this.items = this.users;
        } else if (this.items && this.searchTerm != undefined) {
            let res = this.users.filter((e) => {
                e.email = !!e.email? e.email: '';
                e.name = !!e.name? e.name: '';
                return (e.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) || (e.email.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1);
            });
            this.items = res;
        }
    }

    openModal(template: TemplateRef<any>, item: object) {
  
        this.modalRef = this.modalService.show(template, { class: 'push-wide-modal' });
    }
  

    saveNotification(model: Push): void {
      model.createdDate = model.createdDate ? model.createdDate: '';
      model.updatedDate = model.updatedDate ? model.updatedDate: '';
      model.runStartDate = model.runStartDate ? model.runStartDate: '';
      model.runEndDate = model.runEndDate ? model.runEndDate: '';

      if (model.runStartDate == 'Invalid date' || model.runEndDate == 'Invalid date') {
        this.error = true;
        this.status = 'Inavlid date';
        return;
      }

      let that = this;
      this.isLoading = true;
      this.af.list('/sentNotifications/' + model.$key).subscribe((e) => {
        let key = model.$key;
        if (e && e.length > 0) {
          model.updatedDate = moment().format();
          delete model.$key;
          this.af.object(`/sentNotifications/${key}`).set(model)
            .then((n) => {
              this.isLoading = false;
              this.success = true;
              this.status = 'Notification seccesfully updated';
              setTimeout(() => { this.success = false }, 3000);
            });
          model.$key = key;
        } else {
          model.createdDate = moment().format();
          model.updatedDate = moment().format();
          delete model.$key;
          this.af.list('/sentNotifications').push(model)
            .then((n) => {
              model.$key = n.key;
              this.isLoading = false;
              this.success = true;
              this.status = 'Notification seccesfully saved';
              setTimeout(() => { this.success = false }, 3000);
            });
          model.$key = key;
        }

      });
    }

    sendNotification(model) {
      this.saveNotification(model);
      this.isLoading = true;
      if (!this.selectedUsers && !this.selectedUsersGroup && !this.selectedChannels) {
        return;
      }
      let selectedUserPushTockens = [];
      this.selectedUsers.forEach((e) => {
          selectedUserPushTockens.push(e.pushTocken);
      });

      this.selectedUsersGroup.forEach((e) => {
        if (e.users) {
          selectedUserPushTockens = selectedUserPushTockens.concat(e.users.map((x) => { return x.pushTocken }));
        } 
      })

      this.selectedChannels.forEach((e) => {
        if (e.name) {
          selectedUserPushTockens.push('/topics/' + e.name);
        }
      })

      if (!!selectedUserPushTockens && selectedUserPushTockens.length > 0) {
        selectedUserPushTockens.forEach((x, i) => {
          this.sendPushNotification(x, model);
          this.isLoading = false;

          this.success = true;
          this.status = 'Notification seccesfully sent';
          setTimeout(() => { this.success = false }, 3000);
        })
      }
    }

    cancelModal() {
      this.modalRef.hide();
    }

    selectAll() {
     
      if (this.toggleSelectAll) {
        this.items.forEach((x) => {
          x.checked = false;
        });
        this.userCheck = false;
        this.selectedUsers = [];
        this.toggleSelectAll = false;
      } else {
        this.items.forEach((x) => {
          x.checked = true;
        });
        this.userCheck = true;
        this.selectedUsers = JSON.parse(JSON.stringify(this.items));
        this.toggleSelectAll = true;
      }
        
        this.changed(null);
    }

    selectAllGroups() {
    
      if (this.toggleSelectAllGroups) {
        this.groups.forEach((x) => {
          x.checked = false;
        });
        this.groupCheck = false;
        this.selectedUsersGroup = [];
        this.toggleSelectAllGroups = false;
      } else {
        this.groups.forEach((x) => {
          x.checked = true;
        });
        this.groupCheck = true;
        this.selectedUsersGroup = JSON.parse(JSON.stringify(this.groups));
        this.toggleSelectAllGroups = true;
      }

      this.changed(null);
    }

    sendPushNotification(deviceId: string, model: Push) {
      let url = 'https://fcm.googleapis.com/fcm/send';
      //use notification instead of data for ios
      let body =
          {
              "data": {
                  "title": model.title,
                  "body": model.text,
                  "sound": "default",
                  "icon": "fcm_push_icon",
                  "extras": {
                    "name": model.name
              }
              },
              "to": deviceId
          };

      let headers: Headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'key=' + this.authorizationKey
      });
     
      let options = new RequestOptions({ headers: headers });
      let post = this.http.post(url, body, options)
      post.map(response => {
          return response;
      }).subscribe(data => {
          //post doesn't fire if it doesn't get subscribed to
          console.log(data);
          //store the notification on the database
          });
      return post;
  }
  
    deleteCampaign(currentItem) {
      this.isLoading = true;
      this.af.object('/sentNotifications/' + currentItem.$key).remove().then(() => {
        this.isLoading = false;
      });
    }

    loadModel(e) {
      //clear model first
      e.runStartDate = !e.runStartDate ? '' : e.runStartDate; 
      e.runEndDate = !e.runEndDate ? '' : e.runEndDate; 
      this.model = new PushViewModel(e);
      //this.model = e;
  }

  clearForm() {
    this.model = new Push();
    this.selectedUsers = [];
    this.selectedUsersGroup = [];
    this.selectedChannels = [];
  }

  
}
