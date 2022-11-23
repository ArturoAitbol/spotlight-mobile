import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { EventMessage, EventType, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Capacitor } from '@capacitor/core';
import { Constants } from '../helpers/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  waitingForMsAuth: boolean;
  loading_status: boolean = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(private router: Router,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private iab: InAppBrowser,
    private file: File) {
  }

  ngOnInit(): void {
    if (this.msalService.instance.getActiveAccount() != null) {
      this.router.navigate(['/']);
    }

    if (localStorage.getItem(Constants.MSAL_OPERATION)) {
      this.loading_status = true;
      setTimeout(() => {
        this.loading_status = false;
      }, 3000);
      localStorage.removeItem(Constants.MSAL_OPERATION);
    }

    this.msalBroadcastService.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_START),
        takeUntil(this._destroying$))
      .subscribe((result: EventMessage) => {
        this.waitingForMsAuth = false;
      })
  }

  login() {
    sessionStorage.clear();
    this.waitingForMsAuth = true;
    if (this.msalGuardConfig.authRequest) {
      this.msalService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }

  async openPrivacyFile() {
    if (Capacitor.isNativePlatform()) {
      this.iab.create(this.file.applicationDirectory + "public/assets/privacy.html", '_blank', {
        location: 'no',
        clearcache: 'yes',
        clearsessioncache: 'yes',
        hidenavigationbuttons: 'yes',
        hideurlbar: 'yes',
        fullscreen: 'yes'
      });
    } else {
      var w = window.open('assets/privacy.html', 'Print preview : Privacy Policy', 'width=750,height=720,scrollbars=yes,top=0,left=0');
      w.focus();
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
