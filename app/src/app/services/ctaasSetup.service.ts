import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CtaasSetupService {
  private readonly API_URL: string = environment.apiEndpoint + '/ctaasSetups';
  private readonly UPDATE_ONBOARD_DETAILS: string = this.API_URL + '/onBoarding/{setupId}';
  constructor(private httpClient: HttpClient) { }
  public getHeaders() {
    const headers = new HttpHeaders();``
    headers.append('Content-Type', 'application/json');
    return headers;
  }
  public getSubaccountCtaasSetupDetails(subaccountId: string) {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('subaccountId', subaccountId)
    return this.httpClient.get<any>(this.API_URL, { headers, params });
  }
}
