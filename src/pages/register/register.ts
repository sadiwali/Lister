import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { TermsPage } from '../terms/terms';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { AuthProvider } from '../../providers/auth/auth';
import { Const } from '../../package/Const';
import { AngularFirestore } from 'angularfire2/firestore';
import { SimpleOutputProvider } from '../../providers/simple-output/simple-output';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  loadingRegister: boolean = false;

  form = {
    email: {
      text: '',
      valid: true
    },
    name: {
      text: '',
      valid: true
    },
    password_main: {
      text: '',
      valid: true
    },
    password_sub: {
      text: '',
      valid: true
    }
  } as any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public viewCtrl: ViewController,
    public simpleOut: SimpleOutputProvider, public authP: AuthProvider, 
    public af: AngularFirestore) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  showTerms() {
    this.modalCtrl.create(TermsPage).present();
  }

  closeModal(statCode?: number) {
    this.viewCtrl.dismiss(
      { statCode: statCode ? statCode : Const.STATCODE.EXITED });
  }

  async register() {
    // check for errors
    if (this.form.email.text
      && this.form.name.text
      && this.form.password_main.text
      && this.form.password_sub.text) {

      if (!this.form.email.valid) {
        // email not entered
        this.simpleOut.createToast("Enter your email!").present();
        return;
      }

      if (this.form.password_main.valid
        && !this.form.password_sub.valid) {
        // both passwords not valid
        this.simpleOut.createToast("Passwords do not match").present();
        return;
      } else if (!this.form.password_main.valid
        || !this.form.password_sub.valid) {
        this.simpleOut.createToast("Passwords not valid").present();

        return;
      }
      // all inputs were propper
      try {
        // try to sign up the user
        this.loadingRegister = true;
        const res = await this.authP.signUpUser(this.form.email.text,
          this.form.password_main.text);
        if (res) {
          // initial sign up successful
          const updateRes = await res.updateProfile({
            displayName: this.form.name.text,
            photoURL: null
          });
          let dateReg = new Date();
          let dispDateReg = dateReg.getDate().toString() + "-"
            + (dateReg.getMonth() + 1).toString() + "-"
            + dateReg.getFullYear().toString().substr(2, 3);

          let data = {
            rawJoinDate: dateReg,
            joinDate: dispDateReg
          }

          const dbRes = await this.af.firestore.doc("users/" + res.uid + "/"
            + Const.FS.USER_RECORDS + "/" + Const.FS.USER_RECORDS).set(data);

          if (updateRes == undefined && dbRes) {
            console.log("Profile update successful");
            this.form.password_main.text = ""; this.form.password_sub.text = "";
          }
          this.loadingRegister = false; // stop the spinner

          this.simpleOut.createToast("You are ready to log in!", 1000).present();

          this.viewCtrl.dismiss({
            statCode: Const.STATCODE.SUCCESS,
            email: this.form.email.text
          });
        }
      } catch (e) {
        this.authP.handleAuthError(e);
        this.viewCtrl.dismiss({ statCode: Const.STATCODE.FAIL });
      } finally {
        this.loadingRegister = false;
      }

    } else {
      this.simpleOut.createToast("Please fill in the sign up sheet!").present();
      return;
    }
  }

  /**
   * This is run automatically on blur of each input field.
   * Once this is called, it validates that input field, and dispalys
   * the color.
   * @param what the input field to validate.
   */
  validate(what: number) {
    console.log("validating inputs...");
    if (what == 0) {
      // validating email
      if (!this.validateEmail(this.form.email.text)) {
        this.form.email.valid = false;
      } else {
        this.form.email.valid = true;
      }
    } else if (what == 2) {
      // validating password main
      if (this.form.password_main.text.length < 5) {
        this.form.password_main.valid = false;
      } else {
        this.form.password_main.valid = true;
      }
    } else if (what == 3) {
      // validating password sub
      if (!this.form.password_sub
        || this.form.password_sub.text != this.form.password_main.text) {
        this.form.password_sub.valid = false;
      } else {
        this.form.password_sub.valid = true;
      }
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
