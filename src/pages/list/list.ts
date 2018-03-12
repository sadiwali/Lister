import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ShowViewPage } from '../show-view/show-view';

/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  isListView: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  openShow(what) {
    console.log(what);
    this.modalCtrl.create(ShowViewPage).present();
  }

}
