import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { CustomNavigationClient } from './helpers/CustomNavigationClient';
import { AccountInfo, EventMessage, EventType } from '@azure/msal-browser';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit,OnDestroy {
  isIframe = false;
  private readonly _destroying$ = new Subject<void>();
  constructor(private router: Router,
              private msalService: MsalService,
              private iab: InAppBrowser,
              private msalBroadcastService: MsalBroadcastService) {
    this.msalService.instance.setNavigationClient(new CustomNavigationClient(this.iab));
  }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    if(!this.isLoggedIn()){
      this.router.navigate(['/login']);
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
  }

  isLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
