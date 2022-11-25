import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DashboardPage } from './dashboard.page';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { ImageCardComponent } from './image-card/image-card.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    SharedModule
  ],
  declarations: [DashboardPage,ImageCardComponent]
})
export class DashboardPageModule {}
