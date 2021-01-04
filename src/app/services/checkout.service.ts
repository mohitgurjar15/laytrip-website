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

    constructor() { }

    selectTraveler(traveler) {
        this.traveler.next(traveler)
    }
}
   