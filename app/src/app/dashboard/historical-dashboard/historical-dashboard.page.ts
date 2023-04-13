import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
    if(this.note!=null){
      this.fetchData();
    }else{
      this.isChartsDataLoading = false;
      this.ionToastService.presentToast("Note not found","Error");
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

    this.ctaasDashboardService.getCtaasHistoricalDashboardDetails(this.subaccount.id,this.note.id).subscribe((res: { response:[]})=>{
      if(res){
        const reports: any[] = res.response;
        this.hasDashboardDetails = true;
        if(reports.length>0){
          for(const report of reports){
            if (Object.values(ReportType).includes(report.reportType)){
              if (report.reportType.toLowerCase().includes(this.DAILY))
                this.reports[this.DAILY].push({ imageBase64: report.imageBase64, reportName: this.getReportNameByType(report.reportType) });
              else if (report.reportType.toLowerCase().includes(this.WEEKLY))
                this.reports[this.WEEKLY].push({ imageBase64: report.imageBase64, reportName: this.getReportNameByType(report.reportType) });
            }
          }
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
