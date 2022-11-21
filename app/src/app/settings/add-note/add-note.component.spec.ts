import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { IonicModule } from '@ionic/angular';
import { MsalServiceMock } from 'src/test/services/msal-service.mock';

import { AddNoteComponent } from './add-note.component';

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
          useValue:MsalServiceMock,
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
