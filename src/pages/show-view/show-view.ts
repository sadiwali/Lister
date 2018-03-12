import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ShowViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-view',
  templateUrl: 'show-view.html',
})
export class ShowViewPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowViewPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
