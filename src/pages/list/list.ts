import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
import { AddPage } from '../add/add';
import { AniSearchProvider } from '../../providers/ani-search/ani-search';
import { MediaType } from '../../providers/ani-search/ani-search';
import { FirestoreProvider, MediaData, FsReturnCodes } from '../../providers/firestore/firestore';
import { MediaInfoPage } from '../media-info/media-info';
import { StorageProvider } from '../../providers/storage/storage';

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

  selectedMediaType: string;

  error: boolean = false; // could not get list

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public aniSearch: AniSearchProvider,
    public fireS: FirestoreProvider, public alertCtrl: AlertController,
    public toastCtrl: ToastController, public listStorage: StorageProvider) {
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

  subToLists() {
    // subscribe to the media collection of user
    this.fireS.subscribeAll().subscribe(next => {
      // update the result after every change
      this.listStorage.updateLists(next);
    },
      () => {
        // on complete, do nothing
        console.log("no longer listening...");
      });
  }

  /* Search the current list */
  searchList(event: any) {
    if (this.listSearchQuery && this.listSearchQuery.length >= 3) {
      // something to search for
      this.listStorage.searchList(parseInt(this.selectedMediaType),
        this.listSearchQuery);
    } else {
      // reset the list, nothing to search for
      this.listStorage.resetDispList(parseInt(this.selectedMediaType));
    }
  }


  /* Open a selected media */
  openMedia(index: number) {
    this.modalCtrl.create(MediaInfoPage, {
      data: this.listStorage.getDisplayData(parseInt(this.selectedMediaType),
        index)
    }).present();
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
    let deletingObj = this.listStorage
      .getDisplayData(parseInt(this.selectedMediaType), index);
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
