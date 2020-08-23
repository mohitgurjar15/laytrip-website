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
  
  signup(formValue) {
    let data = {
      "signup_via":"web",
      "first_name":formValue.first_name,
      "last_name":formValue.last_name,
      "email":formValue.email,
      "password":formValue.password,
      "confirm_password":formValue.confirm_password,
      "gender":formValue.gender,
      "device_type":1,
      "device_model":"RNE-L22",
      "device_token":"123abc#$%456",
      "app_version":"1.0",
      "os_version":"7.0",
     }; 
    return this.http.post(this.apiURL + 'v1/auth/signup', data)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  verifyOtp(data) {
   
    return this.http.patch(this.apiURL + 'v1/auth/verify-otp', data)
      .pipe(
        retry(1),
        catchError(this.handleError)
    );
  }

  forgotPassword(formValue) {
    let data = {
      "email":formValue.email,
     }; 
    return this.http.post(this.apiURL + 'v1/auth/forgot-password', data)
      .pipe(
        retry(1),
        catchError(this.handleError)
    );
  }

}