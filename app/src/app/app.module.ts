import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MsalGuard, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: environment.UI_CLIENT_ID,
        authority: environment.AUTHORITY,
        redirectUri: environment.REDIRECT_URL_AFTER_LOGIN,
        postLogoutRedirectUri: environment.REDIRECT_URL_AFTER_LOGOUT
      },
      cache: {
        cacheLocation: "localStorage"
      }
    }),  {
      interactionType: InteractionType.Redirect,
      authRequest: {
          scopes: ['user.read']
      }
    }, {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
            [environment.apiEndpoint, ['api://' + environment.API_CLIENT_ID + '/' + environment.API_SCOPE]]
        ])
    })
    
  ],
  providers: [MsalGuard,InAppBrowser, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
