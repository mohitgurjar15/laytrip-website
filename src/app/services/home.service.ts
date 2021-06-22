import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from '../../environments/environment';
import { CommonFunction } from "../_helpers/common-function";

@Injectable({
    providedIn: 'root',
  })
export class HomeService {
    private toString : any = new BehaviorSubject({});
    private fromDestinationInfo : any = new BehaviorSubject({});
    getToString = this.toString.asObservable();
    getLocationForHotelDeal = this.fromDestinationInfo.asObservable();
    private tabName = new BehaviorSubject([]);
    private sliderOffers = new BehaviorSubject([]);
    getActiveTabName = this.tabName.asObservable();
    getSlideOffers = this.sliderOffers.asObservable();

    private swipeSlide : any = new BehaviorSubject({});
    getSwipeSlide = this.swipeSlide.asObservable();

    private landingPageData : any = new BehaviorSubject({});
    getLandingPageData = this.landingPageData.asObservable();


    constructor(
        private http: HttpClient,
        private commonFunction: CommonFunction
        ) { }

    handleError(error) {
        let errorMessage = {};
        if (error.starepertoireSubjecttus == 0) {
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
    

    setActiveTab(tabName){
        this.tabName.next(tabName)
    }

    setLandingPageData(data){
        console.log('here')
        this.landingPageData.next(data)
    }
    setOffersData(offers){
        this.sliderOffers.next(offers);
    }

    setToString(flightToCode) {
        this.toString.next(flightToCode)
    }

    setLocationForHotel(destinationInfo) {
        this.fromDestinationInfo.next(destinationInfo)
    }

    getDealList(moduleId) {
        let headers = {
            currency: 'USD',
            language: 'en'
        }
        return this.http.get(`${environment.apiUrl}v1/deal/${moduleId}`, this.commonFunction.setHeaders(headers))
        .pipe(
            catchError(this.handleError)
        );
    }

    removeToString(module) {
        if(module == 'flight' ){
            this.toString.next({});
        } else if(module == 'hotel' ) {
            this.fromDestinationInfo.next({})
        } else {
            
        }
    }   

    setSwipeSlideDirection(direction){
        this.swipeSlide.next(direction)
    }
}