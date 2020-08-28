import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Rxjs
import { Observable } from 'rxjs';


// Environment
import { environment } from '../../../../environments/environment';

@Injectable()
export class LayTripStateService {

  constructor(
    protected http: HttpClient,
  ) {
  }


  private setHeaders(params = '') {
    const accessToken = localStorage.getItem('_lay_sess');
    let headers: any = {};
    headers.language = 'en';
    headers.currency = 'USD';
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    const reqData = {
      headers
    };
    if (params) {
      let reqParams = {};
      Object.keys(params).map(k => {
        reqParams[k] = params[k];
      });
      reqData['params'] = reqParams;
    }
    return reqData;
  }

  getFlightSearchResult(data): Observable<any> {
    const url = environment.apiUrl + `v1/flight/search-oneway-flight`;
    // const url = environment.apiUrl + `v1/flight/search-oneway-flight?language=${data.language}&currency=${data.currency}`;
    return this.http.post(url, data, this.setHeaders());
  }
}
