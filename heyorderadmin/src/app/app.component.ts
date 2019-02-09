import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { FirestoreService } from "./firestore/firestore.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    isAdminRegistered: boolean = true;

    constructor(public auth: AuthService, private db: FirestoreService) {
      this.db.getAllCollections('users').then((docs) => {
          if (!docs || docs.length == 0) {
              this.isAdminRegistered = false;
          } else {
              this.isAdminRegistered = true;
          }
      });
  }

  closeAlert(){
      this.auth.showUnauthorizedAlert = false;
  }
}


