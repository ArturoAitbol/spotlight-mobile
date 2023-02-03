import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { LoadingPage } from './loading/loading.page';
import { NoPermissionPage } from './no-permission/no-permission.page';
import { SharedModule } from '../shared/shared.module';
import { RedirectPage } from './redirect/redirect.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage,LoadingPage,NoPermissionPage,RedirectPage]
})
export class LoginPageModule {}
