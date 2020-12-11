import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, retry, } from 'rxjs/operators';
import { CommonFunction } from '../_helpers/common-function';


@Injectable({
  providedIn: 'root'
})
export class VacationRentalService {

   constructor(
        private http: HttpClient,
        private commonFunction: CommonFunction
    ) {

    }


    searchRentalData(searchItem) {
        return this.http.get(`${environment.apiUrl}v1/vacation-rental/search-location?search_name=${searchItem}`)
            .pipe(
                catchError(this.handleError)
            );
    }

     getRentalDetailSearchData(data) {
        let headers = {
            currency: 'USD',
        }
        const url = environment.apiUrl + `v1/vacation-rental/availability`;
        return this.http.post(url, data, this.commonFunction.setHeaders(headers)).pipe(
            catchError(this.handleError)
        );
    }

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
}
