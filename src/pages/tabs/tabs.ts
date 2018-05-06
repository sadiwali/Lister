import { Component } from '@angular/core';
import { ListPage } from '../list/list';
import { ProfilePage } from '../profile/profile';
import { SettingsPage } from '../settings/settings';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { AuthProvider } from '../../providers/auth/auth';
import { ToastController, AlertController, App } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SimpleOutputProvider } from '../../providers/simple-output/simple-output';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ListPage;
  tab2Root = ProfilePage;
  tab3Root = SettingsPage;


  constructor(public modalCtrl: ModalController, public authP: AuthProvider) { }

}
