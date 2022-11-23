import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
    providedIn:'root'
})
export class IonToastService {

    constructor(private toastController: ToastController){}

    async presentToast(message:string,dismissButtonText?:string,position?: 'top' | 'middle' | 'bottom',duration?: number) {
        const toast = await this.toastController.create({
          message: message,
          cssClass: 'custom-toast',
          duration: duration ? duration : 2000,
          position: position ? position : 'top',
          buttons: dismissButtonText ? [ {
              text: dismissButtonText,
              role: 'cancel'
            }]:null
        });
        await toast.present();
      }
}