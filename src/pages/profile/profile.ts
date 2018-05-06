import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { StorageProvider } from '../../providers/storage/storage';
import { MediaType } from '../../providers/ani-search/ani-search';
import { UserData, FirestoreProvider } from '../../providers/firestore/firestore';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  mediaType: MediaType;
  userInfo: UserData;
  joinDate: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authP: AuthProvider, public listStorage: StorageProvider,
    public fireS: FirestoreProvider) {
    this.fireS.getUserData().then(data => {
      this.userInfo = data;
      this.joinDate = data.rawJoinDate.getDate() + "-"
        + (data.rawJoinDate.getMonth() + 1) + "-" + data.rawJoinDate.getFullYear();
    }).catch(err => {
      this.joinDate = "unknown";
    });
  }
}
