import { Injectable } from '@angular/core';
import { Capacitor} from '@capacitor/core';
import { PushNotifications, PushNotificationToken, PushNotificationActionPerformed, PushNotification } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { AdminDeviceService } from './admin-device.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  constructor(private router: Router, private adminDeviceService: AdminDeviceService) { }

  public initPush() {
    if (Capacitor.isNativePlatform()) {
      this.registerPush();
    }
  }

  private registerPush() {
    PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive) {
        PushNotifications.addListener('registration', (token: PushNotificationToken) => {
          let tokenString = JSON.stringify(token);
          console.log("REGISTER PUSH");
          console.log('My token: ' + tokenString);
          localStorage.setItem("deviceToken", tokenString);
          let deviceToken = {
            deviceToken: tokenString
          };
          this.adminDeviceService.createAdminDevice(deviceToken);
        });
        PushNotifications.register();
      } else {
        // No permission for push granted
        console.log("ERROR REGISTERING PUSH NOTIFICAITONS");
      }
    });

    

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.detailsId) {
          this.router.navigateByUrl(`/home/${data.detailsId}`);
        }
      }
    );
  }

  public unregisterDevice() {
    if (Capacitor.isNativePlatform()) {
      let deviceToken = localStorage.getItem("deviceToken");
      if (deviceToken)
        this.adminDeviceService.deleteAdminDevice(deviceToken);
    }
  }
}