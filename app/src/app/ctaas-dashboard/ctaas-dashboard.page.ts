import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { IReportEmbedConfiguration, Dashboard, models, Embed, IDashboardEmbedConfiguration, service } from 'powerbi-client';
import { EventHandler, PowerbiEmbedComponent } from './powerbi-embed/powerbi-embed.component';
import { IonToastService } from '../services/ion-toast.service';
import { IPowerBiReponse } from 'src/app/model/powerbi-response.model';
import { SubaccountService } from '../services/subaccount.service';
import { FeatureToggleService } from '../services/feature-toggle.service';
import { MsalService } from '@azure/msal-angular';
import { CtaasDashboardService } from 'src/app/services/ctaas-dashboard.service';

@Component({
  selector: 'app-ctaas-dashboard',
  templateUrl: './ctaas-dashboard.page.html',
  styleUrls: ['./ctaas-dashboard.page.scss'],
})
export class CtaasDashboardPage implements OnInit {
  
  // @Input() reportConfig!: IDashboardEmbedConfiguration;
  // @ViewChild('dashboardContainer') private containerRef!: ElementRef<HTMLDivElement>;
  isiOS = false;
  private _embed?: Embed;
  private readonly FETCH_POWERBI_DASHBOARD_REPORT_URL: string = environment.apiEndpoint+"/spotlightDashboard/";
  readonly LEGACY_MODE: string = 'legacy_view';
  readonly POWERBI_MODE: string = 'powerbi_view';
  readonly REPORT_TYPE: string = 'report';
  readonly DAILY: string = 'daily';
  readonly WEEKLY: string = 'weekly';
  selectedPeriod: string = this.DAILY;

  featureToggleKey: string = 'daily';
  subaccountId: string = null;
  hasDashboardDetails = false;
  reportConfig: IReportEmbedConfiguration;
  phasedEmbeddingFlag = false;
  reportClass = 'report-container';
  isLoadingResults = false;
  powerBiEmbeddingFlag: boolean = false;
  serviceName:string;
  charts: any[] = [];
  reports: any = {};
  powerbiReportByType: {
    daily: { embedUrl: string, embedToken: string },
    weekly: { embedUrl: string, embedToken: string }
  };

