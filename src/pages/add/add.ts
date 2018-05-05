import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { MediaType, AniSearchProvider } from '../../providers/ani-search/ani-search';
import { AuthProvider } from '../../providers/auth/auth';
import { MediaData, FirestoreProvider, FsReturnCodes } from '../../providers/firestore/firestore';
import { MAX_TITLE_LEN } from '../list/list';

/**
 * Generated class for the AddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {

  MAX_TITLE_LEN = MAX_TITLE_LEN;

  searching: boolean = false;

  query: string = ""; // the search query
  searchResults: any = []; // list of results to display

  selectedMediaType: string;

  filteredSearchResults: any = {
    0: [],
    1: [],
    2: [],
    3: []
  }

  selectedSearchResult: number = -1; // the selected item in list

  // from inputs
  comments: string;
  rating: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public aniSearch: AniSearchProvider,
    public toastCtrl: ToastController, public alertCtrl: AlertController,
    public fireS: FirestoreProvider, public authP: AuthProvider) {
  }

  filterResults(type: MediaType) {
    this.filteredSearchResults[type] = this.searchResults.filter(x => x.type.toLowerCase() == MediaType[type].toLowerCase());
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
  }

  /* Search for something */
  search() {
    this.selectedMediaType = "4"; // select ALL by default
    if (!this.query || this.query.length <= 3) {
      // clear
      console.log("clearing");
      this.searchResults = [];
      this.filteredSearchResults = {
        0: [],
        1: [],
        2: [],
        3: []
      };
      return;
    }
    
    this.searching = true;
    // do the search, then display into list
    this.aniSearch.search(this.query).then((res) => {
      this.searchResults = res;
      this.filterResults(MediaType.ANIME);
      this.filterResults(MediaType.MANGA);
      this.filterResults(MediaType.SHOW);
      this.filterResults(MediaType.MOVIE);
      // no need for a ENTIRE filtering because just use original big list
      this.searching = false;
      console.log(this.searchResults);
    }).catch((err) => {
      console.log(err);
    });
  }

  selectSearchResult(index: number) {
    // select a result
    if (this.selectedSearchResult == index) {
      // de-select
      this.selectedSearchResult = -1;
      return;
    }
    this.selectedSearchResult = index;
  }

  addNew() {
    // add the selected item to the list, conditonal on inputs filled
    if (this.selectedSearchResult < 0) {
      // nothing selected
      this.createAlert("You must select an item!").present();
      return;
    }

    if (!this.comments) {
      // comments are optional
      this.comments = "";
    }

    if (!this.rating) {
      this.createAlert("You need to enter a rating out of 10!").present();
      return;
    }
    // add
    let item = this.searchResults[this.selectedSearchResult];
    let data = {
      title: item.title,
      source: item.source,
      comments: this.comments,
      rating: this.rating,
      watchDate: new Date(),
      type: item.type,
      id: item.id,
      coverImage: {
        medium: item.coverImage.medium,
        large: item.coverImage.large
      }
    } as MediaData;

    // perform a query to check duplicate

    this.fireS.addMedia(data).then((res) => {
      if (res == FsReturnCodes.NO_DUPLI_CHECK) {
        // added successfully, but no duplicates checked
        // do nothing
      }
      if (res == FsReturnCodes.SUCCESS) {
        // success
        this.createToast("Added " + data.title + " to your list.").present();
        this.closeModal();
      }
    }).catch((err) => {
      if (err == FsReturnCodes.DUPLICATE) {
        // duplicate exists
        this.createAlert("You already added this.").present();
      } else if (err == FsReturnCodes.ERROR) {
        // error
        this.createAlert("Please try again.").present();
      }
    });

  }

}
