import { Observable } from "rxjs";

export const ADMIN_DEVICE_SERVICE_MOCK = {
    createAdminDevice: ()=>{
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
    deleteAdminDevice: (token:string)=>{
        return new Observable((observer) => {
            observer.next();
            observer.complete();
            return {
                unsubscribe() { }
            };
        });
    }
}