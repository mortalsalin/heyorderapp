import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserProfile } from './userProfile';
import { Http } from '@angular/http';
import _ from "lodash";

@Component({
  selector: 'tab-userProfile',
  templateUrl: './tab.userProfile.component.html'
})
export class UserProfileComponent implements OnInit{
    isLoading: boolean;
  userProfile$: FirebaseListObservable<any[]>;
  public modalRef: BsModalRef;
  model: UserProfile = new UserProfile();
  adding: boolean = false;

  constructor(private http: Http, 
              private af: AngularFireDatabase, 
              private modalService: BsModalService,
              private cdr: ChangeDetectorRef) {
  }
  
  ngOnInit(): void {
      this.isLoading = true;
      this.userProfile$ = this.af.list('/userProfile', {});
      this.userProfile$.subscribe((e) => {
          this.isLoading = false;
      })
    this.cdr.detectChanges();
  } 

  openModal(template: TemplateRef<any>, item: object, addFlag: boolean) {
    if (addFlag === true) {
      this.adding = true;
      this.model = {};
    } else {
      this.adding = false;
      this.model = item;
    }
    this.modalRef = this.modalService.show(template);
  }

  deleteRecord(item: any) {
    this.af.database
    .ref('/userProfile/' + item.$key)
    .remove();
  }

  editOrAddRecord(model: any, addFlag: boolean): void { 
    var data = { 
      email: model.email ? model.email : null, 
      name: model.name ? model.name : null
    };
    if (addFlag === true) {
      // Add Record
      this.af.database.ref('/userProfile')
      .push()
      .set(data);    
      this.modalRef.hide()
    } else {
      // Edit Record
      this.af.database
      .ref('/userProfile/' + model.$key)
      .set(data);    
      this.modalRef.hide()
    }
  }
}
