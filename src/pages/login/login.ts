import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../package/models';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { TermsPage } from '../terms/terms';
import { RegisterPage } from '../register/register';
import { Const } from '../../package/Const';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { AuthProvider } from '../../providers/auth/auth';
import { validateEmail } from '../../package/Tools';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { TabsPage } from '../tabs/tabs';
import { SimpleOutputProvider } from '../../providers/simple-output/simple-output';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {} as User; // for input
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public simpleOut: SimpleOutputProvider,
    public authP: AuthProvider) {

    this.user.email = "sadiwali@hotmail.com";
    this.user.password = "password";
    //this.signInUser();

    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  showTerms() {
    this.modalCtrl.create(TermsPage).present();
  }

  signInUser() {
    if (!validateEmail(this.user.email)) {
      this.simpleOut.createToast("That is not a valid email").present();
      return;
    }

    if (this.user.password.length < Const.MIN_PASS_LENGTH) {
      this.simpleOut.createToast("Password is not valid!").present();
      return;
    }
    // both inputs valid, attempt to validate

    // attempt to set to remember user
    this.authP.rememberUser(true).then(() => {
      this.authenticate();
    }).catch(() => {
      this.simpleOut.createToast("Could not set persistence.").present();
      this.authenticate();
    })
    // attempt to sign in
  }

  private authenticate() {
    this.authP.signInUser(this.user.email, this.user.password).then(() => {
      //this.goIn();
      // no need to goIn, because appComponent handles that for us
    }).catch((e) => {
      this.authP.handleAuthError(e);
    });
  }

  /* depreciated */
  private goIn() {
    console.log('go in');
    this.navCtrl.push(TabsPage);
  }

  /* Display the forgot password alert */
  forgotPassword() {
    this.simpleOut.getAlertCtrl().create({
      title: 'Reset Password',
      inputs: [
        {
          name: 'email',
          placeholder: 'email',
          type: 'email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Submit',
          handler: data => {
            console.log(data.email);
            if (validateEmail(data.email)) {
              this.authP.resetPassword(data.email).then(() => {
                this.simpleOut.createAlert("Password reset email sent!").present();;
              }).catch(() => {
                this.simpleOut.createAlert("Could not send password reset email.").present();
              })
            } else {
              this.simpleOut.createAlert("Incorrect email.").present();
            }
          }
        }
      ]

    }).present();
  }

  signUpUser() {
    let modal = this.modalCtrl.create(RegisterPage);
    modal.onDidDismiss((recData) => {
      if (recData.statCode == Const.STATCODE.EXITED) {
        // do nothing
      } else if (recData.statCode == Const.STATCODE.SUCCESS) {
        // success
        // this.simpleOut.createToast("You are ready to login!").present();
        // this.user.email = recData.email;
      }
    });

    modal.present();
  }

}
