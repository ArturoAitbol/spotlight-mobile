import { NavigationClient } from "@azure/msal-browser";
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Capacitor } from "@capacitor/core";

export class CustomNavigationClient extends NavigationClient {
    constructor(private iab: InAppBrowser) {
        super();
    }

    async navigateExternal(url: string, options: any) {
        localStorage.setItem("msal-operation","start");
        if (Capacitor.isNativePlatform()) {
          const browser = this.iab.create(url, '_blank', {
                                          location: 'yes',
                                          clearcache: 'yes',
                                          clearsessioncache: 'yes',
                                          hidenavigationbuttons: 'yes',
                                          hideurlbar: 'yes',
                                          fullscreen: 'yes'});
          browser.on('loadstart').subscribe(event => {
            if (event.url.includes('#code') || event.url.includes('logoutsession')) {
              //Go back to the app view with the parameters returned by microsoft
              browser.close();
              const urlDomain = event.url.split('#')[0];
              const url = event.url.replace(urlDomain,'http://localhost/msal-back-to-login');
              window.location.href = url;
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