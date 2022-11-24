import { fakeAsync, flush } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';
import { IonToastService } from './ion-toast.service';

describe('CtaasDashboardService', () => {
  let ionToastService: IonToastService;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;

  beforeEach(() => {
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    ionToastService = new IonToastService(toastControllerSpy);
  });

  it('should be created', () => {
    expect(ionToastService).toBeTruthy();
  });

  it('should make the proper calls on presentToast()', fakeAsync(() => {
    const toastSpy: jasmine.SpyObj<HTMLIonToastElement> = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastControllerSpy.create.and.returnValue(new Promise((resolve)=>resolve(toastSpy)));

    ionToastService.presentToast("some message");
    ionToastService.presentToast("some message","some dismiss button text");
    ionToastService.presentToast("some message","some dismiss button text","middle",3000);
    flush();

    expect(toastControllerSpy.create).toHaveBeenCalledTimes(3);
    expect(toastSpy.present).toHaveBeenCalledTimes(3);
  }));

});