import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AddPage } from '../add/add';
import { AniSearchProvider } from '../../providers/ani-search/ani-search';
import { MediaType } from '../../providers/ani-search/ani-search';
import { FirestoreProvider, MediaData } from '../../providers/firestore/firestore';
import { MediaInfoPage } from '../media-info/media-info';

/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export const MAX_TITLE_LEN = 25;

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  MAX_TITLE_LEN = MAX_TITLE_LEN;

  mediaTypes: any = MediaType; // required for HTML to read MediaType

  isListView: boolean = false;

  selectedMediaType: string;


  myList: any = []; // list storign all content

  myLists: any = {
    0: [],
    1: [],
    2: []
  }

  error: boolean = false; // could not get list

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public aniSearch: AniSearchProvider,
    public fireS: FirestoreProvider) {
      this.subToLists();
    }
    
    ionViewDidLoad() { 
      this.selectedMediaType = "anime";
    }

  setList(which: MediaType) {
    let resArr = this.myList.filter(x => x.type.toLowerCase()
      === MediaType[which].toLowerCase());
    this.myLists[which] = resArr;

  }

  private sortList(list: [MediaData]): [MediaData] {
    let res = list.sort(this.compareDates);
    return res;
  }

  private compareDates(a: MediaData, b: MediaData) {
    if ((a.watchDate as Date).getMilliseconds() < (b.watchDate as Date).getMilliseconds()) {
      return -1;
    } else if ((a.watchDate as Date).getMilliseconds() > (b.watchDate as Date).getMilliseconds()) {
      return 1;
    } else {
      return 0;
    }
  }

  subToLists() {
    // subscribe to the media collection of user
    this.fireS.subscribeAll().subscribe(next => {
      // update the result after every change
      this.myList = this.sortList(next);
      console.log(this.myList);
      this.setList(MediaType.ANIME);
      this.setList(MediaType.SHOW);
      this.setList(MediaType.MOVIE);
    },
      () => {
        // on complete
        console.log("no longer listening...");
        this.myList = [];
      });

  }

  /* Open a selected media */
  openMedia(index: number) {

    console.log(this.selectedMediaType);
    this.modalCtrl.create(MediaInfoPage, { data: this.myLists[parseInt(this.selectedMediaType)][index] }).present();
  }

  /* bring up the add modal */
  addItem() {
    this.modalCtrl.create(AddPage).present();
  }

  share(index: number) {

  }


}
