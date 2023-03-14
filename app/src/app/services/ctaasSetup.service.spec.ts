import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { CtaasSetupService } from './ctaasSetup.service';

describe('MaintenanceModeService', () => {
  let service: CtaasSetupService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    TestBed.configureTestingModule({});
    service = new CtaasSetupService(httpClientSpy);
  });

  beforeEach(() => {
    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
