import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController } from 'ionic-angular';

/*
  Generated class for the SimpleOutputProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SimpleOutputProvider {

  constructor(public http: HttpClient, public toastCtrl: ToastController,
  public alertCtrl: AlertController, public loadCtrl: LoadingController) {  }

  currToast: any; // can only be one toast at a time

  createToast(message: string, duration = 3000): any {
    if (this.currToast) { 
      console.log("yes");
      
      this.currToast.dismiss(); 
    }
    this.currToast =  this.toastCtrl.create({
      message,
      duration: duration
    });
    return this.currToast;
  }

  createAlert(message: string): any {
    return this.alertCtrl.create({
      title: message, buttons: [{ text: 'Okay' }]
    });
  }

  getToastCtrl(): ToastController {
    return this.toastCtrl;
  }

  getAlertCtrl(): AlertController {
    return this.alertCtrl;
  }

}
