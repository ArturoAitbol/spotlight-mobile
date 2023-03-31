import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { RedirectPage } from './redirect.page';
import { ROUTER_MOCK } from '../../test/components/utils/router.mock';
import { SubaccountService } from 'src/app/services/subaccount.service';
import { SUBACCOUNT_SERVICE_MOCK } from 'src/test/services/subaccount.service.mock';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { ION_TOAST_SERVICE_MOCK } from 'src/test/services/ion-toast.service.mock';
import { FeatureToggleService } from '../services/feature-toggle.service';
import { FEATURE_TOGGLE_SERVICE_MOCK } from 'src/test/services/feature-toggle.service.mock';

describe('RedirectPage', () => {
  let component: RedirectPage;
  let fixture: ComponentFixture<RedirectPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        {
          provide: Router,
          useValue: ROUTER_MOCK
        },
        {
          provide:SubaccountService,
          useValue: SUBACCOUNT_SERVICE_MOCK
        },
        {
          provide:IonToastService,
          useValue:ION_TOAST_SERVICE_MOCK
        },
        {
          provide:FeatureToggleService,
          useValue: FEATURE_TOGGLE_SERVICE_MOCK
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RedirectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
