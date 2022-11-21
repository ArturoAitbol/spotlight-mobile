import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
    providedIn:'root'
})
export class IonToastService {

    constructor(private toastController: ToastController){}

    async presentToast(message:string,position?: 'top' | 'middle' | 'bottom',duration?: number) {
        const toast = await this.toastController.create({
          message: message,
          duration: duration ? duration : 1500,
          position: position ? position : 'top'
        });
        await toast.present();
      }
}