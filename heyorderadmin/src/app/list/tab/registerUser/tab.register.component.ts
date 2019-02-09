import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { FirestoreService } from "../../../firestore/firestore.service";
import { Router } from '@angular/router';

@Component({
  selector: 'tab-register',
  templateUrl: './tab.register.component.html',
  styleUrls: ['tab.register.component.scss']
})
export class RegisterComponent {
  
    isAdminRegistered: boolean = true;

    constructor(public auth: AuthService, private db: FirestoreService, private router: Router) {
        auth.user.subscribe((x) => {
            if (!x.superAdmin) {
                this.router.navigate(['/']);
            }
        });
    }

    closeAlert() {
        this.auth.showUnauthorizedAlert = false;
    }
 
}
