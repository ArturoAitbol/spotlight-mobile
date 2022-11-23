import { DatePipe } from '@angular/common';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { MsalService } from '@azure/msal-angular';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { ACTION_SHEET_CONTROLLER_MOCK } from 'src/test/components/utils/action-sheet-controller.mock';
import { ION_TOAST_SERVICE_MOCK } from 'src/test/services/ionToast.service.mock';
import { MSAL_SERVICE_MOCK } from 'src/test/services/msal.service.mock';
import { NOTE_SERVICE_MOCK } from 'src/test/services/note.service.mock';
import { SUBACCOUNT_SERVICE_MOCK } from 'src/test/services/subaccount.service.mock';
import { FakeChartImageService } from '../services/fakeChartImage.service';
import { IonToastService } from '../services/ionToast.service';
import { NoteService } from '../services/note.service';
import { SubaccountService } from '../services/subaccount.service';
import { SharedModule } from '../shared/shared.module';

import { DashboardPage } from './dashboard.page';
import { ImageCardComponent } from './image-card/image-card.component';

const FAKE_CHART_IMAGE_SERVICE_MOCK = {
  getChartImage:(parameter:any)=>{return of({url:'some url'})}
}

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
        provide: FakeChartImageService,
        useValue:FAKE_CHART_IMAGE_SERVICE_MOCK
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display essential UI and components', () => {
    fixture.detectChanges();
    const serviceDescription: HTMLElement = fixture.nativeElement.querySelector('#service-description');
    const chartsTitle: HTMLElement = fixture.nativeElement.querySelector('.charts-title');
    const timelapse: HTMLElement = fixture.nativeElement.querySelector('#timelapse');
    const lastDate: HTMLElement = fixture.nativeElement.querySelector('#last-date');

    expect(serviceDescription.childElementCount).toBe(3);
    expect(serviceDescription.firstChild.textContent).toBe(component.serviceName);
    expect(serviceDescription.lastChild.textContent).toBe(component.appName);

    expect(chartsTitle.firstChild.textContent).toBe('You are a');
    expect(chartsTitle.lastChild.textContent).toBe(component.chartsHeader);

    expect(timelapse.textContent).toBe('Last '+ component.timelapse);

    const datePipe = new DatePipe('en-US');
    expect(lastDate.textContent).toBe('Since '+ datePipe.transform(component.date,'mediumDate'));
  });

  it('should get the subaccount related to the user logged, the charts and the notes when calling getData()',()=>{
    spyOn(SUBACCOUNT_SERVICE_MOCK,'getSubAccountList').and.callThrough();
    spyOn(component,'getLatestNote');
    spyOn(component,'getCharts');

    component.getData();
    expect(SUBACCOUNT_SERVICE_MOCK.getSubAccountList).toHaveBeenCalled();
    expect(component.getLatestNote).toHaveBeenCalled();
    expect(component.getCharts).toHaveBeenCalled();
  })

  it('should set the loading flags to false when calling getData() and getting no notes',()=>{
    spyOn(SUBACCOUNT_SERVICE_MOCK,'getSubAccountList').and.returnValue(of({subaccounts:[]}));
    spyOn(component,'getLatestNote');
    spyOn(component,'getCharts');
    component.isImageLoading = true;
    component.isNoteDataLoading = true;

    component.getData();

    expect(SUBACCOUNT_SERVICE_MOCK.getSubAccountList).toHaveBeenCalled();
    expect(component.getLatestNote).not.toHaveBeenCalled();
    expect(component.getCharts).not.toHaveBeenCalled();
    expect(component.isImageLoading).toBeFalse();
    expect(component.isNoteDataLoading).toBeFalse();
  })

  it('should set the loading flags to false when the call to< getData() throws an error',()=>{
    spyOn(SUBACCOUNT_SERVICE_MOCK,'getSubAccountList').and.returnValue(throwError("Some error"));
    spyOn(component,'getLatestNote');
    spyOn(component,'getCharts');
    component.isImageLoading = true;
    component.isNoteDataLoading = true;

    component.getData();

    expect(SUBACCOUNT_SERVICE_MOCK.getSubAccountList).toHaveBeenCalled();
    expect(component.getLatestNote).not.toHaveBeenCalled();
    expect(component.getCharts).not.toHaveBeenCalled();
    expect(component.isImageLoading).toBeFalse();
    expect(component.isNoteDataLoading).toBeFalse();
  })

  it('should refresh the chart images when calling getCharts()',()=>{
    const customEvent = {target:{complete:()=>{}}};
    component.firstChart = null;
    component.secondChart = null;
    component.timelapse = null;
    component.date = null;

    component.handleRefresh(customEvent);

    expect(component.firstChart).not.toBeNull();
    expect(component.secondChart).not.toBeNull();
    expect(component.timelapse).not.toBeNull();
    expect(component.date).not.toBeNull();
  })

  it('should set the image-loading flag to false when the call to getCharts() throws an error',()=>{
    spyOn(FAKE_CHART_IMAGE_SERVICE_MOCK,'getChartImage').and.returnValue(throwError("Some error"));
    const customEvent = {target:{complete:()=>{}}};
    component.isImageLoading = true;

    component.handleRefresh(customEvent);

    expect(component.isImageLoading).toBeFalse();
    expect(component.firstChart).toBeNull();
    expect(component.secondChart).toBeNull();
    expect(component.timelapse).toBeNull();
    expect(component.date).toBeNull();
  })

  it('should refresh the notes data when calling getLatestNote()',()=>{
    component.notes = [];
    component.latestNote = undefined;
    component.previousNotes = undefined;

    component.getLatestNote();

    expect(component.notes.length).toBeGreaterThan(0);
    expect(component.latestNote).not.toBeUndefined();
    expect(component.previousNotes).not.toBeUndefined();
  })

  it('should set the note-loading flag to false when the call to getLatestNote() throws an error',()=>{
    spyOn(NOTE_SERVICE_MOCK,'getNoteList').and.returnValue(throwError("Some error"));
    component.isNoteDataLoading = true;

    component.getLatestNote();

    expect(component.isNoteDataLoading).toBeFalse();
    expect(component.notes.length).toBe(0);
    expect(component.latestNote).toBeNull();
    expect(component.previousNotes).toBeNull();
  })

  it('should refresh the chart images and the notes data when calling handleRefresh()',()=>{
    spyOn(component,'getLatestNote');
    spyOn(component,'getCharts');
    component.handleRefresh({});

    expect(component.getLatestNote).toHaveBeenCalled();
    expect(component.getCharts).toHaveBeenCalled();
  })

  it('should delete the note that is being shown when deleteNote() is called and the user confirm the action',fakeAsync(()=>{
    spyOn(ION_TOAST_SERVICE_MOCK,'presentToast').and.callThrough();
    spyOn(component,'getLatestNote');
    fixture.detectChanges();
    component.deleteNote();
    flush();
    expect(ION_TOAST_SERVICE_MOCK.presentToast).toHaveBeenCalledWith('Note deleted successfully!');
    expect(component.getLatestNote).toHaveBeenCalled();
  }))

  it('should show an error when deleteNote() is called and the user does not confirm the action',fakeAsync(()=>{
    spyOn(ION_TOAST_SERVICE_MOCK,'presentToast').and.callThrough();
    spyOn(NOTE_SERVICE_MOCK,'deleteNote').and.returnValue(throwError("some error"));
    spyOn(component,'getLatestNote');
    fixture.detectChanges();
    component.deleteNote();
    flush();
    expect(ION_TOAST_SERVICE_MOCK.presentToast).toHaveBeenCalledWith('Error deleting a note','Error');
    expect(component.getLatestNote).not.toHaveBeenCalled();
  }))


  it('should return "Five-9" as charts header if metrics match the corresponding conditions when calling getChartsHeader()', () => {
    //current condition: both metrics beyond 90
    const chartsHeader = component.getChartsHeader(91,91);
    expect(chartsHeader).toBe('Five-9');
  });

  it('should return "Four-9" as charts header if metrics match the corresponding conditions when calling getChartsHeader()', () => {
    //current condition: both metrics above 80 and at least one of them between 81 and 85
    let chartsHeader = component.getChartsHeader(82,86);
    expect(chartsHeader).toBe('Four-9');

    chartsHeader = component.getChartsHeader(86,82);
    expect(chartsHeader).toBe('Four-9');
  });

  it('should return "Three-9" as charts header if metrics match the corresponding conditions when calling getChartsHeader()', () => {
    //current condition: both metrics above 50 and at least one of them between 51 and 70
    let chartsHeader = component.getChartsHeader(51,72);
    expect(chartsHeader).toBe('Three-9');

    chartsHeader = component.getChartsHeader(72,51);
    expect(chartsHeader).toBe('Three-9');
  });

  it('should return an empty string as charts header if metrics does not match any condition  when calling getChartsHeader()', () => {
    const chartsHeader = component.getChartsHeader(0,0);
    expect(chartsHeader).toBe('');
  });

});
