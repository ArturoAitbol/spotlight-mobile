import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { TabnavPage } from './tabnav.page';

describe('TabnavPage', () => {
  let component: TabnavPage;
  let fixture: ComponentFixture<TabnavPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabnavPage ],
      imports: [IonicModule.forRoot()],
      providers:[
        {
          provide: ActivatedRoute,
          useValue: ActivatedRoute
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
    const settingsTab: HTMLElement = fixture.nativeElement.querySelector('[tab="settings"]');
    expect(dashboardTab.lastChild.textContent).toBe('Dashboard');
    expect(settingsTab.lastChild.textContent).toBe('Settings');

  });

});
