import { DatePipe } from '@angular/common';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { ACTION_SHEET_CONTROLLER_MOCK } from 'src/test/components/utils/action-sheet-controller.mock';
import { ION_TOAST_SERVICE } from 'src/test/services/ionToast.service.mock';
import { NOTE_SERVICE_MOCK } from 'src/test/services/note.service.mock';
import { SUBACCOUNT_SERVICE_MOCK } from 'src/test/services/subaccount.service.mock';
import { FakeChartImageService } from '../services/fakeChartImage.service';
import { IonToastService } from '../services/ionToast.service';
import { NoteService } from '../services/note.service';
import { SubaccountService } from '../services/subaccount.service';

import { DashboardPage } from './dashboard.page';
import { ImageCardComponent } from './image-card/image-card.component';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPage,ImageCardComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
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
          useValue: ION_TOAST_SERVICE
        },
        {
        provide: FakeChartImageService,
        useValue:{
          getChartImage:(parameter:any)=>{return of({url:'some url'})}
        }
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

  it('should refresh the notes data when calling getLatestNote()',()=>{
    component.notes = [];
    component.latestNote = undefined;
    component.previousNotes = undefined;

    component.getLatestNote();

    expect(component.notes.length).toBeGreaterThan(0);
    expect(component.latestNote).not.toBeUndefined();
    expect(component.previousNotes).not.toBeUndefined();
  })

  it('should refresh the chart images and the notes data when calling handleRefresh()',()=>{
    spyOn(component,'getLatestNote');
    spyOn(component,'getCharts');
    component.handleRefresh({});

    expect(component.getLatestNote).toHaveBeenCalled();
    expect(component.getCharts).toHaveBeenCalled();
  })

  it('should delete the note that is being shown when deleteNote() is called and the user confirm the action',fakeAsync(()=>{
    spyOn(ION_TOAST_SERVICE,'presentToast').and.callThrough();
    spyOn(component,'getLatestNote');
    fixture.detectChanges();
    component.deleteNote();
    flush();
    expect(ION_TOAST_SERVICE.presentToast).toHaveBeenCalledWith('Subaccount deleted successfully!');
    expect(component.getLatestNote).toHaveBeenCalled();
  }))

  it('should show an error when deleteNote() is called and the user does not confirm the action',fakeAsync(()=>{
    spyOn(ION_TOAST_SERVICE,'presentToast').and.callThrough();
    spyOn(NOTE_SERVICE_MOCK,'deleteNote').and.returnValue(throwError("some error"));
    spyOn(component,'getLatestNote');
    fixture.detectChanges();
    component.deleteNote();
    flush();
    expect(ION_TOAST_SERVICE.presentToast).toHaveBeenCalledWith('Error deleting a note');
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
