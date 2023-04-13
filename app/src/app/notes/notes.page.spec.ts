import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { ActionSheetController, IonicModule, ModalController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { ACTION_SHEET_CONTROLLER_MOCK } from 'src/test/components/utils/action-sheet-controller.mock';
import { MODAL_CONTROLLER_MOCK } from 'src/test/components/utils/modal-controller.mock';
import { ROUTER_MOCK } from 'src/test/components/utils/router.mock';
import { ION_TOAST_SERVICE_MOCK } from 'src/test/services/ion-toast.service.mock';
import { MSAL_SERVICE_MOCK } from 'src/test/services/msal.service.mock';
import { NOTE_SERVICE_MOCK } from 'src/test/services/note.service.mock';
import { PUSH_NOTIFICATIONS_SERVICE_MOCK } from 'src/test/services/push-notifications.service.mock';
import { SUBACCOUNT_SERVICE_MOCK } from 'src/test/services/subaccount.service.mock';
import { ReportType } from '../helpers/report-type';
import { DashboardService } from '../services/dashboard.service';
import { IonToastService } from '../services/ion-toast.service';
import { NoteService } from '../services/note.service';
import { PushNotificationsService } from '../services/push-notifications.service';
import { SubaccountService } from '../services/subaccount.service';
import { SharedModule } from '../shared/shared.module';
import { CtaasSetupService } from '../services/ctaasSetup.service';
import { CTAASSETUP_SERVICE_MOCK } from 'src/test/services/ctaasSetup.service.mock';
import { NotesPage } from './notes.page';
import { CTAAS_DASHBOARD_SERVICE_MOCK } from 'src/test/services/ctaas-dashboard.service.mock';

const dashboardService = new DashboardService();

describe('NotesPage', () => {
  let component: NotesPage;
  let fixture: ComponentFixture<NotesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesPage ],
      imports: [SharedModule,IonicModule.forRoot()],
      providers:[
        {
          provide:MsalService,
          useValue:MSAL_SERVICE_MOCK
        },
        {
          provide:NoteService,
          useValue:NOTE_SERVICE_MOCK
        },
        {
          provide:SubaccountService,
          useValue: SUBACCOUNT_SERVICE_MOCK
        },
        {
          provide:PushNotificationsService,
          useValue: PUSH_NOTIFICATIONS_SERVICE_MOCK
        },
        {
          provide:IonToastService,
          useValue:ION_TOAST_SERVICE_MOCK
        },
        {
         provide: ModalController,
         useValue:MODAL_CONTROLLER_MOCK
        },
        {
          provide:ActionSheetController,
          useValue:ACTION_SHEET_CONTROLLER_MOCK
        },
        {
          provide: Router,
          useValue: ROUTER_MOCK
        },
        {
          provide: DashboardService,
          useValue: dashboardService
        },
        {
          provide: CtaasSetupService,
          useValue: CTAASSETUP_SERVICE_MOCK
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotesPage);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get the notes and current reports when initializing',()=>{
    dashboardService.setReports(CTAAS_DASHBOARD_SERVICE_MOCK.ctaasHistoricalDashboard);
    spyOn(SUBACCOUNT_SERVICE_MOCK,'getSubAccount').and.callThrough();
    spyOn(component,'fetchNotes').and.callThrough();

    fixture.detectChanges();

    expect(SUBACCOUNT_SERVICE_MOCK.getSubAccount).toHaveBeenCalled();
    expect(component.fetchNotes).toHaveBeenCalled();
  })

  it('should refresh the notes list when calling fetchNotes()',()=>{
    component.notes = [];

    component.fetchNotes();

    expect(component.notes.length).toBeGreaterThan(0);
    expect(component.isNoteDataLoading).toBeFalse();
  })

  it('should set the loading flags to false when the call to fetchNotes() throws an error',()=>{
    spyOn(NOTE_SERVICE_MOCK,'getNoteList').and.returnValue(throwError("Some error"));
    spyOn(component,'fetchNotes').and.callThrough();
    component.isNoteDataLoading = true;

    component.fetchNotes({ target: {complete:()=>{} } });

    expect(NOTE_SERVICE_MOCK.getNoteList).toHaveBeenCalled();
    expect(component.isNoteDataLoading).toBeFalse();
    expect(component.notes.length).toBe(0);
  })

  it('should refresh the current reports and notes when calling handleRefresh()',()=>{
    spyOn(component,'fetchNotes').and.callThrough();

    component.handleRefresh({ target: {complete:()=>{} } });

    expect(component.fetchNotes).toHaveBeenCalled();
  })

  it('should open a modal with the add-note component when calling openAddNoteModal and update notes list if user confirm the creation',fakeAsync(()=>{
    spyOn(MODAL_CONTROLLER_MOCK,'create').and.callThrough();
    spyOn(component,'fetchNotes');

    component.openAddNoteModal();
    flush();

    expect(MODAL_CONTROLLER_MOCK.create).toHaveBeenCalled();
    expect(component.fetchNotes).toHaveBeenCalled();
  }))

  it('should close a note when calling closeNote() if the user confirm the action',fakeAsync(()=>{
    spyOn(ION_TOAST_SERVICE_MOCK,'presentToast').and.callThrough();
    spyOn(component,'fetchNotes');

    component.closeNote("000-000");
    flush();
    expect(ION_TOAST_SERVICE_MOCK.presentToast).toHaveBeenCalledWith('Note closed successfully!');
    expect(component.fetchNotes).toHaveBeenCalled();
  }))

  it('should show an error when calling closeNote() if the user does NOT confirm the action',fakeAsync(()=>{
    spyOn(ION_TOAST_SERVICE_MOCK,'presentToast').and.callThrough();
    spyOn(NOTE_SERVICE_MOCK,'deleteNote').and.returnValue(throwError("some error"));
    spyOn(component,'fetchNotes');

    component.closeNote("000-000");
    flush();

    expect(ION_TOAST_SERVICE_MOCK.presentToast).toHaveBeenCalledWith('Error closing a note','Error');
    expect(component.fetchNotes).not.toHaveBeenCalled();
  }))

  it('should open a modal with the HistoricalDashboard page when calling seeHistoricalReports()',fakeAsync(()=>{
    spyOn(MODAL_CONTROLLER_MOCK,'create').and.callThrough();
    const note = {current:false};

    component.seeHistoricalReports(note);
    flush();

    expect(MODAL_CONTROLLER_MOCK.create).toHaveBeenCalled();
  }))

});
