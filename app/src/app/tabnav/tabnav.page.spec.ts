import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { IonicModule } from '@ionic/angular';
import { MSAL_SERVICE_MOCK } from 'src/test/services/msal.service.mock';
import { SharedModule } from '../shared/shared.module';

import { TabnavPage } from './tabnav.page';

describe('TabnavPage', () => {
  let component: TabnavPage;
  let fixture: ComponentFixture<TabnavPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabnavPage ],
      imports: [SharedModule,IonicModule.forRoot()],
      providers:[
        {
          provide: ActivatedRoute,
          useValue: ActivatedRoute
        },
        {
          provide:MsalService,
          useValue:MSAL_SERVICE_MOCK
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TabnavPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display essential UI and components',()=>{
    fixture.detectChanges();
    const dashboardTab: HTMLElement = fixture.nativeElement.querySelector('[tab="dashboard"]');
    const notesTab: HTMLElement = fixture.nativeElement.querySelector('[tab="notes"]');
    expect(dashboardTab.lastChild.textContent).toBe('Dashboard');
    expect(notesTab.lastChild.textContent).toBe('Notes');

  });

});
