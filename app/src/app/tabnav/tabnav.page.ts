import { Component, OnInit } from '@angular/core';
import { Constants } from '../helpers/constants';
import { DashboardService } from '../services/dashboard.service';
import { PushNotificationsService } from '../services/push-notifications.service';
@Component({
  selector: 'app-tabnav',
  templateUrl: './tabnav.page.html',
  styleUrls: ['./tabnav.page.scss'],
})
export class TabnavPage implements OnInit {

  disableNotes: boolean = true;

  constructor(dashboardService: DashboardService, private pushNotificationService: PushNotificationsService) {
    dashboardService.dashboardRefreshed$.subscribe(()=>{
        this.disableNotes = false;
    })
   }

  ngOnInit() {
   if(localStorage.getItem(Constants.SELECTED_SUBACCOUNT))
    this.disableNotes = false;
  }
  public async resetBadgeCount(): Promise<void> {
    await this.pushNotificationService.resetBadgeCount();
  }

}
