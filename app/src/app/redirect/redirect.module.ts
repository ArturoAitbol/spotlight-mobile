import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RedirectPage } from './redirect.page';
import { RedirectPageRoutingModule } from './redirect-routing.module';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RedirectPageRoutingModule
  ],
  declarations: [RedirectPage]
})
export class RedirectPageModule { }
