import { Injectable, NgZone } from '@angular/core';
import { Capacitor} from '@capacitor/core';
// import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import {
  FirebaseMessaging,
  GetTokenOptions,
  Notification,
} from '@capacitor-firebase/messaging';import { Router } from '@angular/router';
import { AdminDeviceService } from './admin-device.service';
import { Badge } from '@capawesome/capacitor-badge';
const LOGTAG = '[FirebaseMessagingPage]';
@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {
  public token = '';
  public deliveredNotifications: Notification[] = [];

  constructor(private router: Router, public adminDeviceService: AdminDeviceService, private readonly ngZone: NgZone) { 
    FirebaseMessaging.removeAllListeners().then(() => {
      FirebaseMessaging.addListener('tokenReceived', (event) => {
        console.log(`${LOGTAG} tokenReceived`, { event });
        this.ngZone.run(() => {
          this.token = event.token;
          localStorage.setItem("deviceToken", this.token);
        });
      });
      FirebaseMessaging.addListener('notificationReceived', (event) => {
        console.log(`${LOGTAG} notificationReceived`, { event });
        this.increaseBadgeCount();
      });
      FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
        console.log(`${LOGTAG} notificationActionPerformed`, { event });
      });
    });
    if (!Capacitor.isNativePlatform()) {
      navigator.serviceWorker.addEventListener('message', (event: any) => {
        console.log(`${LOGTAG} serviceWorker message`, { event });
      });
    }
  }
  
  public initPush() {
    if (Capacitor.isNativePlatform()) {
      this.registerPush();
      this.refreshBadgeCount();
    }
  }

  private registerPush() {
    let adminDeviceService = this.adminDeviceService;


  //   PushNotifications.addListener('registration', (token: Token) => {
  //     console.log("REGISTER PUSH");
  //     console.log('My token: ', token);
  //     alert("token"+ token);
  //     localStorage.setItem("deviceToken", token.value);
  //     let deviceToken = {
  //       deviceToken: token.value
  //     };
  //     adminDeviceService.createAdminDevice(deviceToken).subscribe((res)=>{
  //       console.log(res);
  //     },(err)=>{
  //       console.error(err);
  //     });
  //   });
    
  //   PushNotifications.addListener('registrationError', (error: any) => {
  //     alert('Error on registration: ' + JSON.stringify(error));
  //     console.log('Error: ' + JSON.stringify(error));
  //   });

  //      // Show us the notification payload if the app is open on our device
  //   PushNotifications.addListener('pushNotificationReceived',
  //      (notification: PushNotificationSchema) => {
  //       this.increaseBadgeCount();
  //       console.log("Push received: " + JSON.stringify(notification));
  //       alert('Push received: ' + JSON.stringify(notification));
  //   });

  //   PushNotifications.addListener(
  //     'pushNotificationActionPerformed',
  //     (notification: ActionPerformed) => {
  //       const data = notification.notification.data;
  //       console.log('Action performed: ' + JSON.stringify(notification.notification));
  //       if (data.detailsId) {
  //         this.decreaseBadgeCount();
  //         this.router.navigateByUrl(`/home/${data.detailsId}`);
  //       }
  //   });
  }

  public async requestPermissions(): Promise<void> {
    await FirebaseMessaging.requestPermissions();
  }

  public async getToken(): Promise<void> {
    const result = await FirebaseMessaging.getToken();
    console.log("token: "+result.token);
    this.token = result.token;
  }

  public async deleteToken(): Promise<void> {
    await FirebaseMessaging.deleteToken();
    this.token = '';
  }

  public async getDeliveredNotifications(): Promise<void> {
    const result = await FirebaseMessaging.getDeliveredNotifications();
    this.deliveredNotifications = result.notifications;
  }

  public async removeAllDeliveredNotifications(): Promise<void> {
    await FirebaseMessaging.removeAllDeliveredNotifications();
    await this.getDeliveredNotifications();
  }

  public async removeDeliveredNotifications(
    notification: Notification
  ): Promise<void> {
    await FirebaseMessaging.removeDeliveredNotifications({
      notifications: [notification],
    });
    await this.getDeliveredNotifications();
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
  public async getBadgeCount(): Promise<number> {
    const result = await Badge.get();
    console.log("badge count: "+result.count);
    return result.count;
  }

  public async setBadgeCount(): Promise<void> {
    const badgeCount = localStorage.getItem("badgeCount");
    let count;
    if(count!= null)
      count = Number(badgeCount);
    else
      count = 0;
    await Badge.set({count});
    await this.refreshBadgeCount();
  }

  public async increaseBadgeCount(): Promise<void> {
    await Badge.increase();
    await this.refreshBadgeCount();
  }

  public async decreaseBadgeCount(): Promise<void> {
    await Badge.decrease();
    await this.refreshBadgeCount();
  }
  private async refreshBadgeCount(): Promise<void> {
    let deviceToken;
    const badgeCount = await this.getBadgeCount();
    localStorage.setItem("badgeCount", badgeCount.toString());
  }
}