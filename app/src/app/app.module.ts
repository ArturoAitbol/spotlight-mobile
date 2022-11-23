import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './helpers/error.interceptor';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,HttpClientModule, IonicModule.forRoot(), AppRoutingModule,
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: environment.UI_CLIENT_ID,
        authority: environment.AUTHORITY,
        redirectUri: environment.REDIRECT_URL_AFTER_LOGIN
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
  providers: [
    MsalGuard,InAppBrowser,File,
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
