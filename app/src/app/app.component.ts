import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { CustomNavigationClient } from './helpers/customNavigationClient';
import { AccountInfo, EventMessage, EventType } from '@azure/msal-browser';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';
import { StatusBar, StatusBarInfo } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { PushNotificationsService } from './services/push-notifications.service';
import { Platform } from '@ionic/angular';

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

  constructor(private router: Router,
              private msalService: MsalService,
              private iab: InAppBrowser,
              private msalBroadcastService: MsalBroadcastService,
              private platform: Platform,
              private pushNotificationService: PushNotificationsService) {
    this.msalService.instance.setNavigationClient(new CustomNavigationClient(this.iab));
    this.initializeApp();
  }

  initializeApp(){
    this.platform.ready().then(()=>{
      this.pushNotificationService.initPush();
    });
  }
  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    if(!this.isLoggedIn()){
      this.router.navigate(['/login']);
    }

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
      })

      timer(0, 1000).subscribe(()=>{
        this.dateTime = new Date();
        this.salutation = this.getSalutation();
      })
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
      } catch (error) {
          console.error('error while logout: ', error);
      }
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
