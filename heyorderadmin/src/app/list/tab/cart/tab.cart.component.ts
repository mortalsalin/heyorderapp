import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Cart } from './cart';
import { Http } from '@angular/http';
import _ from "lodash";
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { FirestoreService } from '../../../firestore/firestore.service';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'tab-cart',
  templateUrl: './tab.cart.component.html',
  styleUrls: ['tab.cart.component.scss']
})
export class CartComponent implements OnInit{
    displayItems: any[];
    current: string = 'history';
    userProfile: any = {};
    isLoading: boolean;
    subsTotal: number;

    color = '#ccc';
    
    currentItem: any;
    
    subs: any;
    items: any[];
    searchTerm: string;
    intermediary: any[];
    userData: any;
    selectedUser: string;
  cart$: any[];
  public modalRef: BsModalRef;
  model: Cart = new Cart();
  adding: boolean = false;

  showCategories: boolean = true;
  showRestaurantSub: boolean = false;
  showShoppingSub: boolean = false;
  showPlaceSub: boolean = false;

  constructor(private http: Http, 
              private af: AngularFireDatabase, 
              private modalService: BsModalService,
              private cdr: ChangeDetectorRef,
              private config: NgbDropdownConfig,
              private db: FirestoreService) {
                config.placement = 'right';
                config.autoClose = 'outside';
  }
  
  ngOnInit(): void {
      this.loadData();
      this.cdr.detectChanges();
      this.selectedUser = 'select a user';
  }

  loadData() {
      this.isLoading = true;
      this.db.getAllCollections('checkoutProfile').then((data) => {
         
          this.userData = data;//.map(x => { return { uid: x.uid, name: x.fullname } });
          this.isLoading = false;
          
      });
  }

  onTypeChange() {
      if (this.selectedUser != 'select a user') {
          
          this.db.getDocuments('cart', ['uid', '==', this.selectedUser]).then((x) => {
            if (!!x) {

              x = x.filter((e) => {
                return e.type == 'restaurant';
              });

                  x.forEach((e) => {
                      e.total = e.price * e.qty;
                  });
                 
                  this.items = x;
                  this.loadHistory();
              }
              this.userProfile = this.userData.filter((u) => {
                  return u.uid == this.selectedUser
              })[0];
          });
      }

  }

  
  deleteRecord(item: any) {
      this.db.deleteDocument('cart', item.$key);
      this.onTypeChange();
  }

  MarkedAsDelivered(item) {
    item.delivered = true;
    this.db.updateDocument('cart', item.$key, item).then(() => {
      this.onTypeChange();
    })
  }

  MarkedAsProcessing(item) {
    item.processing = true;
    this.db.updateDocument('cart', item.$key, item).then(() => {
      this.onTypeChange();
    })
  }

 
  capitalCase(str) {
      if (!!str && !!str[0]) {
          str = str.replace(/(^|\s)([a-z])/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); });
      }
      return str;
  }

  saveUserProfile() {
      this.isLoading = true;
      this.db.updateDocument('checkoutProfile', this.userProfile.$key, this.userProfile).then((x) => {
          this.isLoading = false;
      });
  }

  loadOnCart() {
      if (!!this.items && this.items.length > 0){
          this.displayItems = this.items.filter((x) => {
              return !x.bought;
          });
      }
      this.current = 'oncart';
  }
  loadHistory() {
      if (!!this.items && this.items.length > 0) {
          this.displayItems = this.items.filter((x) => {
            return !!x.bought && !x.delivered && !x.processing;
          });
      }
      this.current = 'history';
  }

  loadDelivered() {
    if (!!this.items && this.items.length > 0) {
      this.displayItems = this.items.filter((x) => {
        return !!x.bought && !!x.delivered && !x.processing;
      });
    }
    this.current = 'delivered';
  }

  loadProcessing() {
    if (!!this.items && this.items.length > 0) {
      this.displayItems = this.items.filter((x) => {
        return !!x.bought && !x.delivered && !!x.processing;
      });
    }
    this.current = 'processing';
  }
}
