import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from '../helpers/constants';
import { SubAccount } from '../model/subaccount.model';

@Injectable({
  providedIn: 'root'
})
export class SubaccountService {
  private readonly API_URL: string = environment.apiEndpoint + '/subaccounts';
  private selectedSubAccount: SubAccount;

  constructor(private httpClient:HttpClient) { }

  //set the selected subaccount
  setSubAccount(subaccount: SubAccount) {
    localStorage.setItem(Constants.SELECTED_SUBACCOUNT, JSON.stringify(subaccount)),
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
     public getSubAccountList() {
      return this.httpClient.get<any>(this.API_URL);
    }

}
