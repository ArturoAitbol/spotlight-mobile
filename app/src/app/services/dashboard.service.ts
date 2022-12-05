import { Injectable } from '@angular/core';
import { Constants } from '../helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private currentReports: any;

  constructor() { }

  
  //set current reports identifiers (type, timestamp)
  setReports(reports: any) {
    localStorage.setItem(Constants.CURRENT_REPORTS, JSON.stringify(reports)),
    this.currentReports = reports;
  }

  //get current reports identifiers
  getReports() : any {
    return (this.currentReports) ? this.currentReports : JSON.parse(localStorage.getItem(Constants.CURRENT_REPORTS));
  }


}
