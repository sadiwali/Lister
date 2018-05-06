import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { Persistence } from '@firebase/auth-types';

/*
The authentication module handles login, registration, and password reset
*/
@Injectable()
export class AuthProvider {

  constructor(public http: HttpClient, public afAuth: AngularFireAuth) { }

  /* Sign in the user */
  signInUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
  }
  /* Set the persistance of the login session */
  private setPersistence(persistence: Persistence) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.setPersistence(persistence).then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }
  /* Set persistence based on really */
  rememberUser(really: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.setPersistence(really ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION).then(() => {
        resolve();
      }).catch(() => {
        // could not set, it is the old state, no need to change this.remembers
        reject();
      });
    });
  }
  /* Sign up user with email */
  signUpUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(newEmail, newPassword);
  }
  /* Sign up user with Google */
  googleSignUp(): Promise<any> {
    return this.afAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  /* Send a password reset email */
  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }
  /* Sign out the user */
  signOutUser(): Promise<any> {
    return this.afAuth.auth.signOut();
  }
  /* Broadcast auth state for current user */
  userAuthChange(): Observable<firebase.User> {
    return this.afAuth.authState;
  }
  /* Get the Firebase current user */
  getCurrentUser(offline: boolean = false) {
    if (offline) {
      return {
        uid: 4343434
      }
    } else {
      return this.afAuth.auth.currentUser;
    }
  }
  /* Handle all errors thrown bt the Firebase Auth module. */
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
