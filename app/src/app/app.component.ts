import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { CustomNavigationClient } from './helpers/customNavigationClient';
import { AccountInfo, EventMessage, EventType } from '@azure/msal-browser';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';
import { StatusBar, StatusBarInfo } from '@capacitor/status-bar';
import { PushNotificationsService } from './services/push-notifications.service';
import { Platform } from '@ionic/angular';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { DataRefresherService } from './services/data-refresher.service';
import { IonToastService } from './services/ion-toast.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit,OnDestroy {
  isIframe = false;
  @ViewChild('popover') popover;
  isPopoverOpen = false;
  dateTime : Date;
  salutation: string;
  userInfo: any;
  private readonly _destroying$ = new Subject<void>();
  networkStatus: any;
  networkListener: PluginListenerHandle;

  constructor(private router: Router,
    private msalService: MsalService,
    private iab: InAppBrowser,
    private msalBroadcastService: MsalBroadcastService,
    private ionToastService: IonToastService,
    private foregroundService: DataRefresherService,
    private platform: Platform,
    private pushNotificationService: PushNotificationsService) {
    this.initializeApp();
    this.msalService.instance.setNavigationClient(new CustomNavigationClient(this.iab));
    this.platform.ready().then(() => {
      this.platform.resume.subscribe((e) => {
        this.foregroundService.announceBackFromBackground();
      });
    });
  }

  

  initializeApp(){
    this.platform.ready().then(()=>{
      this.pushNotificationService.initPush();
    });
  }
  ngOnInit(): void {
    this.networkListener = Network.addListener('networkStatusChange', (status) => {
      if (status.connected) {
        if (this.networkStatus && !this.networkStatus.connected) {
          this.ionToastService.presentToast('Internet connection restored', 'Connected');
          this.foregroundService.announceBackFromBackground();
        }
      } else
        this.ionToastService.presentToast('No internet connection', 'Error');
      this.networkStatus = status;
    });
    this.isIframe = window !== window.parent && !window.opener;
    if(!this.isLoggedIn()){
      this.router.navigate(['/login']);
    }
    // else{
    //     this.pushNotificationService.initPush();
    // }

    if(Capacitor.isNativePlatform()){
      this.router.events.subscribe((event: RouterEvent) => {
          if(event instanceof NavigationEnd){
            if(event.url==='/login')
              this.setStatusBarColor('#04111f');
            else
              this.setStatusBarColor('#203c66');
          }
      });
    }

    this.msalBroadcastService.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      takeUntil(this._destroying$))
      .subscribe((result: EventMessage)=>{
        const account = result.payload as AccountInfo;
        console.debug('login res: ',account);
        this.msalService.instance.setActiveAccount(account);
        if (this.isLoggedIn())
          this.router.navigate(['/']);
      });

    timer(0, 1000).subscribe(()=>{
      this.dateTime = new Date();
      this.salutation = this.getSalutation();
    });
  }

  async setStatusBarColor(color:string) {
    await StatusBar.setBackgroundColor({ color: color });
  };


  isLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isPopoverOpen = true;
  }

  getUserName(): string{
    return this.msalService.instance.getActiveAccount().name;
  }

  getSalutation(): string{
    const currentHour = this.dateTime.getHours();
    if(currentHour < 12)
      return 'Good Morning'
    if(currentHour >= 12 && currentHour < 17)
      return 'Good Afternoon'
    if(currentHour >=17 && currentHour < 24)
      return 'Good Evening'
  }

  logout(){
    if (this.msalService.instance.getActiveAccount() != null) {
      try {
        this.msalService.logoutRedirect();
        localStorage.clear();
      } catch (error) {
          console.error('error while logout: ', error);
      }
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    if (this.networkListener) {
      this.networkListener.remove;
    }
  }
}
