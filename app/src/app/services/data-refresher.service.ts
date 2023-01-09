import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataRefresherService {

  // Observable source
  private backToActiveAppSource = new Subject<void>();

  // Observable stream
  backToActiveApp$ = this.backToActiveAppSource.asObservable();

  constructor() { }

  announceBackFromBackground() {
    this.backToActiveAppSource.next();
  }
}
