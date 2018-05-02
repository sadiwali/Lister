import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AddPage } from '../add/add';
import { AniSearchProvider } from '../../providers/ani-search/ani-search';
import { MediaType } from '../../providers/ani-search/ani-search';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { MediaInfoPage } from '../media-info/media-info';

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

  MAX_TITLE_LEN = 25;

  isListView: boolean = false;

  myList: any = []; // list storign all content
  error: boolean = false; // could not get list



  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public aniSearch: AniSearchProvider,
    public fireS: FirestoreProvider) {

    this.subToLists();
  }

  ionViewDidLoad() {  }

  subToLists() {
    // subscribe to the media collection of user
    this.fireS.subscribeAll(MediaType.ANIME).subscribe(next => {
      // update the result after every change
      this.myList = next;
    },
      () => {
        // on complete
        console.log("no longer listening...");
        this.myList = [];
      });

  }

  /* Open a selected media */
  openMedia(index: number) {
    this.modalCtrl.create(MediaInfoPage, { data: this.myList[index] }).present();
  }

  /* bring up the add modal */
  addItem() {
    this.modalCtrl.create(AddPage).present();
  }


}
