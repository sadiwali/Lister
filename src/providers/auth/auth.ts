import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
/*
The authentication module handles login, registration, and password reset
*/
@Injectable()
export class AuthProvider {

  constructor(public http: HttpClient, public afAuth: AngularFireAuth) { }

  // sign in user
  signInUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
  }

  setPersistence() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.setPersistence("local").then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  // sign up with email
  signUpUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(newEmail, newPassword);
  }

  // sign up with google
  googleSignUp(): Promise<any> {
    return this.afAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  // reset password of user with email
  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  // sign out the user, and perform signout of app
  signOutUser(context: any): Promise<any> {
    context.navCtrl.popToRoot();
    return this.afAuth.auth.signOut();
  }

  // authentication change broadcaster
  userAuthChange(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  // get the current user
  getCurrentUser() {
    return firebase.auth().currentUser;
  }

  

  /**
 * Handle all errors thrown bt the Firebase Auth module.
 * @param err the error string
 */
  handleAuthError(context: any, err: any) {
    let eCode = err.code;
    if (eCode == "auth/user-not-found") {
      // user not found
      context.createToast("I don't know you!, Please register!").present();
    } else if (eCode == "auth/network-request-failed") {
      // could not connect to server
      context.createToast("Hmm... Are you offline?").present();
    } else if (eCode == "auth/wrong-password") {
      // user entered wrong password
      context.createToast("That is not the right password."
        + " Did you forget it?").present();
    } else if (eCode == "auth/email-already-in-use") {
      // email already in use, cannot register
      context.createToast("I already know this email."
        + " Did you forget it's password?").present();
    } else {
      // an unknown rror occurs
      context.createToast(err.message);
    }
  }

}
