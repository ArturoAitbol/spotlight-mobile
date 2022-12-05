import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { ReportType } from '../helpers/report-type';
import { CtaasDashboardService } from '../services/ctaas-dashboard.service';
import { DashboardService } from '../services/dashboard.service';
import { IonToastService } from '../services/ion-toast.service';
import { SubaccountService } from '../services/subaccount.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  serviceName:string;
  appName:string;

  charts:any[] = [];
  
  subaccountId:string = null;

  isChartsDataLoading:boolean = true;

  constructor(private ctaasDashboardService: CtaasDashboardService,
              private subaccountService: SubaccountService,
              private ionToastService: IonToastService,
              private dashboardService: DashboardService) {}
  
  ngOnInit(): void {
    this.serviceName = 'SpotLight';
    this.appName = 'Microsoft Teams';
    this.fetchData();
  }

  fetchData(event?:any){
    this.subaccountService.getSubAccountList().subscribe((res)=>{
      if(res.subaccounts.length>0){
        this.subaccountService.setSubAccount(res.subaccounts[0]);
        this.subaccountId = this.subaccountService.getSubAccount().id;
        this.fetchCtaasDashboard(event);
      }else{
        this.isChartsDataLoading=false;
      }
    }, (err) => {
      console.error(err);
      this.isChartsDataLoading=false;
      if (event) event.target.complete();
    });
  }

  handleRefresh(event) {
    this.fetchData(event);
  };

  fetchCtaasDashboard(event?: any){
    this.isChartsDataLoading = true;
    this.charts = [];

    const requests: Observable<any>[] = [];
    for (const key in ReportType) {
      const reportType: string = ReportType[key];
      requests.push(this.ctaasDashboardService.getCtaasDashboardDetails(this.subaccountId, reportType));
    }

    forkJoin(requests).subscribe((res: [{ response?:string, error?:string }])=>{
      if(res){
        this.charts = [...res].filter((e: any) => !e.error).map((e: { response: string }) => e.response);
        if(this.charts.length>0){
          let reports = this.charts.map((chart:any)=>{
            // Destructure the chart object to save only timestampId and type attributes
            return (({ timestampId, reportType }) => ({ timestampId, reportType }))(chart);
          });
          this.dashboardService.setReports(reports);
        }
      }
      if (event) event.target.complete();
      this.isChartsDataLoading = false;
    }, (e) => {
      console.error('Error loading dashboard reports ', e.error);
      this.isChartsDataLoading = false;
      this.ionToastService.presentToast('Error loading dashboard, please connect tekVizion admin', 'Ok');
      if (event) event.target.complete();
    })
  }

}
