import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {

  constructor(private msalService: MsalService) { }

  logout(){
    if (this.msalService.instance.getActiveAccount() != null) {
      this.msalService.logoutRedirect();
    }
  }
}