  constructor(private ionToastService: IonToastService, 
    private httpClient: HttpClient, 
    private subaccountService: SubaccountService,
    private ctaasDashboardService: CtaasDashboardService,
    private msalService: MsalService) {
    this.subaccountId = this.subaccountService.getSubAccount().id;
    this.reportConfig = {
      type: 'report',
      //weekly
      id: "6aabb047-8119-46f3-a462-e4ce6927cd21",
      // daily
      // id: "859f29e3-fbf3-4313-ac0d-f616acaa47c1",

      //weekly
      embedUrl:"https://app.powerbi.com/reportEmbed?reportId=6aabb047-8119-46f3-a462-e4ce6927cd21&groupId=062207f8-b0ab-4bd4-b6e9-ab57d42a7e76&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVtYmVkIjp0cnVlLCJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19",
      // daily
      // embedUrl:"https://app.powerbi.com/reportEmbed?reportId=859f29e3-fbf3-4313-ac0d-f616acaa47c1&groupId=062207f8-b0ab-4bd4-b6e9-ab57d42a7e76&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVtYmVkIjp0cnVlLCJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19&pageName=ReportSection1",
      tokenType: models.TokenType.Embed,
      // daily
      // accessToken:"H4sIAAAAAAAEAB3TtY7EBgBF0X_Z1pHMFCmFcczMnT1mZory79mkf9V5un__WOnTT2n-8-ePhntOzXtU0yrzHakQe8nwhYotTcyhj5MZ0rZag_cG8_IDglyoIu9nCU28bdOcOC5QR7qRkWCEDtSIlrr0sBHZ-8GMYH6wz0WMse8hSyRtXOuwUp7AyhXZb46LIxa1vRofdyeK9CxQw6havDmkOab6sWMS8uGDysMlO9DwWNIXcVOcRnvK3QotDLx9bnInQ0MqDj-_4NVCHZBIQ5pqo_NyZzcEMQrVk8MM097ZFm8j5QKJGhna6U_Bpa93WqTVZEEXYpgnd4py1Mal7ydVB0_AfTRCh7pt2WfExo3KRmO9K1BcbJ4LnT9yig2YjjeCz3qYZHYUN1KtmmMQ-vQRU_EisPrT89ReR_fLqZrSG-ju-w5AsFxCVn2xy8nXBPZ4tRFiTIqgdTw3tBjXYAb6-AHWFJRElxkzrSpKpIxnF1C9As5tnCU6oO3UXtN0Wc9WZdxZ73QR0ueR8rk3JTDfQ_H1g2ZL-HOW6beFWUXaab6STt7aTHkHQ5hLcNwXeaUf-yif4AaUXOFlkWQxjw600zCzxxXLsWrjR-gbwnFtMpvtRSUN4jgfICEta0oVZKoWe8CrwvB1sIdS7ff0_WzU4xz1Ob3kEN0S0EUsNvlhsDnlOKBZrJbtsULiqXHf9xWyMhVUtCkv-5Dc_VNqHAd4RGasZXGbPfA9i8nrD8YEoSMs7A24fNiZ42swSdXeSREdlCJi6msYPbcuCuMmRexyJ1vt89lADSMevm7Oz8C0g2AB1zQeHXJpN_f4CFeLpj1M3Plz8XSQRrsUyn4h7EgnkYoGOydF9zMKTsmzygFivns0EekzmW_2eeGaLS01oqI9q26RhIufP3649Zn3SS2e35yMOOY7Buv1Y9QMrdcqiybFMHCoxSM0EMuZZaYIH5JnkPcq5Tcrv9EMHtgWpxdCYRMdBp609iwajywuPWRAu2Xl51M8mxNpNg4JyBSAjtlN8TEEBEmkUemVFeaTwjUeBM1hUGgkJwpnLcB6MtKS9gMMJBknYvzG9a6ttGoIFwuX06Rh7bgXe1TWPA_EjQ0bCR4y1HKypGUJZr5RKA0a504xo8wwOA9650Se8dfH_R7ALKIjp4AYRJn7gktYtVzJcfT9LXpGI-ItaTTcdFrirgZk4ARskI-es1nRUKG9b-HqJkuMt06q-3T2zYIHHRFTxOvFYMUb7llJEuHliMGZmcYfjPnrr_-Yn7kufh_5VSYYPKZ8Rr99a62TkzPTDRrs_1duU43pfqzF7yyoVyJGK7e5Yq9yU2UzVva8Mzl4AXI76Q5dx0V8TLeYZEsmlTBVBSxoj8BiCkNw6tm0FIHkvjXNIRuN9tcZet8o-yLZACFiDyU9YY7Vlmk1LoVpojNiMn2W-0ujrvqujrqOTANnAMnbkFKx8Maz_HkOuXzc4GFQQ6Jb9F4HshxPfaaHJfKRxfcBgrPc1KS9JBRj9BA9lvgJn1u74EuN7IrmS0nqD2VqWyGwrRruYJSTruFgBmfpQ8FburircD5jD2EX9CV6lqhruV0ArNvdiiDgWtAzdF_ewr42wccslxUw3-pT3L99Yz7wq1IWWqHD0D0Wui_t4QD2V_SiVfCtuNXDr1_mf_4FNowqSEIGAAA=.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJleHAiOjE2NzY2NDE1MDQsImFsbG93QWNjZXNzT3ZlclB1YmxpY0ludGVybmV0Ijp0cnVlfQ==",
      // weakly
      accessToken: "H4sIAAAAAAAEACXTt66EVgAE0H95LZbIC1hyQYZLhmUJHTmHJYPlf_ezXM9UZzR__9jJ3U9J_vPnD9cNjlIbTwSgdTapj2U8SPOUxK2IYeos5Wi-OQx_4QnVpPncBOUuB-8Kq7_75cQP0STjxxbbVUkNl2wYTRZQ5ZArniT3lC6-F4K8N9EO4LahGfZwarL8ZLi4mtsJrBG0ycbunpxHbjOApRVl3z-HyK8qois3c4vfnEjjcOgl_o1U7WZIg9dyRMOcwrD4EQ-hagozcMo1Z8vpmHo-70QsMEh-vyo5rPpW0siUZb4BrxMtOBOzKUx1-QbS4sMwP9DW6m72OkC5jZ7KijSruYebDsL3nbb4yyAHxmTrlzlA_Vtu9CYDY50wawd-Y2Yjg2EU78xdB9X8Luzbk5AYzyWm4_maudyTz2jdlnUADoGUFQSgtFfLsa6jNMHQ2jNcZ1GNn77lhOPVbRTpWHFQfYKvBd2JKhjZ-yrqbyLoIeLCsYY2Jl2snnOM5NN84rPhRU5R5L7WMwnLkX2TICqa-snwITE7rf65WvtRRt2pWJcE5Aombi6yA2IZAYO3t5BSbskaXNjVWGeIYR0PCAfIcEgrXN8-SdQWtTHH8Vj3RC_NH4g-az7gHyABSrfLoVncKDSprell20Kx2IRETpztPuH0RJ3Hlw_kC8uxqh51I25T9iGjpxX3yAsaKh-usHl_2mwcKtjVt4SpCBW6qZZoI65JHJOqDyHLr1f2NacjtG917SK5xBBWV9nv2D435U4W7bUZ4MK7GL92qmPCsynUQVPizKxPUsar7Q9ia1SRhAkFzsA4qewfjJpRWwlf2zcyBPQeOIlbLr4MZJU_l6lh4Vfa7HEDTjlPGaBdk82mqul16aEvPcegfARS8SAPGnITeO-S-Xzonz9--OWet0kr7t87Oa_z4gaiNrqGn503_iCY45qye7xiknryy-YrUpws2BLoYnfj2VOGTGWjxmO0EpkYW_Hl4G7vZ5bRDZ2DebRby1_HEqwEGAy-mq8du-hhhDvQqSz21PmmTrQJJGnYMQbdf5VS7HyjgZoIWsDtxI503bd9Q8N64g9NCMl6gi8_UdxSEX2Vp6ZUhXqpSvHDREhrBSdv4VFeZcOxi8t15P7axvGyX8E93h7U2BBmj35QfPiIAJ-N46wAu242AMuLwfIPd7WLTuWUO7o3sqMZJmJoGOGCgpWbUGfWLkippn7QiDS8bkwURitkFIxHwlt0gNPX-Ts1cqq5IA-6d2pmXw8bRLJ__fUf8z3XxaJ-fpWnplLl0yM8o1OUkWgMgsLE_1teU43Jti_Fb83GNGw5Kp5W8YiqfLzS21IcXr-YpJFvBZUtrNTVvEdodajnPKVz6fZqQTs6BW-VuN-bvpqYhkSHkfZVonPkBW1tKE2rbEDDUTBdnHu9T9ovozRqoiTMWfhBUoRRzSWQUu_hcAzVhfxaMJ7M4LSTGa60nM1Vc613gNZmdG1JA6RPCEuih0NZkTNz9LD2hF2w9QQvxc338-vUhTgDTwGydRBdezjXEetRYCdKIQJgkkKQUpO18ZQTalfheNQxRWKiST7-OB7jwzG_R3D-2dxgKjnLemnOi4B88MV8R8PUvS2n3bYglDP8RZK4LkuNBPBXoL4tgXTqMTDiarizL4F6gx9Wv8z__AsEBxmzQgYAAA==.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJleHAiOjE2NzcxNjY4NjksImFsbG93QWNjZXNzT3ZlclB1YmxpY0ludGVybmV0Ijp0cnVlfQ==",
      // settings: {
      //   panes: {
      //     filters: {
      //         expanded: true,
      //         visible: false
      //     }
      // },
      settings: {
        filterPaneEnabled: false,
        navContentPaneEnabled: false,
        layoutType: models.LayoutType.MobileLandscape,
      }
    };
  }

