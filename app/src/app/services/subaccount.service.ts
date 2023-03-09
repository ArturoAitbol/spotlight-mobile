import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Constants } from '../helpers/constants';
import { SubAccount } from '../model/subaccount.model';

@Injectable({
  providedIn: 'root'
})
export class SubaccountService {
  private readonly API_URL: string = environment.apiEndpoint + '/subaccounts';
  private selectedSubAccount: SubAccount = null;
  subaccountData =  new Subject<any>();
  constructor(private httpClient:HttpClient) { }

  //set the selected subaccount
  setSubAccount(subaccount: SubAccount) {
    localStorage.setItem(Constants.SELECTED_SUBACCOUNT, JSON.stringify(subaccount));
    this.selectedSubAccount = subaccount;
  }

  //get the selected subaccount
  getSubAccount() : SubAccount {
    return (this.selectedSubAccount) ? this.selectedSubAccount : JSON.parse(localStorage.getItem(Constants.SELECTED_SUBACCOUNT));
  }

  /**
  * fetch SubAccount details list
  * @returns: Observable
  */
  getSubAccountList() {
    return this.httpClient.get<any>(this.API_URL);
  }

  setSelectedSubAccount(subaccount: any) { 
    sessionStorage.setItem(Constants.SELECTED_SUBACCOUNT, JSON.stringify(subaccount));
    this.selectedSubAccount = subaccount;

    this.subaccountData.next(this.selectedSubAccount);
  }

  getSelectedSubAccount() {
    if(this.selectedSubAccount?.id)
      return this.selectedSubAccount;
    if(sessionStorage.getItem(Constants.SELECTED_SUBACCOUNT))
      return JSON.parse(sessionStorage.getItem(Constants.SELECTED_SUBACCOUNT));
    //if the other sentences aren't matched return a default empty template
    return { id: "", name: "", customerName: "" };
  }
}
