import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { catchError, retry, } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  apiURL = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {

  }

  handleError(error) {
    console.log("====", error);
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


  googleSocialLogin(data) {
    return this.http.post(this.apiURL + 'v1/auth/social-login', data)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  signin(jsonData) {
    let json = {"email":jsonData.email,"password":jsonData.password}; 
    return this.http.post(this.apiURL + 'v1/auth/signin', json)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

}