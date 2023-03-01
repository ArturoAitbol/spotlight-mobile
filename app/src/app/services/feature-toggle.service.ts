import { HttpClient, HttpParams, HttpBackend, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FeatureToggle } from "../model/feature-toggle.model";


@Injectable({
  providedIn: 'root'
})
export class FeatureToggleService {

  private readonly API_URL: string = environment.apiEndpoint + '/featureToggles'; 
  private featureToggleMap: Map<string, FeatureToggle>;
  private refreshInterval = 5 * 60 * 1000;
  private intervalId = null;
  private httpClient: HttpClient;
  public featureToggle: any;

  constructor(handler: HttpBackend) { 
    this.httpClient = new HttpClient(handler);
  }
  public refreshToggles(): Observable<void> {
    return new Observable<void>(subscriber => {
        this.featureToggleMap = new Map<string, FeatureToggle>();
        const headers = this.getHeaders();
        this.httpClient.get(`${this.API_URL}`, { headers }).subscribe((res: {featureToggles: FeatureToggle[]}) => {
            res.featureToggles.forEach(featureToggle => {
                this.featureToggleMap.set(featureToggle.name, featureToggle);
            });
            if (this.intervalId == null) this.setUpPeriodicRefresh();
            subscriber.next(void 0);
            subscriber.complete();
        });
        console.log(this.featureToggleMap);
    });
  }

  public isFeatureEnabled(toggleName: string, subaccountId?: string): boolean {
    this.featureToggle = this.featureToggleMap.get(toggleName);
    if (this.featureToggle) {
        if (subaccountId) {
            const exception = this.featureToggle?.exceptions?.find(exception => exception.subaccountId == subaccountId);
            // If the exception exists it takes priority
            if (exception) return exception.status;
            else return this.featureToggle.status;
        } else return this.featureToggle.status;
    } else return true;
  }

  private setUpPeriodicRefresh(): void {
    this.intervalId = setInterval(() => {
        this.refreshToggles().subscribe();
    }, this.refreshInterval);
  }

  public getHeaders() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return headers;
  }
}
