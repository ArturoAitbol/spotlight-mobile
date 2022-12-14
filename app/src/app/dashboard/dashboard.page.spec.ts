import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { MsalService } from '@azure/msal-angular';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { ACTION_SHEET_CONTROLLER_MOCK } from 'src/test/components/utils/action-sheet-controller.mock';
import { CTAAS_DASHBOARD_SERVICE_MOCK } from 'src/test/services/ctaas-dashboard.service.mock';
import { ION_TOAST_SERVICE_MOCK } from 'src/test/services/ion-toast.service.mock';
import { MSAL_SERVICE_MOCK } from 'src/test/services/msal.service.mock';
import { NOTE_SERVICE_MOCK } from 'src/test/services/note.service.mock';
import { SUBACCOUNT_SERVICE_MOCK } from 'src/test/services/subaccount.service.mock';
import { CtaasDashboardService } from '../services/ctaas-dashboard.service';
import { IonToastService } from '../services/ion-toast.service';
import { NoteService } from '../services/note.service';
import { SubaccountService } from '../services/subaccount.service';
import { SharedModule } from '../shared/shared.module';

import { DashboardPage } from './dashboard.page';
import { ImageCardComponent } from './image-card/image-card.component';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPage, ImageCardComponent],
      imports: [SharedModule, IonicModule.forRoot()],
      providers: [
        {
          provide: MsalService,
          useValue: MSAL_SERVICE_MOCK
        },
        {
          provide: SubaccountService,
          useValue: SUBACCOUNT_SERVICE_MOCK
        },
        {
          provide: NoteService,
          useValue: NOTE_SERVICE_MOCK
        },
        {
          provide: ActionSheetController,
          useValue: ACTION_SHEET_CONTROLLER_MOCK
        },
        {
          provide: IonToastService,
          useValue: ION_TOAST_SERVICE_MOCK
        },
        {
          provide: CtaasDashboardService,
          useValue: CTAAS_DASHBOARD_SERVICE_MOCK
        }]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display essential UI and components', () => {
    fixture.detectChanges();
    const serviceDescription: HTMLElement = fixture.nativeElement.querySelector('#service-description');

    expect(serviceDescription.childElementCount).toBe(1);
    expect(serviceDescription.firstChild.textContent).toBe(component.serviceName);
  });

  it('should show an error message instead of the charts when the data return by getCtaasDashboardDetails() have error messages', () => {
    spyOn(CTAAS_DASHBOARD_SERVICE_MOCK, 'getCtaasDashboardDetails').and.returnValue(of(CTAAS_DASHBOARD_SERVICE_MOCK.ctaasDashboardWithError));
    component.charts = [];

    fixture.detectChanges();

    expect(component.charts.length).toBe(0);
    const errorMessage: HTMLElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessage).not.toBeNull();
  })

  it('should get the subaccount related to the user logged and the charts when calling fetchData()',()=>{
    spyOn(SUBACCOUNT_SERVICE_MOCK,'getSubAccountList').and.callThrough();
    spyOn(component,'fetchCtaasDashboard');

    component.fetchData();
    expect(SUBACCOUNT_SERVICE_MOCK.getSubAccountList).toHaveBeenCalled();
    expect(component.fetchCtaasDashboard).toHaveBeenCalled();
  })

  it('should set the loading flags to false when calling fetchData() and no subaccounts found',()=>{
    spyOn(SUBACCOUNT_SERVICE_MOCK,'getSubAccountList').and.returnValue(of({subaccounts:[]}));
    spyOn(component,'fetchCtaasDashboard');
    component.isChartsDataLoading = true;

    component.fetchData();

    expect(SUBACCOUNT_SERVICE_MOCK.getSubAccountList).toHaveBeenCalled();
    expect(component.fetchCtaasDashboard).not.toHaveBeenCalled();
    expect(component.isChartsDataLoading).toBeFalse();
  })

  it('should set the loading flags to false when the call to fetchData() throws an error',()=>{
    spyOn(SUBACCOUNT_SERVICE_MOCK,'getSubAccountList').and.returnValue(throwError("Some error"));
    spyOn(component,'fetchCtaasDashboard');
    component.isChartsDataLoading = true;

    component.fetchData();

    expect(SUBACCOUNT_SERVICE_MOCK.getSubAccountList).toHaveBeenCalled();
    expect(component.fetchCtaasDashboard).not.toHaveBeenCalled();
    expect(component.isChartsDataLoading).toBeFalse();
  })

  it('should refresh the chart images when calling fetchCtaasDashboard()', () => {
    const customEvent = { target: { complete: () => { } } };
    component.charts = [];

    component.fetchCtaasDashboard(customEvent);

    expect(component.charts.length).toBeGreaterThan(0);
  })

  it('should set the loading flag to false when the call to getSubAccountList() throws an error', () => {
    spyOn(SUBACCOUNT_SERVICE_MOCK, 'getSubAccountList').and.returnValue(throwError("Some error"));
    const customEvent = { target: { complete: () => { } } };
    component.isChartsDataLoading = true;

    component.fetchData(customEvent);

    expect(component.isChartsDataLoading).toBeFalse();
    expect(component.charts.length).toBe(0);
  })

  it('should set the loading flag to false when the call to fetchCtaasDashboard() throws an error', () => {
    spyOn(CTAAS_DASHBOARD_SERVICE_MOCK, 'getCtaasDashboardDetails').and.returnValue(throwError("Some error"));
    const customEvent = { target: { complete: () => { } } };
    component.isChartsDataLoading = true;

    component.fetchCtaasDashboard(customEvent);

    expect(component.isChartsDataLoading).toBeFalse();
    expect(component.charts.length).toBe(0);
  })

  it('should refresh the chart images when calling handleRefresh()',()=>{
    spyOn(component,'fetchCtaasDashboard');

    component.handleRefresh({ target: {complete:()=>{} } });

    expect(component.fetchCtaasDashboard).toHaveBeenCalled();
  })

});
