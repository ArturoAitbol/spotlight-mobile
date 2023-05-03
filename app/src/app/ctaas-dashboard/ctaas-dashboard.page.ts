import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IReportEmbedConfiguration, models, service } from 'powerbi-client';
import { IonToastService } from '../services/ion-toast.service';
import { IPowerBiReponse } from 'src/app/model/powerbi-response.model';
import { SubaccountService } from '../services/subaccount.service';
import { MsalService } from '@azure/msal-angular';
import { CtaasDashboardService } from 'src/app/services/ctaas-dashboard.service';
import { CtaasSetupService } from '../services/ctaasSetup.service';
import { ISetup } from '../model/setup.model';
import { Constants } from '../helpers/constants';

@Component({
  selector: 'app-ctaas-dashboard',
  templateUrl: './ctaas-dashboard.page.html',
  styleUrls: ['./ctaas-dashboard.page.scss'],
})
export class CtaasDashboardPage implements OnInit {
  isiOS = false;
  readonly LEGACY_MODE: string = 'legacy_view';
  readonly POWERBI_MODE: string = 'powerbi_view';
  readonly REPORT_TYPE: string = 'report';
  readonly DAILY: string = 'daily';
  readonly WEEKLY: string = 'weekly';
  selectedPeriod: string = this.DAILY;
  private subaccountDetails: any;
  featureToggleKey: string = 'daily';
  subaccountId: string = null;
  hasDashboardDetails = false;
  phasedEmbeddingFlag = false;
  reportClass = 'report-container';
  isLoadingResults = false;
  powerBiEmbeddingFlag: boolean = false;
  serviceName:string;
  charts: any[] = [];
  reports: any = {};
  enableEmbedTokenCache: boolean = true;
  powerbiReportResponse: {
    daily: { embedUrl: string, embedToken: string },
    weekly: { embedUrl: string, embedToken: string }
  };
  reportConfig: IReportEmbedConfiguration = {
    type: "report",
    embedUrl: undefined,
    accessToken: undefined,
    tokenType: models.TokenType.Embed,
    hostname: "https://app.powerbi.com",
    settings: {
        filterPaneEnabled: false,
        navContentPaneEnabled: false,
        layoutType: models.LayoutType.Custom,
        customLayout: {
            displayOption: models.DisplayOption.FitToWidth
        }
    },
    viewMode: models.ViewMode.View
  };
  ctaasSetupDetails: any = {};
  setupStatus = '';
  isOnboardingComplete: boolean;
  maintenance = false;
  maintenanceAlert = {
    title: Constants.MAINTENANCE_MODE_ALERT_TITLE,
    message: Constants.MAINTENANCE_MODE_ALERT_MESSAGE
  };
  
  constructor(private ionToastService: IonToastService, 
    private httpClient: HttpClient, 
    private subaccountService: SubaccountService,
    private ctaasDashboardService: CtaasDashboardService,
    private msalService: MsalService,
    private ctaasSetupService: CtaasSetupService) {
    this.subaccountId = this.subaccountService.getSubAccount().id;
  
  }

  ngOnInit() {
    this.serviceName = 'Spotlight Power BI';
    this.isiOS = /iPhone/i.test(window.navigator.userAgent);
    this.subaccountDetails = this.subaccountService.getSelectedSubAccount();
  }

  ionViewWillEnter(){
    window.screen.orientation.unlock();
    window.screen.orientation.lock('landscape');
    this.viewDashboardByMode();
  }
  ionViewWillLeave(){
    window.screen.orientation.unlock();
    window.screen.orientation.lock('portrait-primary');
    window.screen.orientation.unlock();
  }

  configurePowerbiEmbeddedReport(embedUrl: string, accessToken: string) {
    if (embedUrl && accessToken) {
      this.reportConfig = {
          ... this.reportConfig,
          embedUrl,
          accessToken
      };
      this.hasDashboardDetails = true;
    }
  }

