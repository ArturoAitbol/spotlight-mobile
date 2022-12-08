import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { ROUTER_MOCK } from '../../test/components/utils/router.mock';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { MSAL_SERVICE_MOCK } from 'src/test/services/msal.service.mock';
import { EventType, InteractionType, RedirectRequest } from '@azure/msal-browser';
import { MsalBroadcastServiceMock } from 'src/test/services/msal-broadcast.service.mock';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Capacitor } from '@capacitor/core';
import { IN_APP_BROWSER_MOCK } from 'src/test/components/utils/in-app-browser.mock';
import { Component } from '@angular/core';
import { Constants } from '../helpers/constants';

const msalGuardConfig = {
  interactionType: InteractionType.Redirect,
  authRequest: {
      scopes: ['user.read']
  }
}

@Component({
  selector: 'app-loading',
  template: '<p>Loading Page Mock</p>'
})
class LoadingPageMock {}

const MSAL_BROADCAST_SERVICE_MOCK = new MsalBroadcastServiceMock(EventType.LOGIN_START);

const fileMock = { applicationDirectory : 'public'}


const defaultTestBedConfig = {
  declarations: [ LoginPage, LoadingPageMock],
  imports: [IonicModule.forRoot()],
  providers: [
    {
      provide: Router,
      useValue: ROUTER_MOCK
    },
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
      provide: MSAL_GUARD_CONFIG,
      useValue: msalGuardConfig
    },
    {
      provide: File,
      useValue: fileMock
    }
  ]
}

let component: LoginPage;
let fixture: ComponentFixture<LoginPage>;

const beforeEachFunction = () => {
  TestBed.configureTestingModule(defaultTestBedConfig).compileComponents();

  fixture = TestBed.createComponent(LoginPage);
  component = fixture.componentInstance;
}

describe('LoginPage', () => {

  beforeEach(waitForAsync(beforeEachFunction));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display essential UI and components',()=>{
    fixture.detectChanges();
    const signInTitle: HTMLElement = fixture.nativeElement.querySelector('.signInTitle');
    const loginButton: HTMLElement = fixture.nativeElement.querySelector('.loginButton');
    const disclaimer: HTMLElement = fixture.nativeElement.querySelector('.disclaimer');
    const copyright: HTMLElement = fixture.nativeElement.querySelector('#copyright');

    expect(signInTitle.textContent).toBe('Spotlight');
    expect(loginButton.textContent).toContain('Login');
    expect(disclaimer.textContent).toContain('By clicking Login, I agree to the');
    expect(copyright.textContent).toContain('2022 tekVizion PVS inc. All Rights Reserved');
  });

  it('should navigate to "/" if there is a user logged in', () => {
    spyOn(ROUTER_MOCK,'navigate');
    fixture.detectChanges();
    expect(ROUTER_MOCK.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should called msal loginRedirect method with authRequest as parameter when calling login()', () => {
    spyOn(MSAL_SERVICE_MOCK, 'loginRedirect');
    fixture.detectChanges();
    // When
    component.login();
    // Then
    expect(MSAL_SERVICE_MOCK.loginRedirect).toHaveBeenCalledWith(msalGuardConfig.authRequest as RedirectRequest);
  });

  it('should show the loading page after an msal operation',fakeAsync(() => {
    spyOn(localStorage,'removeItem').and.callThrough();
    localStorage.setItem(Constants.MSAL_OPERATION,'start');
    // When
    fixture.detectChanges();
    // Then
    expect(component.loading_status).toBeTruthy();
    tick(3000);
    expect(component.loading_status).toBeFalsy();
    expect(component.loading_status).toBeFalsy();
    expect(localStorage.removeItem).toHaveBeenCalledWith(Constants.MSAL_OPERATION);
  }));

  it('should open the privacy.html document in a new window when calling openPrivacyFile() from a web browser',() => {
    spyOn(window,'open').and.callThrough();
    fixture.detectChanges();
    // When
    component.openPrivacyFile();
    // Then
    expect(window.open).toHaveBeenCalledWith('assets/privacy.html', jasmine.any(String), jasmine.any(String));
  });

  it('should open the privacy.html document in an inAppBrowser when calling openPrivacyFile() from a navite platform (Android,IOS)',() => {
    spyOn(IN_APP_BROWSER_MOCK,'create');
    spyOn(Capacitor,'isNativePlatform').and.returnValue(true);
    fixture.detectChanges();
    // When
    component.openPrivacyFile();
    // Then
    expect(IN_APP_BROWSER_MOCK.create).toHaveBeenCalledWith(fileMock.applicationDirectory+"public/assets/privacy.html",'_blank',jasmine.any(Object));
  });
});

describe('Login Page',()=>{
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(defaultTestBedConfig).compileComponents();
    TestBed.overrideProvider(MSAL_GUARD_CONFIG, {
      useValue:{}
    });
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  it('should called msal loginRedirect method without parameters when calling login() if MSAL_GUARD_CONFIG is not defined', () => {
    spyOn(MSAL_SERVICE_MOCK, 'loginRedirect');
    // When
    component.login();
    // Then
    expect(MSAL_SERVICE_MOCK.loginRedirect).toHaveBeenCalledWith();
  });
})
