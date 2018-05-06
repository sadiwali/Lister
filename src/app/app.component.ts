import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthProvider } from '../providers/auth/auth';
import { LoadingPage } from '../pages/loading/loading';
import { SimpleOutputProvider } from '../providers/simple-output/simple-output';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoadingPage;

  constructor(platform: Platform, statusBar: StatusBar, 
    splashScreen: SplashScreen, public simpleOut: SimpleOutputProvider,
    public authP: AuthProvider) {
    platform.ready().then(() => {
      // check if user already logged in
      this.authP.afAuth.authState.subscribe(res => {
        // check if user logged in through persistence
        if (res && res.uid && res.displayName) {         
          // logged in so send to home
          this.simpleOut.createToast("Hi, " + res.displayName, 1000).present();
          this.rootPage = TabsPage;
        } else {
          // not logged in so send to login
          this.rootPage = LoginPage;
        }
      });

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
