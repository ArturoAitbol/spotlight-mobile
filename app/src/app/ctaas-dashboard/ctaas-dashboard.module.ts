import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CtaasDashboardPageRoutingModule } from './ctaas-dashboard-routing.module';

import { CtaasDashboardPage } from './ctaas-dashboard.page';
import { PowerBIEmbedModule } from 'powerbi-client-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PowerBIEmbedModule,
    CtaasDashboardPageRoutingModule
  ],
  declarations: [CtaasDashboardPage]
})
export class CtaasDashboardPageModule {}
