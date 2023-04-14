import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessControlDirective } from '../directives/access-control.directive';
import { CheckHtmlPipe } from '../helpers/checkHtml.pipe';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [AccessControlDirective,CheckHtmlPipe],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [IonicModule,AccessControlDirective,CheckHtmlPipe]
})
export class SharedModule { }
