import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForegroundService {

  // Observable source
  private backFromBackgroundSource = new Subject<void>();

  // Observable stream
  backFromBackground$ = this.backFromBackgroundSource.asObservable();

  constructor() { }

  announceBackFromBackground() {
    this.backFromBackgroundSource.next();
  }
}