  eventHandlersMap = new Map<string, (event?: service.ICustomEvent<any>) => void>([
    ['loaded', () => console.debug('Report has loaded')],
    [
        'rendered',
        () => {
            console.debug('Report has rendered');
        },
    ],
    [
        'error',
        (event?: service.ICustomEvent<any>) => {
            if (event) {
                console.error(event.detail);
                const { detail: { message, errorCode } } = event;
                if (message && errorCode && message === 'TokenExpired' && errorCode === '403') {
                    this.setPbiReportDetailsInSubaccountDetails(null);
                    this.fetchSpotlightPowerBiDashboardDetailsBySubaccount();
                }
            }
        },
    ],
    ['visualClicked', () => console.debug('visual clicked')],
    ['pageChanged', () => console.debug('Page changed')]
]);
  
  fetchSpotlightPowerBiDashboardDetailsBySubaccount(): Promise<any> {
    if (this.enableEmbedTokenCache) {
      const { pbiReport } = this.subaccountDetails;
      if (pbiReport) {
          return new Promise((resolve, reject) => {
              try {
                  const { daily, weekly } = pbiReport;
                  this.powerbiReportResponse = { daily, weekly };
                  resolve("API request is successful!");
              } catch (error) {
                  this.powerbiReportResponse = undefined;
                  reject("API request is failed!");
              }
          });
      }
    }
    return new Promise((resolve, reject) => {
        this.powerbiReportResponse = undefined;
        this.isLoadingResults = true;
        this.hasDashboardDetails = false;
        this.ctaasDashboardService.getCtaasPowerBiDashboardDetails(this.subaccountId)
            .subscribe((response: { powerBiInfo: IPowerBiReponse }) => {
                this.isLoadingResults = false;
                const { daily, weekly } = response.powerBiInfo;
                this.powerbiReportResponse = { daily, weekly };
                this.subaccountDetails = { ... this.subaccountDetails, pbiReport: { daily, weekly } };
                this.setPbiReportDetailsInSubaccountDetails({ daily, weekly });
                resolve("API request is successful!");
            }, (err) => {
                this.hasDashboardDetails = false;
                this.isLoadingResults = false;
                console.error('Error while loading embedded powerbi report: ', err);
                this.setPbiReportDetailsInSubaccountDetails(null);
                this.ionToastService.presentToast('Error loading dashboard, please connect tekVizion admin', 'Ok');
                reject("API request is failed!");
            });
    });
  }


  async viewDashboardByMode(): Promise<any> {
    if (!this.powerbiReportResponse) 
        await this.fetchSpotlightPowerBiDashboardDetailsBySubaccount();
    if (this.powerbiReportResponse) {
      this.ctaasSetupService.getSubaccountCtaasSetupDetails(this.subaccountId).subscribe((response: { ctaasSetups: ISetup[] }) => {
        this.ctaasSetupDetails = response['ctaasSetups'][0];
        const { onBoardingComplete, status, maintenance } = this.ctaasSetupDetails;
        this.isOnboardingComplete = onBoardingComplete;
        this.setupStatus = status;
        this.maintenance = maintenance;
        if (maintenance) {
          this.featureToggleKey = 'weekly';
        }
        this.hasDashboardDetails = true;
        const { daily, weekly } = this.powerbiReportResponse;
        if (this.featureToggleKey === this.DAILY) {
            const { embedUrl, embedToken } = daily;
            this.configurePowerbiEmbeddedReport(embedUrl, embedToken);
        } else if (this.featureToggleKey === this.WEEKLY) {
            const { embedUrl, embedToken } = weekly;
            this.configurePowerbiEmbeddedReport(embedUrl, embedToken);
        }
      });
    } else {
        this.hasDashboardDetails = false;
    }
    this.powerBiEmbeddingFlag = true;
  }

  setPbiReportDetailsInSubaccountDetails(data: { daily: any, weekly: any } | null): void {
    this.subaccountDetails = { ... this.subaccountDetails, pbiReport: data };
    this.subaccountService.setSelectedSubAccount(this.subaccountDetails);
  }

  onClickToggleButton(selectedPeriod: string){
    this.featureToggleKey = selectedPeriod;
    this.viewDashboardByMode();
  }

  private getAccountDetails(): any | null {
    return this.msalService.instance.getActiveAccount() || null;
  }
}
