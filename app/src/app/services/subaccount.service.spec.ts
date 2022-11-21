import { TestBed } from '@angular/core/testing';

import { SubaccountService } from './subaccount.service';

describe('SubaccountService', () => {
  let service: SubaccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubaccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
