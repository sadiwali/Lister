import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
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
import { AniSearchProvider } from '../providers/ani-search/ani-search';
import { FirestoreProvider } from '../providers/firestore/firestore';
import { MediaInfoPage } from '../pages/media-info/media-info';
import { MediaInfoPopoverPage } from '../pages/media-info-popover/media-info-popover';
import { LoadingPage } from '../pages/loading/loading';
import { StorageProvider } from '../providers/storage/storage';
import { SimpleOutputProvider } from '../providers/simple-output/simple-output';

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
    TabsPage,
    LoginPage,
    RegisterPage,
    TermsPage,
    ListPage,
    AddPage,
    ProfilePage,
    SettingsPage,
    MediaInfoPage,
    MediaInfoPopoverPage,
    LoadingPage
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
    TabsPage,
    LoginPage,
    RegisterPage,
    TermsPage,
    ListPage,
    AddPage,
    ProfilePage,
    SettingsPage,
    MediaInfoPage,
    MediaInfoPopoverPage,
    LoadingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    AniSearchProvider,
    FirestoreProvider,
    StorageProvider,
    SimpleOutputProvider,
  ]
})
export class AppModule {}
