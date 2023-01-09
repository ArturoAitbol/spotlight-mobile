import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { IonicModule, ModalController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { NoteService } from 'src/app/services/note.service';
import { SubaccountService } from 'src/app/services/subaccount.service';
import { ION_TOAST_SERVICE_MOCK } from 'src/test/services/ion-toast.service.mock';
import { MODAL_CONTROLLER_MOCK } from 'src/test/components/utils/modal-controller.mock';
import { MSAL_SERVICE_MOCK } from 'src/test/services/msal.service.mock';
import { NOTE_SERVICE_MOCK } from 'src/test/services/note.service.mock';
import { SUBACCOUNT_SERVICE_MOCK } from 'src/test/services/subaccount.service.mock';

import { AddNoteComponent } from './add-note.component';
import { Constants } from 'src/app/helpers/constants';

describe('AddNoteComponent', () => {
  let component: AddNoteComponent;
  let fixture: ComponentFixture<AddNoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNoteComponent ],
      imports: [ReactiveFormsModule, IonicModule.forRoot()],
      providers: [
        {
          provide:MsalService,
          useValue:MSAL_SERVICE_MOCK,
        },
        {
          provide:SubaccountService,
          useValue:SUBACCOUNT_SERVICE_MOCK
        },
        {
          provide:NoteService,
          useValue:NOTE_SERVICE_MOCK,
        },
        {
          provide:IonToastService,
          useValue:ION_TOAST_SERVICE_MOCK
        },
        {
          provide:ModalController,
          useValue:MODAL_CONTROLLER_MOCK
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AddNoteComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display essential UI and components', () => {
    fixture.detectChanges();
    const noteMessage: HTMLElement = fixture.nativeElement.querySelector('#note-message');
    const addButton: HTMLElement = fixture.nativeElement.querySelector('#add-button');
    const cancelButton: HTMLElement = fixture.nativeElement.querySelector('#cancel-button');
    expect(noteMessage.childElementCount).toBe(2);
    expect(noteMessage.firstChild.textContent).toBe("Note message");
    expect(addButton.textContent).toBe('Add Note');
    expect(cancelButton.textContent).toBe('Cancel');
  });

  it('should create a new note when calling addNote()',async()=>{
    spyOn(NOTE_SERVICE_MOCK,'createNote').and.callThrough();
    spyOn(ION_TOAST_SERVICE_MOCK,'presentToast').and.callThrough();
    spyOn(MODAL_CONTROLLER_MOCK,'dismiss').and.callThrough();
    const currentReports = '[{"timestampId":"1","reportType":"a-type"},{"timestampId":"2","reportType":"b-type"}]';
    localStorage.setItem(Constants.CURRENT_REPORTS,currentReports);
    fixture.detectChanges();

    await component.addNote();

    expect(NOTE_SERVICE_MOCK.createNote).toHaveBeenCalled();
    expect(ION_TOAST_SERVICE_MOCK.presentToast).toHaveBeenCalledWith("Note created successfully!");
    expect(component.loading).toBeFalse();
    expect(MODAL_CONTROLLER_MOCK.dismiss).toHaveBeenCalled();
  })

  it('should show a message if an error occurred when calling addNote()',async()=>{
    const err = {error: "some error"};
    spyOn(NOTE_SERVICE_MOCK,'createNote').and.returnValue(throwError(err));
    spyOn(ION_TOAST_SERVICE_MOCK,'presentToast').and.callThrough();
    const currentReports = '[{"timestampId":"1","reportType":"a-type"},{"timestampId":"2","reportType":"b-type"}]';
    localStorage.setItem(Constants.CURRENT_REPORTS,currentReports);
    fixture.detectChanges();

    await component.addNote();

    expect(ION_TOAST_SERVICE_MOCK.presentToast).toHaveBeenCalledWith("Error creating a note. " + err.error,"Error");
    expect(component.loading).toBeFalse();
  })

  it('should show a message when calling addNote() if there is not chart reports',async()=>{
    const err = {error: "some error"};
    spyOn(NOTE_SERVICE_MOCK,'createNote').and.returnValue(throwError(err));
    spyOn(ION_TOAST_SERVICE_MOCK,'presentToast').and.callThrough();
    localStorage.removeItem(Constants.CURRENT_REPORTS);
    fixture.detectChanges();

    await component.addNote();

    expect(ION_TOAST_SERVICE_MOCK.presentToast).toHaveBeenCalledWith("Error creating a note. " + err.error,"Error");
    expect(component.loading).toBeFalse();
  })

  it('should dismiss the modal when calling cancel()',()=>{
    spyOn(MODAL_CONTROLLER_MOCK,'dismiss').and.callThrough();
    component.cancel();
    expect(MODAL_CONTROLLER_MOCK.dismiss).toHaveBeenCalledWith(null,'cancel');

  })

});
