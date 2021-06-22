import { Injectable, Output,EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export enum Events{
    'select_traveler',
}

@Injectable({
    providedIn: 'root',
  })
export class CheckOutService {
    
    private traveler = new BehaviorSubject({});
    getTraveler = this.traveler.asObservable();

    private traveler_number = new BehaviorSubject(0);
    getTravelerNumber = this.traveler_number.asObservable();

    private travelers = new BehaviorSubject([]);
    getTravelers = this.travelers.asObservable();

    private travelerFormData = new BehaviorSubject([]);
    getTravelerFormData = this.travelerFormData.asObservable();

    private countires = new BehaviorSubject([])
    getCountries = this.countires.asObservable();

    private priceSummary = new BehaviorSubject({})
    getPriceSummary = this.priceSummary.asObservable();

    constructor() { }

    selectTraveler(traveler) {
        this.traveler.next(traveler)
    }

    selectTravelerNumber(traveler_number){
        this.traveler_number.next(traveler_number)
    }

    setTravelers(travelers){
        this.travelers.next(travelers)
    }

    emitTravelersformData(travelers){
        this.travelerFormData.next(travelers)
    }

    setCountries(countires){
        this.countires.next(countires)
    }

    setPriceSummary(priceSummary){
        this.priceSummary.next(priceSummary)
    }
}
   