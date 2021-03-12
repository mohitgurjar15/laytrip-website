import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { CommonFunction } from "../_helpers/common-function";
import { environment } from '../../environments/environment';
import { throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
  })

  export class AccountService {
  
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
      
    getIncomplteBooking(search){
        return this.http.get(`${environment.apiUrl}v1/booking/incomplete-bookings?search=`+ search, this.commonFunction.setHeaders())
            .pipe(
                catchError(this.handleError)
            );
    } 
    getComplteBooking(search){
        return this.http.get(`${environment.apiUrl}v1/booking/complete-bookings?search=`+ search, this.commonFunction.setHeaders())
            .pipe(
                catchError(this.handleError)
            );
    } 
    
    cancelBooking(bookingId){
        return this.http.delete(`${environment.apiUrl}v1/booking?booking_id=`+bookingId, this.commonFunction.setHeaders())
            .pipe(
                catchError(this.handleError)
            );
    } 
}   