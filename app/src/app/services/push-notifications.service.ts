import { Injectable } from '@angular/core';
import { Capacitor} from '@capacitor/core';
import { PushNotifications, PushNotificationToken, PushNotificationActionPerformed, PushNotification } from '@capacitor/push-notifications';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  constructor(private router: Router) { }

  initPush() {
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    }
  }

  private registerPush() {
     // This should go after login, now is only for testings
     PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.addListener(
          'registration',
          (token: PushNotificationToken) => {
            console.log("REGISTER PUSH");
            console.log('My token: ' + JSON.stringify(token));
          }
        );
        PushNotifications.register();
      } else {
        // No permission for push granted
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
}