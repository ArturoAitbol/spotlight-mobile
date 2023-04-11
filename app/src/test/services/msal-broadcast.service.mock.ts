import { EventMessage, EventType } from '@azure/msal-browser';
import { Observable } from 'rxjs';

export class MsalBroadcastServiceMock {

    expectedEventType: EventType;
    constructor(expectedEventType: EventType){
        this.expectedEventType = expectedEventType;
    }

    msalSubject$ = new Observable<EventMessage>((observer) => {
            observer.next({ eventType: this.expectedEventType,
                interactionType: null,
                payload: {account: null},
                error: null,
                timestamp: 0,
            });
            observer.complete();
            return {
                unsubscribe: () => {}
            };
        })
};
