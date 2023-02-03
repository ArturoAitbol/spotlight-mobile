import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { NoPermissionMessage } from "../model/no-permission-message.model";
import { SubAccount } from "../model/subaccount.model";
import { IonToastService } from "../services/ion-toast.service";
import { NoPermissionErrorService } from "../services/no-permission-error.service";
import { SubaccountService } from "../services/subaccount.service";

@Injectable({
  providedIn: 'root'
})
export class ServiceGuard implements CanActivate {

  constructor(private subaccountService: SubaccountService,
    private noPermissionErrorService: NoPermissionErrorService,
    private router: Router,
    private ionToastService: IonToastService){
  }

  canActivate(): boolean {
    const currentSubaccount: SubAccount = this.subaccountService.getSubAccount();
    if(currentSubaccount==null || !currentSubaccount.services?.includes('spotlight')){
      this.ionToastService.presentToast('No Spotlight Service found','Error');
      const title = 'You are not currently enrolled in the tekVizion 360 Spotlight service';
      const messages: NoPermissionMessage[] = [
        {type:'static',content:'If you believe you have received this message in error, please contact your internal tekVizion Spotlight Administration contact.'},
        {type:'dynamic',content:'If you do not know who your Administrator is, or would like to enquire about the tekVizion 360 Spotlight service, please contact tekVizion at <a href="mailto:sales@tekvizion.com">sales@tekvizion.com</a>.'},
      ]
      this.noPermissionErrorService.setError(title,messages)
      this.noPermissionErrorService.announceErrorMessageUpdate();
      this.router.navigate(['/login/no-permission']);
      return false;
    }
    return true;
  }

}
