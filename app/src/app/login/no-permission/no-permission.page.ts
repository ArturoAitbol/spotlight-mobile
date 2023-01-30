import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NoPermissionMessage } from 'src/app/model/no-permission-message.model';
import { NoPermissionErrorService } from 'src/app/services/no-permission-error.service';

@Component({
  selector: 'app-no-permission',
  templateUrl: './no-permission.page.html',
  styleUrls: ['./no-permission.page.scss'],
})
export class NoPermissionPage implements OnInit {

  title: string;
  messages: NoPermissionMessage[];
  errorSubscription:Subscription;

  constructor(private noPermissionErrorService: NoPermissionErrorService) {
    this.errorSubscription = this.noPermissionErrorService.errorUpdated$.subscribe(()=>{
      this.updateError();
    })
   }

  ngOnInit(): void {
    this.updateError();
  }

  ngOnDestroy(): void {
    if (this.errorSubscription)
      this.errorSubscription.unsubscribe();
  }

  updateError(){
    this.title = this.noPermissionErrorService.getErrorTitle();
    this.messages = this.noPermissionErrorService.getErrorMessage();
  }

}
