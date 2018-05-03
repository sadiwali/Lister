import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ViewController } from 'ionic-angular';
import { MediaData } from '../../providers/firestore/firestore';

/**
 * Generated class for the MediaInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-media-info',
  templateUrl: 'media-info.html',
})
export class MediaInfoPage {

  currMediaData: MediaData; // the current media item json object


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, public toastCtrl: ToastController,
    public viewCtrl: ViewController) {
      this.currMediaData = navParams.get('data');
      console.log(this.currMediaData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MediaInfoPage');
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

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
