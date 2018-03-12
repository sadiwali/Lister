import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { LoginPage } from '../pages/login/login';

import { HttpModule } from '@angular/http';


import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HttpClientModule } from '@angular/common/http';
import { RegisterPage } from '../pages/register/register';
import { TermsPage } from '../pages/terms/terms';
import { ListPage } from '../pages/list/list';
import { ProfilePage } from '../pages/profile/profile';
import { AddPage } from '../pages/add/add';
import { SettingsPage } from '../pages/settings/settings';
import { ShowViewPage } from '../pages/show-view/show-view';

// AF2 Settings
const firebaseConfig = {
  apiKey: "AIzaSyAyP-f6wsQydYVWAV48uebhJPTebJT8xHk",
  authDomain: "showlistnext.firebaseapp.com",
  databaseURL: "https://showlistnext.firebaseio.com",
  projectId: "showlistnext",
  storageBucket: "showlistnext.appspot.com",
  messagingSenderId: "484780848428"
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    TermsPage,
    ListPage,
    AddPage,
    ProfilePage,
    SettingsPage,
    ShowViewPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    TermsPage,
    ListPage,
    AddPage,
    ProfilePage,
    SettingsPage,
    ShowViewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider
  ]
})
export class AppModule {}
