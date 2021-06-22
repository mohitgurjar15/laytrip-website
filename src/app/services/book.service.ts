import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { CommonFunction } from "../_helpers/common-function";
import { throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class BookService {
  constructor(
    private http: HttpClient,
    private commonFunction: CommonFunction
  ) {}

  validate(payload) {
    let headers = {
      currency: 'USD',
      language: 'en'
    };
    return this.http.post(`${environment.apiUrl}v1/payment/validate`, payload, this.commonFunction.setHeaders(headers))
      .pipe(
        catchError(this.handleError)
      );
  }

  bookFlight(payload) {
    let headers = {
      currency: "USD",
      language: "en",
    };

    return this.http.post(
        `${environment.apiUrl}v1/book`,
        payload,
        this.commonFunction.setHeaders(headers)
      )
      .pipe(catchError(this.handleError));
  }

  handleError(error) {
    let errorMessage = {};
    if (error.status == 0) {
      console.log("API Server is not responding");
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
