import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { IonToastService } from "../services/ionToast.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {


    constructor(private ionToastService:IonToastService){
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError( err => {
                console.error(err);
                const error = err.statusText=="Unknown Error"? err.statusText : (err.error.error || err.statusText);
                this.ionToastService.presentToast(error,'Error');
                return throwError(error);
            })
        );
    }

}