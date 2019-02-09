import { Component } from '@angular/core';
import 'rxjs/Rx';
import { AuthService } from "../auth/auth.service";


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent{
    isSuperAdmin: boolean = false;
    constructor(public auth: AuthService) {
      this.auth.user.subscribe((x) => {
            if (!!x) {
              this.isSuperAdmin = <any>x.superAdmin;
            }
        });
    }
}
