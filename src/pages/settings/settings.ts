import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authP: AuthProvider, private app: App, public alertCtrl: AlertController,
    public toastCtrl: ToastController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
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

  logout() {
    this.authP.signOutUser(this);
    this.createToast("You have been logged out.").present();
    this.app.getRootNav().setRoot(LoginPage);

  }
}
