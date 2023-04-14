import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ReportType } from '../helpers/report-type';
import { CtaasDashboardService } from '../services/ctaas-dashboard.service';
import { DashboardService } from '../services/dashboard.service';
import { DataRefresherService } from '../services/data-refresher.service';
import { IonToastService } from '../services/ion-toast.service';
import { SubaccountService } from '../services/subaccount.service';
import { CtaasSetupService } from '../services/ctaasSetup.service';
import { ISetup } from '../model/setup.model';
import { Constants } from '../helpers/constants';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  serviceName:string;
  isiOS = false;
  charts: any[] = [];
  reports: any = {};

  subaccountId: string = null;

  isChartsDataLoading: boolean = true;
  hasDashboardDetails: boolean = false;

  readonly DAILY: string = 'daily';
  readonly WEEKLY: string = 'weekly';
  selectedPeriod: string = this.DAILY;

  foregroundSubscription: Subscription;
  getSubaccountSubscription: Subscription;
  forkJoinSubscription: Subscription;
  getSubaccountIsSubscribed = false;
  forkJoinIsSubscribed = false;
  firstLoad = false;
  ctaasSetupDetails: any = {};
  setupStatus = '';
  isOnboardingComplete: boolean;
  maintenance = false;
  maintenanceAlert = {
    title: Constants.MAINTENANCE_MODE_ALERT_TITLE,
    message: Constants.MAINTENANCE_MODE_ALERT_MESSAGE
  };
  
  constructor(private ctaasDashboardService: CtaasDashboardService,
    private subaccountService: SubaccountService,
    private ionToastService: IonToastService,
    private foregroundService: DataRefresherService,
    private dashboardService: DashboardService,
    private ctaasSetupService: CtaasSetupService
    ) {
      this.foregroundSubscription = this.foregroundService.backToActiveApp$.subscribe(()=>{
        if(this.getSubaccountSubscription){
          this.getSubaccountSubscription.unsubscribe();
          this.getSubaccountIsSubscribed = false;
        }
        if(this.forkJoinSubscription){
          this.forkJoinSubscription.unsubscribe();
          this.forkJoinIsSubscribed = false;
        }
        this.fetchData();
      });
  }

  ngOnInit(): void {
    this.firstLoad = true;
    this.serviceName = 'Spotlight';
    this.isiOS = /iPhone/i.test(window.navigator.userAgent);
    this.fetchData();
  }

  ionViewWillEnter(){
    window.screen.orientation.lock('portrait');
    if(!this.firstLoad)
      this.fetchData();
  }

  ionViewWillLeave(){
    this.firstLoad = false;
    if(this.getSubaccountSubscription){
      this.getSubaccountSubscription.unsubscribe();
      this.getSubaccountIsSubscribed = false;
    }
    if(this.forkJoinSubscription){
      this.forkJoinSubscription.unsubscribe();
      this.forkJoinIsSubscribed = false;
    }
  }

  ngOnDestroy(): void {
    if (this.foregroundSubscription)
      this.foregroundSubscription.unsubscribe();
    if(this.getSubaccountSubscription)
      this.getSubaccountSubscription.unsubscribe();
    if(this.forkJoinSubscription)
      this.forkJoinSubscription.unsubscribe();
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
    if(!this.getSubaccountIsSubscribed){
      this.getSubaccountSubscription = this.ctaasSetupService.getSubaccountCtaasSetupDetails(this.subaccountId).subscribe((response: { ctaasSetups: ISetup[] }) => {
        this.getSubaccountIsSubscribed = true;
        this.ctaasSetupDetails = response['ctaasSetups'][0];
        const { onBoardingComplete, status, maintenance } = this.ctaasSetupDetails;
        this.isOnboardingComplete = onBoardingComplete;
        this.setupStatus = status;
        this.maintenance = maintenance;
        if(!this.forkJoinIsSubscribed)
          this.forkJoinSubscription = forkJoin(requests).subscribe((res: [{ response?: string, error?: string }]) => {
            this.forkJoinIsSubscribed = true;
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
                if (maintenance) {
                  this.selectedPeriod = this.WEEKLY;
                  this.charts = this.reports[this.WEEKLY];
                }else{
                  this.charts = this.reports[this.DAILY];
                }
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
      });
    }
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
    }
  }
}
