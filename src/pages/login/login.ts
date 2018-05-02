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
    public modalCtrl: ModalController, public toastCtrl: ToastController,
    public authP: AuthProvider, public alertCtrl: AlertController) {

    this.user.email = "sadiwali@hotmail.com";
    this.user.password = "frgtwhy";
    //this.signInUser();

    // debug imdb module


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
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

  showTerms() {
    this.modalCtrl.create(TermsPage).present();
  }

  signInUser() {
    if (!validateEmail(this.user.email)) {
      this.createToast("That is not a valid email").present();
      return;
    }

    if (this.user.password.length < Const.MIN_PASS_LENGTH) {
      this.createToast("Password is not valid!").present();
      return;
    }
    // both inputs valid, attempt to validate

    // attempt to set persistence
    this.authP.setPersistence().then(() => {
      this.goIn();
    }).catch(() => {
      this.createToast("Could not set persistence.").present();
      this.goIn();
    })
    // attempt to sign in


  }

  private goIn() {
    this.authP.signInUser(this.user.email, this.user.password).then(() => {
      this.navCtrl.push(TabsPage);
    }).catch((e) => {
      this.authP.handleAuthError(this, e);
    });
  }

  /* Display the forgot password alert */
  forgotPassword() {
    this.alertCtrl.create({
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
                this.createAlert("Password reset email sent!").present();;
              }).catch(() => {
                this.createAlert("Could not send password reset email.").present();
              })
            } else {
              this.createAlert("Incorrect email.").present();
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
        this.createToast("You are ready to login!").present();
        this.user.email = recData.email;
      }
    });

    modal.present();
  }

}
