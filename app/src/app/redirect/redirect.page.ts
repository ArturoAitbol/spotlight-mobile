import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeatureToggleService } from 'src/app/services/feature-toggle.service';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { SubaccountService } from 'src/app/services/subaccount.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.page.html',
  styleUrls: ['./redirect.page.scss'],
})
export class RedirectPage implements OnInit {

  constructor(private subaccountService: SubaccountService,
    private router: Router,
    private ionToastService: IonToastService,
    private featureToggleService: FeatureToggleService) { }

  ngOnInit() {
      this.featureToggleService.refreshToggles().subscribe(()=>{
        this.subaccountService.getSubAccountList().subscribe((res) => {
          if (res.subaccounts.length > 0)
            this.subaccountService.setSubAccount(res.subaccounts[0]);
          else
            this.ionToastService.presentToast('Subaccount Not found','Error');
          this.router.navigate(['/tabs/dashboard']);
        }, (err) => {
          console.error(err);
          this.ionToastService.presentToast('Subaccount Not found','Error');
          this.router.navigate(['/tabs/dashboard']);
        });
      });
  }

}
