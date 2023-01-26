import { Injectable } from '@angular/core';
import { Capacitor} from '@capacitor/core';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token, Channel } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { AdminDeviceService } from './admin-device.service';
import { Constants } from '../helpers/constants';
import { AlertController, AlertButton } from '@ionic/angular';
import { DataRefresherService } from './data-refresher.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  constructor(private router: Router, public adminDeviceService: AdminDeviceService,
    private alertController: AlertController,private dataRefresherService: DataRefresherService) { }

  public initPush() {
    if (Capacitor.isNativePlatform()) {
      if(Capacitor.getPlatform()===Constants.ANDROID_PLATFORM){
        let channel : Channel = {
          id: 'notes-notifications',
          name: 'Notes notifications',
          importance: 4, //IMPORTANCE_HIGH
          vibration: true
        }
        PushNotifications.createChannel(channel);
      }
      this.registerPush();
    }
  }

  private registerPush() {
    let adminDeviceService = this.adminDeviceService;
    PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive === 'granted') {
        PushNotifications.register();
      } else {
        // No permission for push granted
        console.error("ERROR REGISTERING PUSH NOTIFICAITONS");
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      localStorage.setItem("deviceToken", token.value);
      let deviceToken = {
        deviceToken: token.value
      };
      adminDeviceService.createAdminDevice(deviceToken).subscribe((res)=>{
        console.log(res);
      },(err)=>{
        console.error(err);
      });
    });
    


    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
      console.error('Error: ' + error);
    });

    this.AddActionAndReceivedListeners();
  }

  public AddActionAndReceivedListeners(){
        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
        this.showInAppNotification(notification);
        if(this.router.url==='/tabs/notes')
          this.dataRefresherService.announceBackFromBackground();
     });
 
     PushNotifications.addListener(
       'pushNotificationActionPerformed',
       (actionPerformed: ActionPerformed) => {
         this.router.navigateByUrl(`/tabs/notes`);
         PushNotifications.removeAllDeliveredNotifications();
     });
  }

  public unregisterDevice(callback) {
    if (Capacitor.isNativePlatform()) {
      let deviceToken = localStorage.getItem("deviceToken");
      if (deviceToken) {
        PushNotifications.removeAllListeners();
        this.adminDeviceService.deleteAdminDevice(deviceToken).subscribe((res)=>{
          callback(true);
          console.log(res);
        },(err)=>{
          callback(false);
          console.error(err);
        });
      } else 
        callback(true);
    } else 
      callback(true);
  }

  async showInAppNotification(notification: PushNotificationSchema) {

    const buttons: AlertButton[] = [{
        text: 'OK',
        role: 'cancel',
      }]

    if(this.router.url!=='/tabs/notes'){
      buttons.push({
        text: 'Go to Notes',
        handler: () => {
          this.router.navigateByUrl('/tabs/notes');
        }
      })
    }

    const alert = await this.alertController.create({
      header: notification.title,
      message: notification.body,
      buttons: buttons,
    });

    await alert.present();

    await alert.onDidDismiss();
    PushNotifications.removeAllDeliveredNotifications();
    if(this.router.url!=='/tabs/notes')
      this.dataRefresherService.announceBackFromBackground();
  }
}