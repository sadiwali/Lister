import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
import { AddPage } from '../add/add';
import { AniSearchProvider } from '../../providers/ani-search/ani-search';
import { MediaType } from '../../providers/ani-search/ani-search';
import { FirestoreProvider, MediaData, FsReturnCodes } from '../../providers/firestore/firestore';
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

  listSearchQuery: string;

  mediaTypes: any = MediaType; // required for HTML to read MediaType

  isListView: boolean = false;

  selectedMediaType: string;


  myList: any = []; // list storign all content

  myLists: any = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: []
  }

  myDisplayLists: any = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: []
  }

  error: boolean = false; // could not get list

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public aniSearch: AniSearchProvider,
    public fireS: FirestoreProvider, public alertCtrl: AlertController,
    public toastCtrl: ToastController) {
    this.subToLists();
  }

  ionViewDidEnter() {
    console.log("enter");
    this.selectedMediaType = "4";
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


  setList(which: MediaType) {
    let resArr;

    if (which == MediaType.ENTIRE) {
      // everything goes into this list
      resArr = this.myList;
    } else {
      resArr = this.myList.filter(x => x.type.toLowerCase()
        === MediaType[which].toLowerCase());
    }

    this.myLists[which] = resArr; // set the main list
    this.myDisplayLists[which] = resArr; // set the display list also
    console.log(resArr);

  }

  private sortList(list: [MediaData]): [MediaData] {
    let res = list.sort(this.compareDates);
    console.log(list, res);
    return res;
  }

  private compareDates(a: MediaData, b: MediaData) {
    if ((a.watchDate as Date) < (b.watchDate as Date)) {
      return -1;
    } else if ((a.watchDate as Date) > (b.watchDate as Date)) {
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
      this.setList(MediaType.MANGA);
      this.setList(MediaType.SHOW);
      this.setList(MediaType.MOVIE);
      // this is different because searching this list filters it
      this.setList(MediaType.ENTIRE);
    },
      () => {
        // on complete
        console.log("no longer listening...");
        this.myList = [];
      });
  }

  /* Search the current list */
  searchList(event: any) {
    if (this.listSearchQuery && this.listSearchQuery.length >= 3) {
      // something to search for
      let resArr = this.myLists[parseInt(this.selectedMediaType)]
        .filter(x => x.title.toLowerCase()
          .includes(this.listSearchQuery.toLowerCase()));

      this.myDisplayLists[this.selectedMediaType] = resArr;
    } else {
      // reset the list, nothing to search for
      this.resetDisplayLists(parseInt(this.selectedMediaType));
    }
  }

  resetDisplayLists(which: number) {
    this.myDisplayLists[which] = this.myLists[which];
  }

  /* Open a selected media */
  openMedia(index: number) {
    this.modalCtrl.create(MediaInfoPage, { data: this.myDisplayLists[parseInt(this.selectedMediaType)][index] }).present();
  }

  /* bring up the add modal */
  addItem() {
    this.modalCtrl.create(AddPage).present();
  }

  share(index: number) {

  }

  promptDelete(index: number) {
    // prompt for deletion
    console.log(index);
    this.alertCtrl.create({
      title: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.delete(index);
          }
        }
      ]
    }).present();
  }

  private delete(index: number) {
    console.log(index);
    let deletingObj = this.myDisplayLists[parseInt(this.selectedMediaType)][index];
    console.log(deletingObj);
    this.fireS.delete(deletingObj.id).then(() => {
      let toast = this.toastCtrl.create({
        message: "Deleted " + deletingObj.title,
        duration: 5000,
        showCloseButton: true,
        closeButtonText: "UNDO"
      });

      toast.onDidDismiss((data, role) => {
        if (role == "close") {
          this.fireS.addMedia(deletingObj).then(code => {
            // added back okay
          }).catch(err => {
            // could not redo the last action
            if (err == FsReturnCodes.ERROR) {
              this.createAlert("Could not undo your deletion. Please add it back manually...").present();
              this.modalCtrl.create(AddPage).present();
            }
          })
        }
      });

      toast.present();
    }).catch(() => {
      this.createToast("Could not delete " + deletingObj.title).present();
    });
  }




}
