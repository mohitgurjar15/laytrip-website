import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { catchError, retry, } from 'rxjs/operators';
import { CommonFunction } from '../_helpers/common-function';
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  apiURL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private commonFunction: CommonFunction,
    private route: ActivatedRoute

  ) {

  }


  handleError(error) {
    let errorMessage = {};
    if (error.status == 0) {
      return throwError({ status: error.status, message: "API Server is not responding" });
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


  socialLogin(data) {
    return this.http.post(this.apiURL + 'v1/auth/social-login', data,this.commonFunction.setWithoutLoginHeader())
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  signin(jsonData) {
    let json = { "email": jsonData.email, "password": jsonData.password };
    return this.http.post(this.apiURL + 'v1/auth/signin', json)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }



  signup(formValue) {
    let data = {
      "signup_via": "web",
      "first_name": formValue.first_name,
      "last_name": formValue.last_name,
      "email": formValue.email,
      "password": formValue.password,
      "confirm_password": formValue.confirm_password,
      "device_type": 1,
      "device_model": navigator.appName,
      "device_token": "123abc#$%456",
      "app_version": navigator.appVersion,
      "os_version": navigator.platform,
      "referral_id": formValue.referral_id ? formValue.referral_id : ''
    };
    
    return this.http.post(this.apiURL + 'v1/auth/signup', data,this.commonFunction.setWithoutLoginHeader())
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  verifyOtp(data) {
    return this.http.patch(this.apiURL + 'v1/auth/verify-otp', data,this.commonFunction.setWithoutLoginHeader())
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  resendOtp(email) {
    let data = { "email": email };
    return this.http.patch(this.apiURL + 'v1/auth/resend-otp', data,this.commonFunction.setWithoutLoginHeader())
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  forgotPassword(formValue) {
    let data = {
      "email": typeof formValue.email != 'undefined' ? formValue.email : formValue,
    };
    return this.http.post(this.apiURL + 'v1/auth/forgot-password', data,this.commonFunction.setWithoutLoginHeader())
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  resetPassword(data) {
    return this.http.post(this.apiURL + 'v1/auth/reset-password', data,this.commonFunction.setWithoutLoginHeader());
  }

  deleteAccount(isRequireBackupFile) {
    const accessToken = localStorage.getItem('_lay_sess');
    /*   const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            
        },
      } */
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        requireBackupFile: isRequireBackupFile
      }
    }
    return this.http.delete(this.apiURL + 'v1/user/account/request', options)
  }

  changePassword(data) {
    return this.http.put(this.apiURL + 'v1/auth/change-password', data, this.commonFunction.setHeaders());
  }

  updateProfile(data) {
    return this.http.put(this.apiURL + 'v1/auth/profile', data, this.commonFunction.setHeaders());
  }
  updateProfileImage(data) {
    return this.http.put(this.apiURL + 'v1/auth/profile/picture', data, this.commonFunction.setHeaders());
  }
  getProfile() {
    return this.http.get(this.apiURL + 'v1/auth/profile/', this.commonFunction.setHeaders());
  }

  changePreference(data) {
    return this.http.put(this.apiURL + 'v1/auth/preference', data, this.commonFunction.setHeaders());
  }
  getPreference() {
    return this.http.get(this.apiURL + 'v1/auth/preference', this.commonFunction.setHeaders());
  }
  getBookings(pageNumber, limit, filterForm) {
    let queryString = "";
    if (filterForm && filterForm != 'undefined') {
      if (filterForm.bookingId) {
        queryString += (filterForm.bookingId) ? '&booking_id=' + filterForm.bookingId : '';
      }
      if (filterForm.module) {
        queryString += (filterForm.module.id) ? '&booking_type=' + filterForm.module.id : '';
      }
      if (filterForm.start_date) {
        queryString += (filterForm.start_date) ? '&start_date=' + moment(filterForm.start_date).format("YYYY-MM-DD") : '';
      }
      if (filterForm.end_date) {
        queryString += (filterForm.end_date) ? '&end_date=' + moment(filterForm.end_date).format("YYYY-MM-DD") : '';
      }
    }
    return this.http.get(
      `${this.apiURL}v1/booking/user-booking-list?module_id=1&limit=${limit}&page_no=${pageNumber}${queryString}`, this.commonFunction.setHeaders());
  }

  getPaymentHistory(pageNumber, limit, filterForm, payment_status) {

    let queryString = "";
    if (filterForm && filterForm != 'undefined') {
      if (filterForm.bookingId) {
        queryString += (filterForm.bookingId) ? '&booking_id=' + filterForm.bookingId : '';
      }
      if (filterForm.module) {
        queryString += (filterForm.module.id) ? '&booking_type=' + filterForm.module.id : '';
      }
      if (filterForm.start_date) {
        queryString += (filterForm.start_date) ? '&payment_start_date=' + moment(filterForm.start_date).format("YYYY-MM-DD") : '';
      }
      if (filterForm.end_date) {
        queryString += (filterForm.end_date) ? '&payment_end_date=' + moment(filterForm.end_date).format("YYYY-MM-DD") : '';
      }
    }

    return this.http.get(
      `${this.apiURL}v1/booking/payment?limit=${limit}&page_no=${pageNumber}${queryString}`, this.commonFunction.setHeaders());
  }

  getModules(pageNumber, limit) {
    return this.http.get(`${this.apiURL}v1/modules?limit=${limit}&page_no=${pageNumber}`, this.commonFunction.setHeaders())
  }

  getTraveller(travelerId) {
    return this.http.get(`${environment.apiUrl}v1/traveler/get-traveler/${travelerId}`, this.commonFunction.setHeaders())
  }

  getSubscriptionList() {
    return this.http.get(this.apiURL + 'v1/subscription/', this.commonFunction.setHeaders());
  }

  getCardList() {
    return this.http.get(this.apiURL + 'v1/payment', this.commonFunction.setHeaders());
  }

  deleteCard() {
    return this.http.get(this.apiURL + 'v1/payment', this.commonFunction.setHeaders());
  }

  getSubscriptionPlanDetail(data) {
    return this.http.get(this.apiURL + 'v1/subscription/get-plan/' + data.id + '/' + data.currency, this.commonFunction.setHeaders());
  }

  payNowSubscription(data) {
    return this.http.post(this.apiURL + 'v1/subscription', data, this.commonFunction.setHeaders());
  }

  addNewPoints(data) {
    return this.http.post(this.apiURL + 'v1/laytrip-point/add', data, this.commonFunction.setHeaders());
  }

  subscribeNow(email) {
    const data = { email: email };
    return this.http.post(this.apiURL + 'v1/news-letters/subscribe', data);
  }

  emailVeryfiy(email) {
    return this.http.get(`${this.apiURL}v1/auth/verify-email-id?email=${email}`, this.commonFunction.setHeaders())
  }

  registerGuestUser(data) {

    return this.http.post(`${this.apiURL}v1/auth/guest-user`, data)
  }

  mapGuestUser(guestUserId) {
    return this.http.patch(`${this.apiURL}v1/cart/map-guest-user/${guestUserId}`, {}, this.commonFunction.setHeaders())
  }
}

