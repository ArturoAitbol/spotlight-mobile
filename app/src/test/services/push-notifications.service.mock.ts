import { Observable } from "rxjs";

export const PUSH_NOTIFICATIONS_SERVICE_MOCK = {
    initPush: ()=> {},
    AddActionAndReceivedListeners: ()=> {},
    unregisterDevice: (callback)=> { return callback(true); },
    newPushNotification$: new Observable((observer)=>{
      observer.next();
      observer.complete();
      return {
          unsubscribe(){ }
      }
    })
}
