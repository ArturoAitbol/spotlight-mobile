import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessControlDirective } from '../directives/access-control.directive';
import { CheckHtmlPipe } from '../helpers/checkHtml.pipe';


@NgModule({
  declarations: [AccessControlDirective,CheckHtmlPipe],
  imports: [
    CommonModule
  ],
  exports: [AccessControlDirective,CheckHtmlPipe]
})
export class SharedModule { }
