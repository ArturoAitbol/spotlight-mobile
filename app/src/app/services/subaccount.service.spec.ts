import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SUBACCOUNT_SERVICE_MOCK } from 'src/test/services/subaccount.service.mock';
import { Constants } from '../helpers/constants';

import { SubaccountService } from './subaccount.service';

describe('SubaccountService', () => {
  let subaccountService: SubaccountService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    subaccountService = new SubaccountService(httpClientSpy);
  });

  it('should be created', () => {
    expect(subaccountService).toBeTruthy();
  });

  it('should make the proper http calls on getSubAccountList()', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(SUBACCOUNT_SERVICE_MOCK.getSubAccountList());

    subaccountService.getSubAccountList().subscribe({
        next: () => { done(); },
        error: done.fail
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith(environment.apiEndpoint + '/subaccounts');
  });

  it('should set the active subaccount when calling setSubAccount()',()=>{
    spyOn(localStorage,'setItem').and.callThrough();
    subaccountService.setSubAccount(JSON.parse(SUBACCOUNT_SERVICE_MOCK.testSubaccountString));
    expect(localStorage.setItem).toHaveBeenCalledWith(Constants.SELECTED_SUBACCOUNT,SUBACCOUNT_SERVICE_MOCK.testSubaccountString);
  })

  it('should return the active subaccount from localstorage if the service atributte is not defined when calling getSubAccount()',()=>{
    spyOn(localStorage,'getItem').and.returnValue(SUBACCOUNT_SERVICE_MOCK.testSubaccountString);
    const activeSubaccount = subaccountService.getSubAccount();
    expect(activeSubaccount).toEqual(JSON.parse(SUBACCOUNT_SERVICE_MOCK.testSubaccountString));
  })

  it('should return the active subaccount from the service atributte if it is defined when calling getSubAccount()',()=>{
    spyOn(localStorage,'getItem');
    subaccountService.setSubAccount(JSON.parse(SUBACCOUNT_SERVICE_MOCK.testSubaccountString));

    const activeSubaccount = subaccountService.getSubAccount();

    expect(activeSubaccount).toEqual(JSON.parse(SUBACCOUNT_SERVICE_MOCK.testSubaccountString));
    expect(localStorage.getItem).not.toHaveBeenCalled();
  })
});
