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

    private traveler_number = new BehaviorSubject({});
    getTravelerNumber = this.traveler_number.asObservable();

    private travelers = new BehaviorSubject([]);
    getTravelers = this.travelers.asObservable();

    private travelerFormData = new BehaviorSubject([]);
    getTravelerFormData = this.travelerFormData.asObservable();

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
}
   