import { Component, OnInit } from '@angular/core';
import { Constants } from '../helpers/constants';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-tabnav',
  templateUrl: './tabnav.page.html',
  styleUrls: ['./tabnav.page.scss'],
})
export class TabnavPage implements OnInit {

  disableNotes: boolean = true;

  constructor(dashboardService: DashboardService) {
    dashboardService.dashboardRefreshed$.subscribe(()=>{
        this.disableNotes = false;
    })
   }

  ngOnInit() {
   if(localStorage.getItem(Constants.SELECTED_SUBACCOUNT))
    this.disableNotes = false;
  }

}
