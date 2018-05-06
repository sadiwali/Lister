import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthProvider } from '../providers/auth/auth';
import { LoadingPage } from '../pages/loading/loading';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoadingPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public authP: AuthProvider) {
    platform.ready().then(() => {
      // check if user already logged in
      this.authP.afAuth.authState.subscribe(res => {
        // check if user logged in through persistence
        if (res && res.uid) {         
          // logged in so send to home
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
