import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthData {
  constructor(public afAuth: AngularFireAuth) {
  }

  loginUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword)
  }

  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  registerUser(name: string, email: string, password: string, phone: number, pic: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((newUser) => {
      firebase.database().ref('/userProfile').child(newUser.uid).set({
        email: email,
        name: name,
        pic: pic,
        phone: phone
      });
    });
  }

}
