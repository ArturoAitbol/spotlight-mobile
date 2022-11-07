import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-tabnav',
  templateUrl: './tabnav.page.html',
  styleUrls: ['./tabnav.page.scss'],
})
export class TabnavPage implements OnInit {

  constructor(private msalService: MsalService) { }

  ngOnInit() {
  }

  logout(){
    if (this.msalService.instance.getActiveAccount() != null) {
      try {
          this.msalService.logoutRedirect();
      } catch (error) {
          console.error('error while logout: ', error);
      }
  }
  }

}
