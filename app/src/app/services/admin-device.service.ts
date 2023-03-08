import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminDeviceService {

  private readonly API_URL: string = environment.apiEndpoint + '/subaccountAdminDevices'; 

  constructor(private httpClient: HttpClient) { }

  /**
   * create new note
   * @param data: note
   * @returns: Observable 
  */
  public createAdminDevice(data: any): Observable<any>{
    return this.httpClient.post(this.API_URL, data);
  }

  /**
   * delete note by deviceToken
   * @param deviceToken: string 
   * @returns: Observable 
   */
  public deleteAdminDevice(deviceToken:string): Observable<any>{
    return this.httpClient.delete(`${this.API_URL}/${encodeURIComponent(deviceToken)}`);
  }

}
