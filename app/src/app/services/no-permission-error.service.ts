import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Constants } from '../helpers/constants';
import { NoPermissionMessage } from '../model/no-permission-message.model';

@Injectable({
  providedIn: 'root'
})
export class NoPermissionErrorService {

  private title: string;
  private message: NoPermissionMessage[];

  // Observable source
  private errorUpdatedSource = new Subject<void>();

  // Observable stream
  errorUpdated$ = this.errorUpdatedSource.asObservable();

  constructor() { }


  announceErrorMessageUpdate() {
    this.errorUpdatedSource.next();
  }

  setError(title: string, message: NoPermissionMessage[]) {
    localStorage.setItem(Constants.NO_PERMISSION_TITLE,title);
    localStorage.setItem(Constants.NO_PERMISSION_MESSAGE,JSON.stringify(message));
    this.title = title;
    this.message = message;
  }

  getErrorTitle() : any {
    return (this.title) ? this.title : localStorage.getItem(Constants.NO_PERMISSION_TITLE);
  }

  getErrorMessage() : any {
    return (this.message) ? this.message : JSON.parse(localStorage.getItem(Constants.NO_PERMISSION_MESSAGE));
  }

}
