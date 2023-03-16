import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpBackend, HttpHeaders } from '@angular/common/http';
import { Constants } from '../helpers/constants';
import { DashboardService } from '../services/dashboard.service';
import { SubaccountService } from '../services/subaccount.service';
import { PushNotificationsService } from '../services/push-notifications.service';
import { FeatureToggleService } from '../services/feature-toggle.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FeatureToggle } from "../model/feature-toggle.model";

@Component({
  selector: 'app-tabnav',
  templateUrl: './tabnav.page.html',
  styleUrls: ['./tabnav.page.scss'],
})
export class TabnavPage implements OnInit {

  private readonly API_URL: string = environment.apiEndpoint + '/featureToggles'; 
  disableNotes: boolean = true;
  subaccountId: string = null;
  isFeatureEnabled: boolean = true;
  interval: any;
  private refreshInterval = 5 * 60 * 1000;

  constructor(dashboardService: DashboardService, private pushNotificationService: PushNotificationsService, private subaccountService: SubaccountService, private featureToggleService: FeatureToggleService) {
    this.subaccountId = this.subaccountService.getSubAccount().id;
    dashboardService.dashboardRefreshed$.subscribe(()=>{
        this.disableNotes = false;
    })
   }

  ngOnInit() {
    if(localStorage.getItem(Constants.SELECTED_SUBACCOUNT))
      this.disableNotes = false;
    this.isFeatureEnabled = this.featureToggleService.isFeatureEnabled("powerbiMobileFeature", this.subaccountId);
  }

  ionViewWillEnter() {
    this.interval = setInterval(() => {
      this.featureToggleService.refreshToggles();
    }, this.refreshInterval);
  }
  public async resetBadgeCount(): Promise<void> {
    await this.pushNotificationService.resetBadgeCount();
  }

}
