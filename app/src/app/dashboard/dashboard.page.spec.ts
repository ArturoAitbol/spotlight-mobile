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
      declarations: [ DashboardPage,ImageCardComponent ],
      imports: [SharedModule,IonicModule.forRoot()],
      providers: [
        {
          provide:MsalService,
          useValue:MSAL_SERVICE_MOCK
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
        useValue:CTAAS_DASHBOARD_SERVICE_MOCK
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
    const timelapse: HTMLElement = fixture.nativeElement.querySelector('#timelapse');
    const lastUpdateTime: HTMLElement = fixture.nativeElement.querySelector('#lastUpdateTime');

    expect(serviceDescription.childElementCount).toBe(3);
    expect(serviceDescription.firstChild.textContent).toBe(component.serviceName);
    expect(serviceDescription.lastChild.textContent).toBe(component.appName);

    expect(timelapse.textContent).toBe(component.timelapse);
    expect(lastUpdateTime.textContent).toContain('Last Update: '+ component.charts[0].lastUpdatedTS);
  });

  it('should show an error message instead of the charts when the data return by getCtaasDashboardDetails() have error messages',()=>{
    spyOn(CTAAS_DASHBOARD_SERVICE_MOCK,'getCtaasDashboardDetails').and.returnValue(of(CTAAS_DASHBOARD_SERVICE_MOCK.ctaasDashboardWithError));
    component.charts = [];

    fixture.detectChanges();

    expect(component.charts.length).toBeGreaterThan(0);
    expect(component.lastUpdate).toBeNull();
    const errorMessage: HTMLElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessage).not.toBeNull();
  })

  it('should get the subaccount related to the user logged, the charts and the notes when calling fetchData()',()=>{
    spyOn(SUBACCOUNT_SERVICE_MOCK,'getSubAccountList').and.callThrough();
    spyOn(component,'fetchNotes');
    spyOn(component,'fetchCtaasDashboard');

    component.fetchData();
    expect(SUBACCOUNT_SERVICE_MOCK.getSubAccountList).toHaveBeenCalled();
    expect(component.fetchNotes).toHaveBeenCalled();
    expect(component.fetchCtaasDashboard).toHaveBeenCalled();
  })

  it('should set the loading flags to false when calling fetchData() and getting no notes',()=>{
    spyOn(SUBACCOUNT_SERVICE_MOCK,'getSubAccountList').and.returnValue(of({subaccounts:[]}));
    spyOn(component,'fetchNotes');
    spyOn(component,'fetchCtaasDashboard');
    component.isChartsDataLoading = true;
    component.isNoteDataLoading = true;

    component.fetchData();

    expect(SUBACCOUNT_SERVICE_MOCK.getSubAccountList).toHaveBeenCalled();
    expect(component.fetchNotes).not.toHaveBeenCalled();
    expect(component.fetchCtaasDashboard).not.toHaveBeenCalled();
    expect(component.isChartsDataLoading).toBeFalse();
    expect(component.isNoteDataLoading).toBeFalse();
  })

  it('should set the loading flags to false when the call to fetchData() throws an error',()=>{
    spyOn(SUBACCOUNT_SERVICE_MOCK,'getSubAccountList').and.returnValue(throwError("Some error"));
    spyOn(component,'fetchNotes');
    spyOn(component,'fetchCtaasDashboard');
    component.isChartsDataLoading = true;
    component.isNoteDataLoading = true;

    component.fetchData();

    expect(SUBACCOUNT_SERVICE_MOCK.getSubAccountList).toHaveBeenCalled();
    expect(component.fetchNotes).not.toHaveBeenCalled();
    expect(component.fetchCtaasDashboard).not.toHaveBeenCalled();
    expect(component.isChartsDataLoading).toBeFalse();
    expect(component.isNoteDataLoading).toBeFalse();
  })

  it('should refresh the chart images when calling fetchCtaasDashboard()',()=>{
    const customEvent = {target:{complete:()=>{}}};
    component.charts = [];
    component.lastUpdate = null;

    component.fetchCtaasDashboard(customEvent);

    expect(component.charts.length).toBeGreaterThan(0);

    expect(component.timelapse).not.toBeNull();
    expect(component.lastUpdate).not.toBeNull();
  })

  it('should set the chartsData-loading flag to false when the call to fetchCtaasDashboard() throws an error',()=>{
    spyOn(CTAAS_DASHBOARD_SERVICE_MOCK,'getCtaasDashboardDetails').and.returnValue(throwError("Some error"));
    const customEvent = {target:{complete:()=>{}}};
    component.isChartsDataLoading = true;

    component.fetchCtaasDashboard(customEvent);

    expect(component.isChartsDataLoading).toBeFalse();
    expect(component.charts.length).toBe(0);
    expect(component.lastUpdate).toBeUndefined();
  })

  it('should refresh the notes data when calling fetchNotes()',()=>{
    component.notes = [];
    component.latestNote = undefined;
    component.previousNotes = undefined;

    component.fetchNotes();

    expect(component.notes.length).toBeGreaterThan(0);
    expect(component.latestNote).not.toBeUndefined();
    expect(component.previousNotes).not.toBeUndefined();
  })

  it('should set the note-loading flag to false when the call to fetchNotes() throws an error',()=>{
    spyOn(NOTE_SERVICE_MOCK,'getNoteList').and.returnValue(throwError("Some error"));
    component.isNoteDataLoading = true;

    component.fetchNotes();

    expect(component.isNoteDataLoading).toBeFalse();
    expect(component.notes.length).toBe(0);
    expect(component.latestNote).toBeNull();
    expect(component.previousNotes).toBeNull();
  })

  it('should refresh the chart images and the notes data when calling handleRefresh()',()=>{
    spyOn(component,'fetchNotes');
    spyOn(component,'fetchCtaasDashboard');

    component.handleRefresh({});

    expect(component.fetchNotes).toHaveBeenCalled();
    expect(component.fetchCtaasDashboard).toHaveBeenCalled();
  })

  it('should delete the note that is being shown when deleteNote() is called and the user confirm the action',fakeAsync(()=>{
    spyOn(ION_TOAST_SERVICE_MOCK,'presentToast').and.callThrough();
    spyOn(component,'fetchNotes');
    
    component.latestNote = NOTE_SERVICE_MOCK.testNote;
    component.deleteNote();
    flush();
    expect(ION_TOAST_SERVICE_MOCK.presentToast).toHaveBeenCalledWith('Note deleted successfully!');
    expect(component.fetchNotes).toHaveBeenCalled();
  }))

  it('should show an error when deleteNote() is called and the user does not confirm the action',fakeAsync(()=>{
    spyOn(ION_TOAST_SERVICE_MOCK,'presentToast').and.callThrough();
    spyOn(NOTE_SERVICE_MOCK,'deleteNote').and.returnValue(throwError("some error"));
    spyOn(component,'fetchNotes');

    component.latestNote = NOTE_SERVICE_MOCK.testNote;
    component.deleteNote();
    flush();
    
    expect(ION_TOAST_SERVICE_MOCK.presentToast).toHaveBeenCalledWith('Error deleting a note','Error');
    expect(component.fetchNotes).not.toHaveBeenCalled();
  }))

});
