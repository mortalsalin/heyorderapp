import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserProfile } from './data';
import { Http } from '@angular/http';
import _ from "lodash";
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { FirestoreService } from '../../../firestore/firestore.service';

@Component({
  selector: 'tab-data',
  templateUrl: './tab.data.component.html'
})
export class DataComponent implements OnInit{
    saveSuccess: boolean = false;
    docExist: boolean = true;
    ionicurl: string = '';
    pp: any;
    selectedKey: string;
    keys: string[];
    isLoading: boolean;
  userProfile$: FirebaseListObservable<any[]>;
  public modalRef: BsModalRef;
  model: UserProfile = new UserProfile();
  adding: boolean = false;

  constructor(private http: Http, 
              private af: AngularFireDatabase, 
              private modalService: BsModalService,
              private cdr: ChangeDetectorRef,
              private config: NgbDropdownConfig,
              private db: FirestoreService) {
      config.placement = 'right';
      config.autoClose = 'outside';

      db.getDocumentsByName('configuration', 'ionicurl').then((o) => {
          if (o != null) {
              this.ionicurl = o.url;
          } else {
              this.docExist = false;
          }
      })
  }
  
  ngOnInit(): void {
     
      this.db.getJsonKeys().subscribe((e) => {
          this.keys = e;
          this.selectedKey = 'all';
      });
  }

  restoreSubCategories() {
      this.isLoading = true;
      this.db.insertSubCategories().then((e) => {
          this.isLoading = false;
      });
  }

  restoreData() {
      this.isLoading = true;
      let key = '';
      if (this.selectedKey != 'all') {
          key = this.selectedKey;
      }

      this.db.migrateDataToFirestoreFromJson(key).then((e) => {
          this.isLoading = false;
          this.pp.close();
      });
  }

  saveUrl() {
      this.isLoading = true;
      if (!this.docExist) {
          this.db.addDocumentByName('configuration', 'ionicurl', { url: this.ionicurl }).then((a) => {
              this.isLoading = false;
              this.saveSuccess = true;
          });
      } else {
          this.db.updateDocument('configuration', 'ionicurl', { url: this.ionicurl }).then((a) => {
              this.isLoading = false;
              this.saveSuccess = true;
          });
      }
  }

}
