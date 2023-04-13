import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CtaasDashboardService {
  private readonly API_URL: string = environment.apiEndpoint + '/ctaasDashboard';
  private readonly FETCH_DASHBOARD_URL: string = this.API_URL + '/{subaccountId}/{reportType}';
  private readonly FETCH_POWERBI_DASHBOARD_REPORT_URL: string = `${environment.apiEndpoint}/spotlightDashboard/{subaccountId}`;
  private readonly FETCH_HISTORICAL_DASHBOARD_URL: string = `${environment.apiEndpoint}/ctassHistoricalDashboard/{subaccountId}/{noteId}`;

  constructor(private httpClient: HttpClient) { }
  /**
   * fetch Spotlight Power BI reports
   * @param subaccountId: string
   * @param reportType: string
   * @returns: Observable<any>
   */
  public getCtaasDashboardDetails(subaccountId: string, reportType: string): Observable<any> {
    let params;
    const url = this.FETCH_DASHBOARD_URL.replace(/{subaccountId}/g, subaccountId).replace(/{reportType}/g, reportType);
    return this.httpClient.get(url,{params});
  }

  public getCtaasPowerBiDashboardDetails(subaccountId: string): Observable<any> {
    const url = this.FETCH_POWERBI_DASHBOARD_REPORT_URL.replace(/{subaccountId}/g, subaccountId);
    return this.httpClient.get(url);
  }

  public getCtaasHistoricalDashboardDetails(subaccountId: string, noteId: string): Observable<any> {
    const url = this.FETCH_HISTORICAL_DASHBOARD_URL.replace(/{subaccountId}/g, subaccountId).replace(/{noteId}/g, noteId);
    return this.httpClient.get(url);
  }
}
