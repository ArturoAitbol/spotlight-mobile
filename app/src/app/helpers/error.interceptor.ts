import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { IonToastService } from "../services/ion-toast.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {


    constructor(private ionToastService: IonToastService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(err => {
                const error = err.error || err.statusText;
                if (!err.status)
                    this.ionToastService.presentToast('No internet connection', 'Error');
                else 
                    this.ionToastService.presentToast(error.error, 'Error');
                return throwError(error);
            })
        );
    }

}