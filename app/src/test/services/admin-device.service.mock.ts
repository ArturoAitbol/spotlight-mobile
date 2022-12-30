import { Observable } from "rxjs";

export const ADMIN_DEVICE_SERVICE_MOCK = {
    createDevice: ()=>{
        return new Observable((observer) => {
            observer.next(
                JSON.parse(JSON.stringify({id:'00000-0000-000'}))
            );
            observer.complete();
            return {
                unsubscribe() { }
            };
        });
    },
    deleteDevice: (noteId:string)=>{
        return new Observable((observer) => {
            observer.next();
            observer.complete();
            return {
                unsubscribe() { }
            };
        });
    }
}