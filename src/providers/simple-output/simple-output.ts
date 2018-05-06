import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, AlertController } from 'ionic-angular';

/*
  Generated class for the SimpleOutputProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SimpleOutputProvider {

  constructor(public http: HttpClient, public toastCtrl: ToastController,
  public alertCtrl: AlertController) {  }

  
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

  getToastCtrl(): ToastController {
    return this.toastCtrl;
  }

  getAlertCtrl(): AlertController {
    return this.alertCtrl;
  }

}
