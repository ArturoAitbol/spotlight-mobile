import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DashboardPage } from './dashboard.page';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { ImageCardComponent } from './image-card/image-card.component';
import { SharedModule } from '../shared/shared.module';
import { HistoricalDashboardPage } from './historical-dashboard/historical-dashboard.page';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    SharedModule,
    SwiperModule
  ],
  declarations: [DashboardPage,ImageCardComponent,HistoricalDashboardPage]
})
export class DashboardPageModule {}
