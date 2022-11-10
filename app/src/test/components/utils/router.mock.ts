import { NavigationEnd, RouterEvent } from "@angular/router";
import { Observable } from "rxjs";

export const ROUTER_MOCK = {
  navigate: (commands: string[]) => {
    console.log(commands);
  }
};

export class routerMock {

  expectedEvent: NavigationEnd;

  constructor(expectedEvent:NavigationEnd){
    this.expectedEvent = expectedEvent;
  }
  

  events = new Observable<RouterEvent>((observer) => {
    observer.next(this.expectedEvent);
    observer.complete();
    return {
        unsubscribe: () => {}
    };
  })

  navigate(commands: string[]) {
    console.log(commands);
  }
};
