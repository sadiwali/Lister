import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ToastController, ModalController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { TermsPage } from '../terms/terms';
import { SimpleOutputProvider } from '../../providers/simple-output/simple-output';

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


  versionTapCounter: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authP: AuthProvider, private app: App,
    public simpleOut: SimpleOutputProvider,
    public modalCtrl: ModalController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  logout() {
    this.authP.signOutUser();
    this.simpleOut.createToast("You have been logged out.").present();
  }

  terms() {
    this.modalCtrl.create(TermsPage).present();
  }

  version() {
    this.versionTapCounter++;
    if (this.versionTapCounter > 10) {
      this.simpleOut.createToast("what.").present;
    }
  }



}
