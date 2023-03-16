import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { IonicModule } from '@ionic/angular';
import { MSAL_SERVICE_MOCK } from 'src/test/services/msal.service.mock';
import { SUBACCOUNT_SERVICE_MOCK } from 'src/test/services/subaccount.service.mock';
import { Constants } from '../helpers/constants';
import { DashboardService } from '../services/dashboard.service';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { TabnavPage } from './tabnav.page';
import { FeatureToggleService } from '../services/feature-toggle.service';
import { SubaccountService } from '../services/subaccount.service';

const dashboardService = new DashboardService();

describe('TabnavPage', () => {
  let component: TabnavPage;
  let fixture: ComponentFixture<TabnavPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabnavPage ],
      imports: [SharedModule,IonicModule.forRoot(),HttpClientModule],
      providers:[
        {
          provide: ActivatedRoute,
          useValue: ActivatedRoute
        },
        {
          provide:MsalService,
          useValue:MSAL_SERVICE_MOCK
        },
        {
          provide:DashboardService,
          useValue:dashboardService
        },
        {
          provide: FeatureToggleService,
          useValue: {isFeatureEnabled: () => {return true;}} 
        },
        {
          provide: SubaccountService,
          useValue: SubaccountService
        },
        {
          provide: SubaccountService,
          useValue: {getSubAccount: () => {return true;}} 
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TabnavPage);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display essential UI and components',()=>{
    fixture.detectChanges();
    const dashboardTab: HTMLElement = fixture.nativeElement.querySelector('[tab="dashboard"]');
    const notesTab: HTMLElement = fixture.nativeElement.querySelector('[tab="notes"]');
    expect(dashboardTab.lastChild.textContent).toBe('Dashboard');
    expect(notesTab.lastChild.textContent).toBe('Notes');

  });

  it('should keep the notes tab as disabled if selected subaccount is not defined',()=>{
    localStorage.clear();
    fixture.detectChanges();
    expect(component.disableNotes).toBeTrue();
  });

  it('should enable the notes tab if selected subaccount is defined',()=>{
    localStorage.setItem(Constants.SELECTED_SUBACCOUNT,SUBACCOUNT_SERVICE_MOCK.getSubAccount());
    fixture.detectChanges();
    expect(component.disableNotes).toBeFalse();
  });

  it('should enable the notes tab when dashboard loads completely',()=>{
    localStorage.clear();
    dashboardService.announceDashboardRefresh();
    fixture.detectChanges();
    expect(component.disableNotes).toBeFalse();
  });

});
