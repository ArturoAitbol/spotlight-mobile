import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import { NoPermissionPage } from './no-permission/no-permission.page';
import { RedirectPage } from './redirect/redirect.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path: 'no-permission',
    component: NoPermissionPage
  }
  ,
  {
    path: 'redirect',
    component: RedirectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
