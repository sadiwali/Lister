import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { MediaType, AniSearchProvider } from '../../providers/ani-search/ani-search';
import { AuthProvider } from '../../providers/auth/auth';
import { MediaData, FirestoreProvider, FsReturnCodes } from '../../providers/firestore/firestore';
import { MAX_TITLE_LEN } from '../list/list';
import { SimpleOutputProvider } from '../../providers/simple-output/simple-output';
import { createTokenForExternalReference } from '@angular/compiler/src/identifiers';

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


  loading: any;

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
    public simpleOut: SimpleOutputProvider,
    public fireS: FirestoreProvider, public authP: AuthProvider) {
  }

  filterResults(type: MediaType) {
    this.filteredSearchResults[type] = this.searchResults.filter(x => x.type.toLowerCase() == MediaType[type].toLowerCase());
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
      this.searching = false;
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
      if (res.length == 0) {
        this.simpleOut.createToast("Couldn't find anything...").present();
        this.searching = false;
        return;
      }
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
      this.searching = false;
      this.simpleOut.createToast("Could not search... Please try again later.").present();
    });
  }

  resetSelection() {
    this.selectedSearchResult = -1
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
      this.simpleOut.createAlert("You must select an item!").present();
      return;
    }

    if (!this.comments) {
      // comments are optional
      this.comments = "";
    }

    if (!this.rating) {
      this.simpleOut.createAlert("You need to enter a rating out of 10!").present();
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
    this.loading = this.simpleOut.loadCtrl.create({
      content: "Writing that down..."
    });

    this.loading.present(); // display the loading box

    this.fireS.addMedia(data).then((res) => {
      this.loading.dismiss(); // dismiss the loading box
      if (res == FsReturnCodes.NO_DUPLI_CHECK) {
        // added successfully, but no duplicates checked
        // do nothing
      }
      if (res == FsReturnCodes.SUCCESS) {
        // success
        this.simpleOut.createToast("Added " + data.title + " to your list.").present();
        this.closeModal();
      }
    }).catch((err) => {
      if (err == FsReturnCodes.DUPLICATE) {
        // duplicate exists
        this.simpleOut.createAlert("You already added this.").present();
        this.loading.dismiss();
        this.closeModal();

      } else if (err == FsReturnCodes.ERROR) {
        // error
        this.loading.dismiss();
        this.simpleOut.createAlert("Please try again.").present();
      }

    });

  }

}