  ngOnInit() {
    this.serviceName = 'Spotlight Power BI';
    this.isiOS = /iPhone/i.test(window.navigator.userAgent);
    this.viewDashboardByMode();
  }

  ionViewWillEnter(){
    console.log("ionViewWillEnter");
    window.screen.orientation.unlock();
    window.screen.orientation.lock('landscape');
    this.viewDashboardByMode();
  }
  ionViewWillLeave(){
    window.screen.orientation.unlock();
    window.screen.orientation.lock('portrait-primary');
    window.screen.orientation.unlock();
  }
  handleRefresh(event) {
  };
  private get embed(): Embed | undefined {
    return this._embed;
  }

  // Setter for this._embed
  private set embed(newEmbedInstance: Embed | undefined) {
    this._embed = newEmbedInstance;
  }

  configurePowerbiEmbeddedReport(embedUrl: string, accessToken: string) {
    console.log("Dashboard config");
    this.reportConfig = undefined;
    if (embedUrl && accessToken) {
        this.reportConfig = {
            type: this.REPORT_TYPE,
            embedUrl,
            tokenType: models.TokenType.Embed,
            accessToken,
            settings: {
              layoutType: models.LayoutType.MobileLandscape
            }
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
                    this.fetchSpotlightPowerBiDashboardDetailsBySubaccount();
                }
            }
        },
    ],
    ['visualClicked', () => console.debug('visual clicked')],
    ['pageChanged', (event) => console.debug(event)],
  ]);

  
  fetchSpotlightPowerBiDashboardDetailsBySubaccount(): Promise<any> {
    console.log("subaccountid: "+this.subaccountId);
    const promise = new Promise((resolve, reject) => {
        this.powerbiReportByType = undefined;
        this.isLoadingResults = true;
        this.hasDashboardDetails = false;
        this.ctaasDashboardService.getCtaasPowerBiDashboardDetails(this.subaccountId)
            .toPromise()
            .then((response: { powerBiInfo: IPowerBiReponse }) => {
                this.isLoadingResults = false;
                const { daily, weekly } = response.powerBiInfo;
                this.powerbiReportByType = { daily, weekly };
                console.log(daily);
                console.log(weekly);
                resolve("API request is successfull !");
            }, (err) => {
                this.hasDashboardDetails = false;
                this.isLoadingResults = false;
                console.error('Error while loading embedded powerbi report: ', err);
                this.ionToastService.presentToast('No internet connection', 'Error');
                reject("API request is not successfull !");
            });

    });
    return promise;
  }


  async viewDashboardByMode(): Promise<any> {
    // check for powerbi response, if not make an API request to fetch powerbi dashboard details
    console.log("viewDashboardByMode");
    if (!this.powerbiReportByType) 
        await this.fetchSpotlightPowerBiDashboardDetailsBySubaccount();
    if (this.powerbiReportByType) {
        this.hasDashboardDetails = true;
        const { daily, weekly } = this.powerbiReportByType;
        // configure for daily report
        if (this.featureToggleKey === this.DAILY) {
            const { embedUrl, embedToken } = daily;
            this.configurePowerbiEmbeddedReport(embedUrl, embedToken);
        } else if (this.featureToggleKey === this.WEEKLY) { // configure for weekly report
            const { embedUrl, embedToken } = weekly;
            this.configurePowerbiEmbeddedReport(embedUrl, embedToken);
        }
    } else {
        this.hasDashboardDetails = false;
    }
    this.powerBiEmbeddingFlag = true;
  }

  onClickToggleButton(selectedPeriod: string){
    this.selectedPeriod = selectedPeriod;
    this.charts = this.reports[selectedPeriod];
  }
}
