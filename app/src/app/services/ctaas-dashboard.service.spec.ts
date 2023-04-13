import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NOTE_SERVICE_MOCK } from 'src/test/services/note.service.mock';
import { ReportType } from '../helpers/report-type';
import { CtaasDashboardService } from './ctaas-dashboard.service';

describe('CtaasDashboardService', () => {
  let ctaasDashboardService: CtaasDashboardService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    ctaasDashboardService = new CtaasDashboardService(httpClientSpy);
  });

  it('should be created', () => {
    expect(ctaasDashboardService).toBeTruthy();
  });

  it('should make the proper http calls on getCtaasDashboardDetails()', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(NOTE_SERVICE_MOCK.getNoteList());

    const subaccountId = '00000-0000-000'
    const reportType = ReportType.DAILY_CALLING_RELIABILITY;
    ctaasDashboardService.getCtaasDashboardDetails(subaccountId,reportType).subscribe({
        next: () => { done(); },
        error: done.fail
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith(environment.apiEndpoint + `/ctaasDashboard/${subaccountId}/${reportType}`,{params:undefined});

  });

});
