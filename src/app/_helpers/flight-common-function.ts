import { Injectable } from '@angular/core';
import { CommonFunction } from './common-function';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})

export class FlightCommonFunction {

    constructor(
        private commonFunction:CommonFunction
      ) { }
    
    getPaymentStartDate(bookingInstalments) {
        if (bookingInstalments[1]) {
            const date = new Date(bookingInstalments[0].instalmentDate);
            return this.commonFunction.convertDateFormat(date, 'MM/DD/YYYY');
        } else {
            const date = new Date(bookingInstalments[0].instalmentDate);
            return this.commonFunction.convertDateFormat(date, 'MM/DD/YYYY');
        }
    }

    getPaymentEndDate(bookingInstalments) {
        return this.commonFunction.convertDateFormat(new Date(bookingInstalments[bookingInstalments.length - 1].instalmentDate), 'MM/DD/YYYY');
    }

}
