import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { OnDestroy, Injectable } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class Interceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            catchError((error) => {
                console.log(error);
                return of(error);
            })
        );

    }
}
