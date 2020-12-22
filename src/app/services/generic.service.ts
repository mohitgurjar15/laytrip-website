import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from 'rxjs/operators';
import { CommonFunction } from './../_helpers/common-function'

@Injectable({
  providedIn: 'root'
})

export class GenericService {

  constructor(
    private http: HttpClient,
    private commonFunction: CommonFunction
  ) {

  }


  getAllLangunage() {
    return this.http.get(`${environment.apiUrl}v1/language`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCurrencies() {
    return this.http.get(`${environment.apiUrl}v1/currency`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getModules() {
    return this.http.get(`${environment.apiUrl}v1/modules`)
      .pipe(
        catchError(this.handleError)
      );
  }

  saveCard(cardData) {
    return this.http.post(`${environment.apiUrl}v1/payment/add-card`, cardData, this.commonFunction.setHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  getCardlist() {

    return this.http.get(`${environment.apiUrl}v1/payment`, this.commonFunction.setHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  getInstalemnts(data) {
    return this.http.post(`${environment.apiUrl}v1/instalment/calculate-instalment`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  getInstalemntsAvailability(data) {
    return this.http.post(`${environment.apiUrl}v1/instalment/instalment-availability`, data)
      .pipe(
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

  getCountry() {
    return this.http.get(environment.apiUrl + 'v1/generic/country', this.commonFunction.setHeaders());
  }

  getState(stateId) {
    return this.http.get(environment.apiUrl + 'v1/generic/state/' + stateId, this.commonFunction.setHeaders());
  }
  getStates(countryId) {
    return this.http.get(environment.apiUrl + 'v1/generic/country/' + countryId + '/state', this.commonFunction.setHeaders());
  }

  getAvailableLaycredit() {
    return this.http.get(environment.apiUrl + 'v1/laytrip-point/total-available-points/', this.commonFunction.setHeaders());
  }

  createEnquiry(data) {
    return this.http.post(`${environment.apiUrl}v1/enqiry`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCmsByPageType(type) {
    const payload = { page_type: type };
    return this.http.get(environment.apiUrl + 'v1/cms/' + payload.page_type, this.commonFunction.setHeaders());
  }

  getUserLocationInfo(){
    return this.http.get(environment.apiUrl + 'v1/generic/location/');
  }

  getFaqData() {
    return this.http.get(environment.apiUrl + 'v1/faq');
  }

  checkUserValidate(token) {
    return this.http.get(environment.apiUrl + 'v1/auth/validate-user/' + token);
  }

  addPushSubscriber(data){
    console.log(data)
    return this.http.post(`${environment.apiUrl}v1/auth​/add-notification-token`, data)
      .pipe(
        catchError(this.handleError)
      );
  }
}
