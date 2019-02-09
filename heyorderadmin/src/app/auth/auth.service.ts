import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { FirestoreService } from '../firestore/firestore.service';

interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    superAdmin?: string;
}

@Injectable()
export class AuthService {
    successEmailSent: boolean = false;
    errorMsg: any;
    user: Observable<User>;
    showUnauthorizedAlert: boolean = false;
    constructor(private afAuth: AngularFireAuth, private router: Router, private db: FirestoreService) {
                this.authState();
    }

    authState() {
        //// Get auth data, then get firestore user document || null
        this.user = this.afAuth.authState
            .switchMap(user => {
                if (user) {
                    const data: User = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    }
                    return Observable.fromPromise(this.db.getDocumentsByName('users', user.uid))
                    //doc<User>(`users/${user.uid}`).valueChanges()
                } else {
                    return Observable.of(null)
                }
            });
    }

    googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
         this.oAuthLogin(provider);
    }

    private oAuthLogin(provider) {
        let that = this;
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) => {
                that.db.getDocumentsByName('users', credential.user.uid).then((u) => {
                    if (!u || credential.user.uid != u.uid) {
                        that.showUnauthorizedAlert = true;
                        that.signOut();
                    }
                });
            });
    }


    registerUserWithGoogle(isSuperAdmin = false) {
        const provider = new firebase.auth.GoogleAuthProvider();
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) => {

                credential.user.superAdmin= isSuperAdmin ? true : false
                this.createUserData(credential.user).then((q) => {
                    window.location.reload();
                });

            })
    }

    
    private createUserData(user) {
        // Sets user data to firestore on login
        const data: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            superAdmin: user.superAdmin
        }
        return this.db.addDocumentByName('users', user.uid, data)
    }

    signOut() {
        this.afAuth.auth.signOut().then(() => {
            this.router.navigate(['/']);
        });
    }



    loginWithEmailAndPass(email, pass) {
        let that = this;
        this.afAuth.auth.signInWithEmailAndPassword(email, pass).then((credential) => {
            that.db.getDocumentsByName('users', credential.uid).then((u) => {
                if (!u || credential.uid != u.uid) {
                    that.showUnauthorizedAlert = true;
                    that.signOut();
                }
            });
        }).catch((e) => {
            this.errorMsg = e.message;
            this.showUnauthorizedAlert = true;
        });
    }

    registerWithEmailAndPass(name: string, email: string, pass: string, pic: string, isSuperAdmin = false): Promise<any> {

        return this.afAuth.auth.createUserWithEmailAndPassword(email, pass).then((newUser) => {
         
            this.createUserData({
                email: email,
                displayName: name,
                photoURL: pic || '',
                uid: newUser.uid,
                superAdmin: isSuperAdmin? true: false
            }).then((x) => {
                window.location.reload();
                });
        }).catch((e) => {
            this.errorMsg = e.message;
            this.showUnauthorizedAlert = true;
        });
    }

    resetPassword(email: string): Promise<any> {
        return this.afAuth.auth.sendPasswordResetEmail(email).catch((e) => {
            this.errorMsg = e.message;
        }).then((x) => {
            this.successEmailSent = true;
          });
    }
}
