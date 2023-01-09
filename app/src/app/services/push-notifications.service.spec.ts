import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ROUTER_MOCK } from 'src/test/components/utils/router.mock';
import { ADMIN_DEVICE_SERVICE_MOCK } from 'src/test/services/admin-device.service.mock';
import { AdminDeviceService } from './admin-device.service';

import { PushNotificationsService } from './push-notifications.service';

describe('PushNotificationsService', () => {
  let service: PushNotificationsService;

  const defaultTestBedConfig = {
    providers: [
      {
        provide: Router,
        useValue: ROUTER_MOCK
      },
      {
        provide: AdminDeviceService,
        useValue: ADMIN_DEVICE_SERVICE_MOCK
      }
    ]
  }

  beforeEach(() => {
    TestBed.configureTestingModule(defaultTestBedConfig);
    service = TestBed.inject(PushNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
