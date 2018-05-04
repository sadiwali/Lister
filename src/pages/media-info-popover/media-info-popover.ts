import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FirestoreProvider, MediaData } from '../../providers/firestore/firestore';

/**
 * Generated class for the MediaInfoPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export enum miReturnCode {
  DELETED,
  ERROR,
  CHANGED,
  SHARED
}

@IonicPage()
@Component({
  selector: 'page-media-info-popover',
  templateUrl: 'media-info-popover.html',
})
export class MediaInfoPopoverPage {

  currMediaData: MediaData;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public fireS: FirestoreProvider, public viewCtrl: ViewController) {
    this.currMediaData = navParams.get('data');
    console.log(this.currMediaData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MediaInfoPopoverPage');
  }

  delete() {
    console.log("dd");
    this.fireS.delete(this.currMediaData.id).then(() => {
      this.close(miReturnCode.DELETED);
    }).catch(() => {
      this.close(miReturnCode.ERROR);
    });

  }

  close(code: miReturnCode) {
    this.viewCtrl.dismiss(code);
  }

}
