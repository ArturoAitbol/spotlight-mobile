import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { forkJoin, Observable } from 'rxjs';
import { ReportType } from 'src/app/helpers/report-type';
import { Note } from 'src/app/model/note.model';
import { SubAccount } from 'src/app/model/subaccount.model';
import { CtaasDashboardService } from 'src/app/services/ctaas-dashboard.service';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { SubaccountService } from 'src/app/services/subaccount.service';

@Component({
  selector: 'app-historical-dashboard',
  templateUrl: './historical-dashboard.page.html',
  styleUrls: ['./historical-dashboard.page.scss'],
})
export class HistoricalDashboardPage implements OnInit {

  note:Note;
  reports: any = {};
  charts:any[] = [];

  
  readonly DAILY: string = 'daily';
  readonly WEEKLY: string = 'weekly';
  selectedPeriod: string = this.DAILY;

  subaccount:SubAccount = null;

  isChartsDataLoading:boolean = true;
  hasDashboardDetails:boolean = false;

  constructor(private ctaasDashboardService: CtaasDashboardService,
              private subaccountService: SubaccountService,
              private ionToastService: IonToastService,
              private modalCtrl: ModalController) {}
  
  ngOnInit(): void {
    if(this.note?.reports!=null){
      this.reports = this.note.reports;
      this.fetchData();
    }else{
      this.isChartsDataLoading = false;
      this.ionToastService.presentToast("No reports found","Error");
    }
  }

  fetchData(event?:any){
    this.subaccount = this.subaccountService.getSubAccount();
    if(this.subaccount){
      this.fetchCtaasDashboard(event);
    }else{
      this.ionToastService.presentToast("No subaccount found","Error");
    }
  }

  handleRefresh(event){
    this.fetchData(event);
  }

  fetchCtaasDashboard(event?: any){
    this.isChartsDataLoading = true;
    this.charts = [];
    this.hasDashboardDetails = false;
    this.reports[this.DAILY] = [];
    this.reports[this.WEEKLY] = [];

    const requests: Observable<any>[] = [];
    for(const report of this.reports){
      if (Object.values(ReportType).includes(report.reportType))
        requests.push(this.ctaasDashboardService.getCtaasDashboardDetails(this.subaccount.id, report.reportType, report.timestampId));
    }

    forkJoin(requests).subscribe((res: [{ response?:string, error?:string }])=>{
      if(res){
        const result = [...res].filter((e: any) => !e.error).map((e: { response: any }) => e.response);
        if (result.length > 0) {
          this.hasDashboardDetails = true;
          const reportsIdentifiers: any[] = []; 
          result.forEach((e) => {
              let reportIdentifier = (({ timestampId, reportType }) => ({ timestampId, reportType }))(e);
              reportsIdentifiers.push(reportIdentifier);
              if (e.reportType.toLowerCase().includes(this.DAILY))
                this.reports[this.DAILY].push({ imageBase64: e.imageBase64, reportName: this.getReportNameByType(e.reportType) });
              else if (e.reportType.toLowerCase().includes(this.WEEKLY))
                this.reports[this.WEEKLY].push({ imageBase64: e.imageBase64, reportName: this.getReportNameByType(e.reportType) });
          });

          this.charts = this.reports[this.DAILY];
        }
      }
      if(event) event.target.complete();
      this.isChartsDataLoading = false;
    },(e)=>{
      console.error('Error loading dashboard reports ', e.error);
      this.isChartsDataLoading = false;
      this.ionToastService.presentToast('Error loading dashboard, please connect tekVizion admin', 'OK');
      if(event) event.target.complete();
    })
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  /**
  * on click toggle button
  */
  onClickToggleButton(selectedPeriod: string){
    this.selectedPeriod = selectedPeriod;
    this.charts = this.reports[selectedPeriod];
  }

  /**
   * get report name by report type
   * @param reportType: string 
   * @returns: string 
   */
  getReportNameByType(reportType: string): string {
    switch (reportType) {
      case ReportType.DAILY_FEATURE_FUNCTIONALITY:
        return 'Feature Functionality';
      case ReportType.DAILY_CALLING_RELIABILITY:
        return 'Calling Reliability';
      case ReportType.DAILY_VQ:
        return 'Voice Quality User Experience';
      case ReportType.WEEKLY_FEATURE_FUNCTIONALITY:
        return 'Feature Functionality';
      case ReportType.WEEKLY_CALLING_RELIABILITY:
        return 'Calling Reliability';
      case ReportType.WEEKLY_VQ:
        return 'Voice Quality User Experience';
      // case ReportType.DAILY_PESQ:
      // case ReportType.WEEKLY_PESQ:
      //   return 'PESQ'; disabling for now until mediastats are ready
    }
  }
}
