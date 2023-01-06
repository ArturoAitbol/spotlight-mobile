import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ADMIN_DEVICE_SERVICE_MOCK } from 'src/test/services/admin-device.service.mock';

import { AdminDeviceService } from './admin-device.service';

describe('AdminDeviceService', () => {
  let deviceService: AdminDeviceService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    deviceService = new AdminDeviceService(httpClientSpy);
  });

  it('should be created', () => {
    expect(deviceService).toBeTruthy();
  });

  
  it('should make the proper http calls on createAdminDevice()', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue(ADMIN_DEVICE_SERVICE_MOCK.createAdminDevice());

    const deviceToCreate: any = {
      token:'000-aaaa-bbbb-cccc',
      subaccountAdminEmail:'test contet'
  }
    deviceService.createAdminDevice(deviceToCreate).subscribe({
        next: () => { done(); },
        error: done.fail
    });
    expect(httpClientSpy.post).toHaveBeenCalledWith(environment.apiEndpoint + '/subaccountAdminDevices',deviceToCreate);
  });

  it('should make the proper http calls on deleteAdminDevice()', (done: DoneFn) => {
    let deviceId = '00000-0000-000'
    httpClientSpy.delete.and.returnValue(ADMIN_DEVICE_SERVICE_MOCK.deleteAdminDevice(deviceId));
   
    deviceService.deleteAdminDevice(deviceId).subscribe({
        next: () => { done(); },
        error: done.fail
    });
    expect(httpClientSpy.delete).toHaveBeenCalledWith(environment.apiEndpoint + '/subaccountAdminDevices/'+ deviceId);
  });

});
