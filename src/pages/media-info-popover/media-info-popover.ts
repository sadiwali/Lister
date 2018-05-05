import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
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
    public fireS: FirestoreProvider, public viewCtrl: ViewController,
  public alertCtrl: AlertController) {
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

  edit() {
    this.alertCtrl.create({
      title: "Edit",
      inputs: [
        {
          label: 'comments',
          type: 'text',
          name: 'comments',
          placeholder: 'comments',
          value: this.currMediaData.comments
        },
        {
          label: 'rating',
          type: 'number',
          name: 'rating',
          min: 0,
          max: 10,
          placeholder: 'rating',
          value: this.currMediaData.rating.toString()
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, 
        {
          text: 'Submit',
          handler: (data) => {
            let newData = {
              rating: parseInt(data.rating),
              comments: data.comments
            }

            this.fireS.updateMedia(this.currMediaData.id, newData).then(() => {
              this.close(miReturnCode.CHANGED);
            }).catch(() => {
              this.close(miReturnCode.ERROR);
            });
          }
        }
      ]
    }).present();
    
    
  }

  close(code: miReturnCode) {
    this.viewCtrl.dismiss(code);
  }

}
