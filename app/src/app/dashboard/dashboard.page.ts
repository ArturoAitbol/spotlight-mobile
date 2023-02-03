import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ReportType } from '../helpers/report-type';
import { CtaasDashboardService } from '../services/ctaas-dashboard.service';
import { DashboardService } from '../services/dashboard.service';
import { DataRefresherService } from '../services/data-refresher.service';
import { IonToastService } from '../services/ion-toast.service';
import { SubaccountService } from '../services/subaccount.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  serviceName:string;

  charts: any[] = [];
  reports: any = {};

  subaccountId: string = null;

  isChartsDataLoading: boolean = true;
  hasDashboardDetails: boolean = false;

  readonly DAILY: string = 'daily';
  readonly WEEKLY: string = 'weekly';
  selectedPeriod: string = this.DAILY;

  foregroundSubscription: Subscription;

  constructor(private ctaasDashboardService: CtaasDashboardService,
    private subaccountService: SubaccountService,
    private ionToastService: IonToastService,
    private foregroundService: DataRefresherService,
    private dashboardService: DashboardService) {
      this.foregroundSubscription = this.foregroundService.backToActiveApp$.subscribe(()=>{
        this.fetchData();
      });
  }

  ngOnInit(): void {
    this.serviceName = 'Spotlight';
    this.fetchData();
  }

  ngOnDestroy(): void {
    if (this.foregroundSubscription)
      this.foregroundSubscription.unsubscribe();
  }

  fetchData(event?: any) {
    this.subaccountId = this.subaccountService.getSubAccount().id;
    this.fetchCtaasDashboard(event);
  }

  handleRefresh(event) {
    this.fetchData(event);
  };

  fetchCtaasDashboard(event?: any) {
    this.isChartsDataLoading = true;
    this.hasDashboardDetails = false;
    this.charts = [];
    this.reports[this.DAILY] = [];
    this.reports[this.WEEKLY] = [];
    this.dashboardService.setReports(null);

    const requests: Observable<any>[] = [];
    for (const key in ReportType) {
      const reportType: string = ReportType[key];
      requests.push(this.ctaasDashboardService.getCtaasDashboardDetails(this.subaccountId, reportType));
    }

    forkJoin(requests).subscribe((res: [{ response?: string, error?: string }]) => {
      if (res) {
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
          this.dashboardService.setReports(reportsIdentifiers);
        }
        this.dashboardService.announceDashboardRefresh();
      }
      if (event)
        event.target.complete();
      this.isChartsDataLoading = false;
    }, (e) => {
      console.error('Error loading dashboard reports ', e.error);
      this.isChartsDataLoading = false;
      this.ionToastService.presentToast('Error loading dashboard, please contact tekVizion admin', 'Ok');
      this.dashboardService.announceDashboardRefresh();
      if (event)
        event.target.complete();
    })
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
      case ReportType.WEEKLY_FEATURE_FUNCTIONALITY:
        return 'Feature Functionality & Calling Reliability';
      // case ReportType.DAILY_PESQ:
      // case ReportType.WEEKLY_PESQ:
      //   return 'PESQ'; disabling for now until mediastats are ready
    }
  }
}
