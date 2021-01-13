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
    private traveler_number = new BehaviorSubject({});
    getTraveler = this.traveler.asObservable();
    getTravelerNumber = this.traveler_number.asObservable();

    private travelers = new BehaviorSubject([]);
    getTravelers = this.travelers.asObservable();

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
}
   