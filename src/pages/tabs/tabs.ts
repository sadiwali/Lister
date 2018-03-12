import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { ListPage } from '../list/list';
import { AddPage } from '../add/add';
import { ProfilePage } from '../profile/profile';
import { SettingsPage } from '../settings/settings';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ListPage;
  tab4Root = ProfilePage;
  tab5Root = SettingsPage;

  constructor(public modalCtrl: ModalController) {

  }

}
