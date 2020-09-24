import { Injectable } from '@angular/core';
import { CommonFunction } from './common-function';

@Injectable({
    providedIn: 'root',
})

export class FlightCommonFunction {

    constructor(
        private commonFunction:CommonFunction
      ) { }
    
    getPaymentStartDate(bookingInstalments) {
        if (bookingInstalments[1].instalmentDate) {
            return this.commonFunction.convertDateFormat(bookingInstalments[1].instalmentDate, 'YYYY-MM-DD', 'en');
        } else {
            return this.commonFunction.convertDateFormat(bookingInstalments[0].instalmentDate, 'YYYY-MM-DD', 'en');
        }
    }
    getPaymentEndDate(bookingInstalments) {
        return this.commonFunction.convertDateFormat(bookingInstalments[bookingInstalments.length - 1].instalmentDate, 'YYYY-MM-DD', 'en');
    }

}
