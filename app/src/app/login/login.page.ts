import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { EventMessage, EventType, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

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
              @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration) { 
  }

  ngOnInit(): void {
    if(this.msalService.instance.getActiveAccount() != null){
      this.router.navigate(['/']);
    }

    if(localStorage.getItem("msal-operation")){
      this.loading_status = true;
      setTimeout(() => {
        this.loading_status = false;
      }, 3000);
      localStorage.removeItem("msal-operation");
    }

     this.msalBroadcastService.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_START),
      takeUntil(this._destroying$))
      .subscribe((result: EventMessage)=>{
        console.debug('login start...');
        this.waitingForMsAuth = false;
      })
  }

  login() {
    sessionStorage.clear();
    this.waitingForMsAuth = true;
    if (this.msalGuardConfig.authRequest){
      this.msalService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
