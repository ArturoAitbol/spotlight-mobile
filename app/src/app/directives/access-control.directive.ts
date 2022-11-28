import { Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { permissions } from '../security/role-permissions';

@Directive({
  selector: '[lcAccessControl]'
})
export class AccessControlDirective implements OnInit {

  @Input() lcAccessControl: string;

  constructor(
    private msalService:MsalService,
    private viewContainerRef:ViewContainerRef,
    private templateRef:TemplateRef<any>) {}

  ngOnInit(): void {
    if(this.isAuthorized())
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    else
      this.viewContainerRef.clear();
  }

  isAuthorized():boolean{
    const roles = this.msalService.instance.getActiveAccount().idTokenClaims["roles"];
    const premissionsMatch = roles?.findIndex((role : string) => permissions[role]? permissions[role].elements.indexOf(this.lcAccessControl) !==-1 : false);
    return (premissionsMatch >= 0);
  }

}
