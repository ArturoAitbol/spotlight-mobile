import { NavigationClient } from "@azure/msal-browser";
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Capacitor } from "@capacitor/core";
import { environment } from "src/environments/environment";
import { Constants } from "./constants";
import { Router } from "@angular/router";
import { AutoLogoutService } from "../services/auto-logout.service";

export class CustomNavigationClient extends NavigationClient {

  msalFlowCompleted: boolean = false;

  constructor(private iab: InAppBrowser, private router: Router, private autoLogoutService: AutoLogoutService) {
    super();
  }

  async navigateExternal(url: string, options: any) {
    localStorage.setItem(Constants.MSAL_OPERATION, "start");
    if (Capacitor.isNativePlatform()) {
      const browser = this.iab.create(url, '_blank', {
        location: 'no',
        clearcache: 'yes',
        clearsessioncache: 'yes',
        hidenavigationbuttons: 'yes',
        hideurlbar: 'yes',
        fullscreen: 'yes',
        closebuttoncaption: 'x'
      });
      browser.on('loadstart').subscribe(event => {
        if (event.url.includes('#code')) {
          //Go back to the app view with the parameters returned by microsoft
          browser.close();
          this.msalFlowCompleted = true;
          const urlDomain = event.url.split('#')[0];
          const url = event.url.replace(urlDomain, environment.REDIRECT_URL_APP);
          window.location.href = url;
        }
        if (event.url.includes('logoutsession')) {
          browser.close();
          this.msalFlowCompleted = true;
          window.location.href = environment.REDIRECT_URL_APP;
        }
      });

      browser.on('exit').subscribe(() => {
        if(!this.msalFlowCompleted){
          sessionStorage.clear();
          localStorage.removeItem(Constants.MSAL_OPERATION);
          if(this.router.url!=='/login'){
            this.autoLogoutService.logout();
          }
        }
      });
    } else {
      if (options.noHistory)
        window.location.replace(url);
      else
        window.location.assign(url);
    }
    return true;
  }
}
