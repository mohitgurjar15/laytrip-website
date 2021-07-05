import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, retry, } from 'rxjs/operators';
import { CommonFunction } from '../_helpers/common-function';


@Injectable({
    providedIn: 'root'
})

export class FlightService {

    private sortFilter = new BehaviorSubject([]);
    getLastApplyedSortFilter = this.sortFilter.asObservable();

    constructor(
        private http: HttpClient,
        private commonFunction: CommonFunction
    ) {

    }


    searchAirport(searchItem) {
        return this.http.get(`${environment.apiUrl}v1/flight/search-airport/${searchItem}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    searchRoute(searchItem,isFromLocation,alternateLocation=''){
        return this.http.get(`${environment.apiUrl}v1/flight/route/search?search=${searchItem}&is_from_location=${isFromLocation}&alternet_location=${alternateLocation}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    searchAirports(type=''){
        return this.http.get(`${environment.apiUrl}v1/flight/route/${type}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    airRevalidate(routeCode) {

        let headers = {
            currency: 'USD',
            language: 'en'
        }

        return this.http.post(`${environment.apiUrl}v1/flight/air-revalidate/`, routeCode, this.commonFunction.setHeaders(headers))
            .pipe(
                catchError(this.handleError)
            );
    }

    getBaggageDetails(routeCode) {
        const payload = { route_code: routeCode };
        return this.http.post(`${environment.apiUrl}v1/flight/baggage-details`, payload)
            .pipe(
                catchError(this.handleError)
            );
    }

    getCancellationPolicy(routeCode) {
        const payload = { route_code: routeCode };
        return this.http.post(`${environment.apiUrl}v1/flight/cancellation-policy`, payload)
            .pipe(
                catchError(this.handleError)
            );
    }

    bookFligt(payload) {
        let headers = {
            currency: 'USD',
            language: 'en'
        }
        return this.http.post(`${environment.apiUrl}v1/flight/book`, payload, this.commonFunction.setHeaders(headers))
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

    getBookingDetails(bookingId) {
        let headers = {
            currency: 'USD',
            language: 'en'
        }
        return this.http.get(`${environment.apiUrl}v1/flight/book/${bookingId}`, this.commonFunction.setHeaders(headers))
            .pipe(
                catchError(this.handleError)
            );
    }

    getFlightSearchResult(data) {
        let headers = {
            currency: 'USD',
            language: 'en'
        }
        const url = environment.apiUrl + `v1/flight/search-oneway-flight`;
        return this.http.post(url, data, this.commonFunction.setHeaders(headers)).pipe(
            retry(2),
            catchError(this.handleError)
        );
        
    }

    getFlightFlexibleDates(data) {
        let headers = {
            currency: 'USD',
            language: 'en'
        }
        const url = environment.apiUrl + `v1/flight/flexible-day-rate`;
        return this.http.post(url, data, this.commonFunction.setHeaders(headers)).pipe(
            catchError(this.handleError)
        );
    }
    getFlightFlexibleDatesRoundTrip(data) {
        let headers = {
            currency: 'USD',
            language: 'en'
        }
        const url = environment.apiUrl + `v1/flight/flexible-day-rate-for-round-trip`;
        return this.http.post(url, data, this.commonFunction.setHeaders(headers)).pipe(
            catchError(this.handleError)
        );
    }

    getFlightCalenderDate(data) {
        let headers = {
            currency: 'USD',
            language: 'en'
        }
        const url = environment.apiUrl + `v1/flight/calender-day-rate`;
        return this.http.post(url, data, this.commonFunction.setHeaders(headers)).pipe(
            catchError(this.handleError)
        );
    }

    getRoundTripFlightSearchResult(data) {
        let headers = {
            currency: 'USD',
            language: 'en'
        }
        const url = environment.apiUrl + `v1/flight/search-roundtrip-flight`;
        return this.http.post(url, data, this.commonFunction.setHeaders(headers)).pipe(
            retry(2),
            catchError(this.handleError)
        );
    }

    addFeedback(payload) {
        return this.http.post(`${environment.apiUrl}v1/laytrip-feedback/add-laytrip-feedback`, payload, this.commonFunction.setHeaders())
            .pipe(
                catchError(this.handleError)
            );
    }

    getFlightBookingDetails(bookingId) {
        return this.http.get(`${environment.apiUrl}v1/booking/booking-details/${bookingId}`, this.commonFunction.setHeaders())
            .pipe(
                catchError(this.handleError)
            );
    }

    getPredictionDate(data) {
        let headers = {
            currency: 'USD',
            language: 'en'
        }
        const url = environment.apiUrl + `v1/flight/predicted-booking-date`;
        return this.http.post(url, data, this.commonFunction.setHeaders(headers)).pipe(
            catchError(this.handleError)
        );
    }

    getSellingPrice(data) {
        const url = environment.apiUrl + `v1/flight/selling-price`;
        return this.http.post(url, data, this.commonFunction.setHeaders()).pipe(
            catchError(this.handleError)
        );
    }

    sendEmail(data) {
        const url = environment.apiUrl + `v1/booking/share-booking-detail`;
        return this.http.post(url, data, this.commonFunction.setHeaders()).pipe(
            catchError(this.handleError)
        );
    }

    setSortFilter(filter){
        this.sortFilter.next(filter)
    }

}
