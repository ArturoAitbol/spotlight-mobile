import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NOTE_SERVICE_MOCK } from 'src/test/services/note.service.mock';
import { Note } from '../model/note.model';

import { NoteService } from './note.service';

describe('NoteService', () => {
  let noteService: NoteService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    noteService = new NoteService(httpClientSpy);
  });

  it('should be created', () => {
    expect(noteService).toBeTruthy();
  });

  it('should make the proper http calls on getNoteList()', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(NOTE_SERVICE_MOCK.getNoteList());

    let subaccountId = '00000-0000-000'
    noteService.getNoteList(subaccountId).subscribe({
        next: () => { done(); },
        error: done.fail
    });
    let params = new HttpParams().set('subaccountId', subaccountId);
    expect(httpClientSpy.get).toHaveBeenCalledWith(environment.apiEndpoint + '/notes',{ params });


    noteService.getNoteList(subaccountId,'Open').subscribe({
      next: () => { done(); },
      error: done.fail
    });
    params.append('status', 'Open');
    expect(httpClientSpy.get).toHaveBeenCalledWith(environment.apiEndpoint + '/notes',{ params });
  });

  
  it('should make the proper http calls on createNote()', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue(NOTE_SERVICE_MOCK.createNote());

    const noteToCreate: Note = {
      id:'00000-0000-000',
      subaccountId:'000-aaaa-bbbb-cccc',
      content:'test contet'
  }
    noteService.createNote(noteToCreate).subscribe({
        next: () => { done(); },
        error: done.fail
    });
    expect(httpClientSpy.post).toHaveBeenCalledWith(environment.apiEndpoint + '/notes',noteToCreate);
  });

  it('should make the proper http calls on deleteNote()', (done: DoneFn) => {
    let noteId = '00000-0000-000'
    httpClientSpy.delete.and.returnValue(NOTE_SERVICE_MOCK.deleteNote(noteId));
   
    noteService.deleteNote(noteId).subscribe({
        next: () => { done(); },
        error: done.fail
    });
    expect(httpClientSpy.delete).toHaveBeenCalledWith(environment.apiEndpoint + '/notes/'+ noteId);
  });

});
