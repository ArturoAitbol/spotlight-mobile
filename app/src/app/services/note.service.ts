import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Note } from '../model/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private readonly API_URL: string = environment.apiEndpoint + '/notes'; 

  constructor(private httpClient: HttpClient) { }

  /**
  * fetch notes list
  * @returns: Observable 
  */
  public getNoteList(subaccountId:string, status?: string): Observable<any[]>{
    let params = new HttpParams().set('subaccountId', subaccountId);
    if (status) params = params.set('status', status);
    return this.httpClient.get<any>(this.API_URL, {params});
  }

  /**
   * create new note
   * @param data: note
   * @returns: Observable 
  */
  public createNote(data:Note):Observable<any>{
    return this.httpClient.post(this.API_URL, data);
  }

  /**
   * delete note by noteId
   * @param noteId: string 
   * @returns: Observable 
   */
  public deleteNote(noteId:string):Observable<any>{
    return this.httpClient.delete(`${this.API_URL}/${noteId}`);
  }

}
