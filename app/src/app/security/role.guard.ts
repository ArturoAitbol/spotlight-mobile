import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { permissions } from './role-permissions';
import { IonToastService } from '../services/ion-toast.service';
import { NoPermissionMessage } from '../model/no-permission-message.model';
import { NoPermissionErrorService } from '../services/no-permission-error.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private msalService: MsalService,
    private router: Router,
    private ionToastService: IonToastService,
    private noPermissionErrorService: NoPermissionErrorService) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const idTokenClaims: any = this.msalService.instance.getActiveAccount().idTokenClaims;
    if(!idTokenClaims.roles || !this.rolesExist(idTokenClaims.roles)){
      this.ionToastService.presentToast('Role is missing', 'NOT AUTHORIZED');
      const title = 'You do not have access as role is missing';
      const message: NoPermissionMessage[] = [{type:'static',content:'Please ensure that your account is assigned to a proper role and then sign-out and sign-in again.'}];
      this.noPermissionErrorService.setError(title,message);
      this.noPermissionErrorService.announceErrorMessageUpdate();
      this.router.navigate(['/login/no-permission']);
      return false;
    }
    if (!this.isAuthorized(route, idTokenClaims.roles)) {
      this.ionToastService.presentToast('You do not have access as expected role is missing', 'NOT AUTHORIZED');
      return false;
    }
    return true;
  }

  private isAuthorized(route: ActivatedRouteSnapshot, roles: string[]): boolean{
    const path = route.url[0].path;
    const pathsMatch = roles.findIndex(role =>permissions[role] ? permissions[role].paths.indexOf(path)!==-1 : false);
    return (pathsMatch >= 0);
  }

  private rolesExist(roles:string[]):boolean{
    for (let i = 0; i < roles.length; i++) {
      if(permissions[roles[i]])
        return true;
    }
    return false;
  }
}
