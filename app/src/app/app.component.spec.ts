import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventType } from '@azure/msal-browser';
import { Capacitor } from '@capacitor/core';
import { routerMock } from 'src/test/components/utils/router.mock';
import { IN_APP_BROWSER_MOCK } from 'src/test/components/utils/in-app-browser.mock';
import { MsalBroadcastServiceMock } from 'src/test/services/msal-broadcast.service.mock';
import { MSAL_SERVICE_MOCK } from 'src/test/services/msal.service.mock';

import { AppComponent } from './app.component';

const MSAL_BROADCAST_SERVICE_MOCK = new MsalBroadcastServiceMock(EventType.LOGIN_SUCCESS);

const ROUTER_MOCK = new routerMock(new NavigationEnd(1,'/login','/'));

let app: AppComponent;
let fixture: ComponentFixture<AppComponent>;

const defaultTestBedConfig = {
  declarations: [AppComponent],
  providers:[
    {
      provide: MsalService,
      useValue: MSAL_SERVICE_MOCK
    },
    {
      provide: MsalBroadcastService,
      useValue: MSAL_BROADCAST_SERVICE_MOCK
    },
    {
      provide: InAppBrowser,
      useValue: IN_APP_BROWSER_MOCK
    },
    {
      provide: Router,
      useValue: ROUTER_MOCK
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
}

const beforeEachFunction = () => {
  TestBed.configureTestingModule(defaultTestBedConfig).compileComponents();

  fixture = TestBed.createComponent(AppComponent);
  app = fixture.debugElement.componentInstance;
}

describe('AppComponent', () => {

  beforeEach(waitForAsync(beforeEachFunction));

  it('should create the app', () => {
    fixture.detectChanges();
    expect(app).toBeTruthy();
  });

  it('should display essential UI and components',fakeAsync(()=>{
    fixture.detectChanges();
    const currentDate: HTMLElement = fixture.nativeElement.querySelector("#current-date");
    const logoImage: HTMLElement = fixture.nativeElement.querySelector('#logo-image');
    const userName: HTMLElement = fixture.nativeElement.querySelector("#username");
    tick(1000);
    fixture.detectChanges();
    
    const datePipe = new DatePipe('en-US');
    expect(currentDate.textContent).toBe(datePipe.transform(app.dateTime,'mediumDate'));
    expect(logoImage.getAttribute('src')).toBe('assets/images/logo_1.png');
    expect(userName.firstChild.textContent).toBe(app.salutation+ ", "+ app.getUserName());

    discardPeriodicTasks();
  }));

  it('should hide the toolbar when no user is logged in',()=>{
    fixture.detectChanges();
    let toolbar: HTMLElement = fixture.nativeElement.querySelector("#toolbar");
    expect(toolbar).toBeTruthy();

    spyOn(MSAL_SERVICE_MOCK.instance,'getActiveAccount').and.returnValue(null);
    fixture.detectChanges();
    toolbar = fixture.nativeElement.querySelector("#toolbar");
    expect(toolbar).toBeFalsy();
  });

  it('should change the color of the status bar if the app is runing on a native platform (Android)',()=>{
    spyOn(Capacitor,'isNativePlatform').and.returnValue(true);
    spyOn(app,'setStatusBarColor').and.callThrough();

    fixture.detectChanges();
    expect(app.setStatusBarColor).toHaveBeenCalledWith('#04111f');
  })

  it('should navigate to login if there is not any user logged in',()=>{
    spyOn(MSAL_SERVICE_MOCK.instance,'getActiveAccount').and.returnValue(null);
    spyOn(ROUTER_MOCK,'navigate');
    fixture.detectChanges();
    expect(ROUTER_MOCK.navigate).toHaveBeenCalledWith(['/login']);
  })

  it('should change the popover component variables when calling presentPopover()',()=>{
    const event = new Event('type');
    fixture.detectChanges();
  
    app.presentPopover(event);

    expect(app.isPopoverOpen).toBeTruthy();
    expect(app.popover.event).toEqual(event);
  })

  it('should call msalService logoutRedirect method when calling logout()',()=>{
    spyOn(MSAL_SERVICE_MOCK,'logoutRedirect');
    fixture.detectChanges();

    app.logout();

    expect(MSAL_SERVICE_MOCK.logoutRedirect).toHaveBeenCalled();
  })

  it('should call msalService logoutRedirect method when calling logout()',()=>{
    const error = new Error('some error');
    spyOn(MSAL_SERVICE_MOCK,'logoutRedirect').and.throwError(error);
    spyOn(console,'error');
    fixture.detectChanges();

    app.logout();

    expect(console.error).toHaveBeenCalledWith('error while logout: ', error);
  })

  it('should show a salutation based on the current hour of the day when calling getSalutation()',()=>{
    app.dateTime = new Date('10/2/2022 08:00:00');
    expect(app.getSalutation()).toBe('Good Morning');

    app.dateTime = new Date('10/2/2022 13:00:00');
    expect(app.getSalutation()).toBe('Good Afternoon');

    app.dateTime = new Date('10/2/2022 18:00:00');
    expect(app.getSalutation()).toBe('Good Evening');
  })

});

describe('AppComponent',()=>{
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(defaultTestBedConfig).compileComponents();
    TestBed.overrideProvider(Router, {
      useValue:new routerMock(new NavigationEnd(1,'/','/'))
    });
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
  }));

  it('should change the color of the status bar if the app is runing on a native platform (Android)',()=>{
    spyOn(Capacitor,'isNativePlatform').and.returnValue(true);
    spyOn(app,'setStatusBarColor');

    fixture.detectChanges();
    expect(app.setStatusBarColor).toHaveBeenCalledWith('#203c66');
  })
})
