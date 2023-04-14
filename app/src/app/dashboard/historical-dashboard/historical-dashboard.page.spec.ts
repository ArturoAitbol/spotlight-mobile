import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { CtaasDashboardService } from 'src/app/services/ctaas-dashboard.service';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { SubaccountService } from 'src/app/services/subaccount.service';
import { MODAL_CONTROLLER_MOCK } from 'src/test/components/utils/modal-controller.mock';
import { CTAAS_DASHBOARD_SERVICE_MOCK } from 'src/test/services/ctaas-dashboard.service.mock';
import { ION_TOAST_SERVICE_MOCK } from 'src/test/services/ion-toast.service.mock';
import { SUBACCOUNT_SERVICE_MOCK } from 'src/test/services/subaccount.service.mock';

import { HistoricalDashboardPage } from './historical-dashboard.page';

describe('HistoricalDashboardComponent', () => {
  let component: HistoricalDashboardPage;
  let fixture: ComponentFixture<HistoricalDashboardPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalDashboardPage ],
      imports: [IonicModule.forRoot()],
      providers:[
        {
          provide: SubaccountService,
          useValue: SUBACCOUNT_SERVICE_MOCK
        },
        {
          provide: IonToastService,
          useValue: ION_TOAST_SERVICE_MOCK
        },
        {
          provide: CtaasDashboardService,
          useValue: CTAAS_DASHBOARD_SERVICE_MOCK
        },
        {
          provide: ModalController,
          useValue: MODAL_CONTROLLER_MOCK
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricalDashboardPage);
    component = fixture.componentInstance;
    component.note = { subaccountId:"11", content:"content", openDate:"2022-01-01 12:00:00", openedBy: "user@example.com", reports: null };
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call fetchData when initializing',()=>{
    spyOn(component,'fetchData');
    component.charts = [];

    fixture.detectChanges();

    expect(component.charts.length).toBe(0);
  })

  it('should show a message instead of the charts when getCtaasHistoricalDashboardDetails() returns an empty array',()=>{
    spyOn(CTAAS_DASHBOARD_SERVICE_MOCK,'getCtaasHistoricalDashboardDetails').and.returnValue(of(CTAAS_DASHBOARD_SERVICE_MOCK.ctaasHistoricalDashboardEmpty));

    fixture.detectChanges();

    expect(component.charts.length).toBe(0);
    const errorMessage: HTMLElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessage).not.toBeNull();
  })

  it('should show a message instead of the charts when getCtaasHistoricalDashboardDetails() return an error',()=>{
    spyOn(CTAAS_DASHBOARD_SERVICE_MOCK,'getCtaasHistoricalDashboardDetails').and.returnValue(throwError({error: "error message"}));

    fixture.detectChanges();

    expect(component.charts.length).toBe(0);
    const errorMessage: HTMLElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessage).not.toBeNull();
  })

  it('should get the subaccount related to the user logged and the charts when calling fetchData()',()=>{
    spyOn(SUBACCOUNT_SERVICE_MOCK,'getSubAccount').and.callThrough();
    spyOn(component,'fetchCtaasDashboard');

    component.fetchData();
    expect(SUBACCOUNT_SERVICE_MOCK.getSubAccount).toHaveBeenCalled();
    expect(component.fetchCtaasDashboard).toHaveBeenCalled();
  })

  it('should set the loading flag to false when calling fetchData() and no subaccounts found',()=>{
    spyOn(SUBACCOUNT_SERVICE_MOCK,'getSubAccount').and.returnValue(null);
    spyOn(ION_TOAST_SERVICE_MOCK,'presentToast');
    spyOn(component,'fetchCtaasDashboard');

    component.fetchData();

    expect(SUBACCOUNT_SERVICE_MOCK.getSubAccount).toHaveBeenCalled();
    expect(component.fetchCtaasDashboard).not.toHaveBeenCalled();
    expect(ION_TOAST_SERVICE_MOCK.presentToast).toHaveBeenCalledWith("No subaccount found","Error");
  })

  it('should set the loading flag to false and show an error message when note is null',()=>{
    component.note = null;
    spyOn(ION_TOAST_SERVICE_MOCK,'presentToast');
    spyOn(component,'fetchData');

    fixture.detectChanges();

    expect(component.fetchData).not.toHaveBeenCalled();
    expect(ION_TOAST_SERVICE_MOCK.presentToast).toHaveBeenCalledWith("Note not found","Error");
  })

  it('should refresh the chart images when calling fetchCtaasDashboard()',()=>{
    const customEvent = {target:{complete:()=>{}}};
    component.charts = [];
    component.subaccount = JSON.parse(SUBACCOUNT_SERVICE_MOCK.testSubaccountString);
    component.isChartsDataLoading = true;

    component.fetchCtaasDashboard(customEvent);

    expect(component.charts.length).toBeGreaterThan(0);
  })

  it('should set the chartsData-loading flag to false when the call to fetchCtaasDashboard() throws an error',()=>{
    spyOn(CTAAS_DASHBOARD_SERVICE_MOCK,'getCtaasHistoricalDashboardDetails').and.returnValue(throwError("Some error"));
    const customEvent = {target:{complete:()=>{}}};
    component.subaccount = JSON.parse(SUBACCOUNT_SERVICE_MOCK.testSubaccountString);
    component.isChartsDataLoading = true;

    component.fetchCtaasDashboard(customEvent);

    expect(component.isChartsDataLoading).toBeFalse();
    expect(component.charts.length).toBe(0);
  })

  it('should refresh the chart images when calling handleRefresh()',()=>{
    spyOn(component,'fetchCtaasDashboard').and.callThrough();
    component.isChartsDataLoading = true;

    component.handleRefresh({target:{complete:()=>{}}});

    expect(component.fetchCtaasDashboard).toHaveBeenCalled();
    expect(component.isChartsDataLoading).toBeFalse();
  })

  it('should dismiss the modal when calling cancel()',()=>{
    spyOn(MODAL_CONTROLLER_MOCK,'dismiss');

    component.cancel();

    expect(MODAL_CONTROLLER_MOCK.dismiss).toHaveBeenCalledWith(null,'cancel');
  })

  it('should change the charts list when calling onClickToggleButton()',()=>{
    component.reports = {daily:[1,2],weekly:[3,4]}

    component.onClickToggleButton("weekly");

    expect(component.charts).toBe(component.reports.weekly);
  })


});
