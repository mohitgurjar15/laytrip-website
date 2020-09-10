import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})

export class CommonFunction {

    closeModal(modelBox) {
        return modelBox = false;
    }

    parseDateWithFormat(date) {
        if (date.departuredate) {
            return {
                departuredate: moment(date.departuredate.date1).format('YYYY-MM-DD')
            };
        }
        if (date.returndate) {
            return { returndate: moment(date.returndate.date1).format('YYYY-MM-DD') };
        }
    }
    validateNumber(e: any) {
        let input = String.fromCharCode(e.charCode);
        const reg = /^[0-9]*$/;

        if (!reg.test(input)) {
            e.preventDefault();
        }
    }
    validateNotAllowSpecial(e: any) {
        let input = String.fromCharCode(e.charCode);
        var reg = /^[a-zA-Z0-9-]*$/;
        if (!reg.test(input)) {
            e.preventDefault();
        }
    }

    setHeaders(params=null) {      
        const accessToken = localStorage.getItem('_lay_sess');
        let reqData:any = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        };
        if(params) {
            let reqParams = {};        
            Object.keys(params).map(k =>{
                reqData.headers[k] = params[k];
            });
            //reqData.headers = reqParams;
        }
        return reqData;
    }  

    convertDateFormat(date,sourceFormat,languageCode=null){

        if(languageCode==null){
           return moment(date, sourceFormat).format('MM/DD/YYYY')
        }
        return date;
    }

    dateFormat(languageCode=null){

        const dateFormats={
            en : {
                date            : 'MM/DD/YYYY',
                datetime        : 'MM/DD/YYYY hh',
                minuteseconds   : 'HH:II' 
            }
        }

        if(languageCode!=null)
            return dateFormats[languageCode]
        else
            dateFormats.en;
    }

    onInputEntry(event, nextInput) {
        const input = event.target;
        const length = input.value.length;
        const maxLength = input.attributes.maxlength.value;
    
        if (length >= maxLength) {
          nextInput.focus();
        }
      }
    
}

