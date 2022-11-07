import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { ROUTER_MOCK } from '../../test/components/utils/router.mock';
import { Router } from '@angular/router';

// describe('LoginPage', () => {
//   let component: LoginPage;
//   let fixture: ComponentFixture<LoginPage>;

//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [ LoginPage ],
//       imports: [IonicModule.forRoot()],
//       providers: [
//         {
//           provide: Router,
//           useValue: ROUTER_MOCK
//         }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(LoginPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   }));

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

  // it('should go to dashboard when calling login()', () => {
  //   spyOn(ROUTER_MOCK, 'navigate');

  //   // When
  //   component.login();

  //   // Then
  //   expect(ROUTER_MOCK.navigate).toHaveBeenCalledWith(['/dashboard']);
  // });
// });
