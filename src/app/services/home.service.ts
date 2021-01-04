import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn: 'root',
  })
export class HomeService {
    private toString = new BehaviorSubject({});
    getToString = this.toString.asObservable();

  
    constructor() { }

    setToString(flightToCode) {
        this.toString.next(flightToCode)
    }

}