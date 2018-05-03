import { Component } from '@angular/core';
import { ListPage } from '../list/list';
import { ProfilePage } from '../profile/profile';
import { SettingsPage } from '../settings/settings';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { AuthProvider } from '../../providers/auth/auth';
import { ToastController, AlertController, App } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ListPage;
  tab2Root = ProfilePage;
  tab3Root = SettingsPage;


  constructor(public modalCtrl: ModalController, public authP: AuthProvider,
    public toastCtrl: ToastController, public alertCtrl: AlertController,
    private app: App) {
    console.log("tabs");
    let i = 0;
    this.authP.afAuth.authState.subscribe(res => {
      i++;
      if (res && res.uid) {
        // logged in
        if (i == 1) {
          this.createToast("Welcome, " + res.displayName, 1000).present();
        }
      } else {
        // not logged in
        this.app.getRootNav().setRoot(LoginPage);
      }
    });
  }

  createToast(message: string, duration = 3000): any {
    return this.toastCtrl.create({
      message,
      duration: duration
    });
  }

  createAlert(message: string): any {
    return this.alertCtrl.create({
      title: message, buttons: [{ text: 'Okay' }]
    });
  }

}
