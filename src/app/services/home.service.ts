import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from '../../environments/environment';
import { CommonFunction } from "../_helpers/common-function";


@Injectable({
    providedIn: 'root',
  })
export class HomeService {
    private toString = new BehaviorSubject({});
    getToString = this.toString.asObservable();

  
    constructor(
        private http: HttpClient,
        private commonFunction: CommonFunction
        ) { }

    handleError(error) {
        let errorMessage = {};
        if (error.status == 0) {
            console.log("API Server is not responding")
        }
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = { message: error.error.message };
        } else {
            // server-side error
            errorMessage = { status: error.status, message: error.error.message };
        }
        return throwError(errorMessage);
    }    
    
    setToString(flightToCode) {
        this.toString.next(flightToCode)
    }

    getDealList(moduleId) {
        let headers = {
            currency: 'USD',
            language: 'en'
        }
        return this.http.get(`${environment.apiUrl}v1/deal/${moduleId}`, this.commonFunction.setHeaders(headers))
        .pipe(
            catchError(this.handleError)
        );
    }
}