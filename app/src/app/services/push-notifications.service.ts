import { Injectable } from '@angular/core';
import { Capacitor} from '@capacitor/core';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { AdminDeviceService } from './admin-device.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  constructor(private router: Router, public adminDeviceService: AdminDeviceService) { }

  public initPush() {
    if (Capacitor.isNativePlatform()) {
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
        console.log("ERROR REGISTERING PUSH NOTIFICAITONS");
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      console.log("REGISTER PUSH");
      console.log('My token: ', token);
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
      console.log('Error: ' + JSON.stringify(error));
    });

       // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
       (notification: PushNotificationSchema) => {
        alert('Push received: ' + JSON.stringify(notification));
    });

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.detailsId) {
          this.router.navigateByUrl(`/home/${data.detailsId}`);
        }
    });
  }

  public unregisterDevice(callback) {
    if (Capacitor.isNativePlatform()) {
      let deviceToken = localStorage.getItem("deviceToken");
      if (deviceToken) {
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
}