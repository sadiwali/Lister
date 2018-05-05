import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ViewController, PopoverController } from 'ionic-angular';
import { MediaData } from '../../providers/firestore/firestore';
import { MediaInfoPopoverPage, miReturnCode } from '../media-info-popover/media-info-popover';

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
    public viewCtrl: ViewController, public popCtrl: PopoverController) {
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

  presentPopover(event) {
    console.log(event);
    let moreInfoPop = this.popCtrl.create(MediaInfoPopoverPage, { data: this.currMediaData });

    moreInfoPop.onDidDismiss(data => {
      if (data == miReturnCode.DELETED) {
        this.createToast("Deleted " + this.currMediaData.title).present();
      } else if (data == miReturnCode.ERROR) {
        this.createToast("Please try that again.").present();
      }
      this.closeModal();
    });

    moreInfoPop.present({
      ev: event
    });
  }

}
