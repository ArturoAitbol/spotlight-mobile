import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Constants } from '../helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private currentReports: any;

  // Observable source
  private dashboardRefreshedSource = new Subject<void>();

  // Observable stream
  dashboardRefreshed$ = this.dashboardRefreshedSource.asObservable();

  constructor() { }

  
  announceDashboardRefresh() {
    this.dashboardRefreshedSource.next();
  }
  
  //set current reports identifiers (type, timestamp)
  setReports(reports: any) {
    localStorage.setItem(Constants.CURRENT_REPORTS, JSON.stringify(reports));
    this.currentReports = reports;
  }

  //get current reports identifiers
  getReports() : any {
    return (this.currentReports) ? this.currentReports : JSON.parse(localStorage.getItem(Constants.CURRENT_REPORTS));
  }


}
