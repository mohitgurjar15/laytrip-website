import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry, } from 'rxjs/operators';
import { CommonFunction } from '../_helpers/common-function';

@Injectable({
    providedIn: 'root'
})

export class HotelService {

    headers = {
        currency: 'USD',
        language: 'en',
        token: ``,
    }
    constructor(
        private http: HttpClient,
        private commonFunction: CommonFunction
    ) {

    }

    searchHotels(data) {
        return this.http.post(`${environment.apiUrl}v1/hotel/search-location/`, data)
            .pipe(
                catchError(this.handleError)
            );
    }

    getHotelSearchResult(data) {
        return this.http.post(`${environment.apiUrl}v1/hotel/search/`, data, this.commonFunction.setHeaders(this.headers))
            .pipe(
                catchError(this.handleError)
            );
    }

    getFilterObjectsHotel(data) {
        return this.http.post(`${environment.apiUrl}v1/hotel/filter-objects`, data, this.commonFunction.setHeaders(this.headers))
            .pipe(
                catchError(this.handleError)
            );
    }

    getHotelDetail(id, token) {
        this.headers.token = `${token}`;
        return this.http.post(`${environment.apiUrl}v1/hotel/detail`, { hotel_id: id }, this.commonFunction.setHeaders(this.headers))
            .pipe(
                catchError(this.handleError)
            );
    }

    getRoomDetails(id, token) {
        //this.headers.token = `${token}`;
        return this.http.post(`${environment.apiUrl}v1/hotel/rooms`, { hotel_id: id, bundle:token }, this.commonFunction.setHeaders(this.headers))
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
}
