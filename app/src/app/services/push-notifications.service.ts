import { Injectable, NgZone } from '@angular/core';
import { Capacitor} from '@capacitor/core';
// import { ActionPerformed, PushNotificationSchema, PushNotifications, Token, Channel } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { AdminDeviceService } from './admin-device.service';
import { Constants } from '../helpers/constants';
import { AlertController, AlertButton } from '@ionic/angular';
import { DataRefresherService } from './data-refresher.service';
import { Badge } from '@capawesome/capacitor-badge';
import { FirebaseMessaging, GetTokenOptions, Notification } from '@capacitor-firebase/messaging';

const LOGTAG = '[FirebaseMessagingPage]';
@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {
  public token = '';
  public deliveredNotifications: Notification[] = [];

  constructor(private router: Router, public adminDeviceService: AdminDeviceService,
    private alertController: AlertController,private dataRefresherService: DataRefresherService, private readonly ngZone: NgZone) { }

  public initPush() {
    if (Capacitor.isNativePlatform()) {
      // if(Capacitor.getPlatform()===Constants.ANDROID_PLATFORM){
      //   let channel : Channel = {
      //     id: 'notes-notifications',
      //     name: 'Notes notifications',
      //     importance: 4, //IMPORTANCE_HIGH
      //     vibration: true
      //   }
      //   PushNotifications.createChannel(channel);
      // }
      this.registerPush();
      this.refreshBadgeCount();
    }
  }

  private registerPush() {
    let adminDeviceService = this.adminDeviceService;
    FirebaseMessaging.requestPermissions().then(function(permission){
      if(permission.receive === "granted"){
        FirebaseMessaging.addListener('tokenReceived', (event) => {
          let deviceToken = {
            deviceToken: event.token
          };
          console.log("new token: " +deviceToken);
          localStorage.setItem("deviceToken", event.token);
          adminDeviceService.createAdminDevice(deviceToken).subscribe((res)=>{
            console.log(res);
          },(err)=>{
            console.error(err);
          });
        });
      }
      else{
        console.error("ERROR REGISTERING PUSH NOTIFICAITONS");
      }
    });
    this.AddActionAndReceivedListeners();
  }

  public AddActionAndReceivedListeners(){
    FirebaseMessaging.addListener('notificationReceived', (event) => {
      if(event.notification.body != null)
        this.showInAppNotification(event.notification);

      if(this.router.url==='/tabs/notes')
        this.dataRefresherService.announceBackFromBackground();
      this.increaseBadgeCount();

    });
    FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
      this.router.navigateByUrl(`/tabs/notes`);
      this.resetBadgeCount();
      this.removeAllDeliveredNotifications();
    });
  }

  public async requestPermissions(): Promise<void> {
    await FirebaseMessaging.requestPermissions();
  }

  public async getToken(): Promise<void> {
    const result = await FirebaseMessaging.getToken();
    this.token = result.token;
  }
  
  public async removeAllDeliveredNotifications(): Promise<void> {
    await FirebaseMessaging.removeAllDeliveredNotifications();
    // await this.getDeliveredNotifications();
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
        FirebaseMessaging.removeAllListeners();
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

  async showInAppNotification(notification: Notification) {

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
    FirebaseMessaging.removeAllDeliveredNotifications();
    if(this.router.url!=='/tabs/notes')
      this.dataRefresherService.announceBackFromBackground();
  }


  public async getDeliveredNotifications(): Promise<void> {
    const result = await FirebaseMessaging.getDeliveredNotifications();
    this.deliveredNotifications = result.notifications;
    // return this.deliveredNotifications[this.getDeliveredNotifications.length - 1];
  }

  public async getBadgeCount(): Promise<number> {
    const result = await Badge.get();
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
  private async resetBadgeCount(): Promise<void> {
    let count = 0;
    await Badge.set({count});
    localStorage.setItem("badgeCount", count.toString());
  }
}