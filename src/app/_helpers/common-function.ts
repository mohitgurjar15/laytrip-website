import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie';

@Injectable({
    providedIn: 'root',
})

export class CommonFunction {

    constructor(
        private cookieService:CookieService
    ){

    }

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

    setHeaders(params = null) {
        let reqData: any = {headers: {}};
        const accessToken = localStorage.getItem('_lay_sess');
        if (accessToken) {
            reqData = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            };
        }
        if (params) {
            let reqParams = {};
            Object.keys(params).map(k => {
                reqData.headers[k] = params[k];
            });
            //reqData.headers = reqParams;
        }
        return reqData;
    }

    convertDateFormat(date, sourceFormat, languageCode = null) {

        if (languageCode == null) {
            return moment(date, sourceFormat).format('MM/DD/YYYY')
        }
        return date;
    }

    convertDateYYYYMMDD(date, sourceFormat) {
        
        return moment(date, sourceFormat).format('YYYY-MM-DD')
       
    }
    dateFormat(languageCode = null) {

        const dateFormats = {
            en: {
                date: 'MM/DD/YYYY',
                datetime: 'MM/DD/YYYY hh',
                minuteseconds: 'HH:II'
            }
        }

        if (languageCode != null)
            return dateFormats[languageCode]
        else
            dateFormats.en;
    }

    onInputEntry(event, nextInput) {
        const input = event.target;
        const length = input.value.length;
        const maxLength = input.attributes.maxlength.value;

        if (length >= maxLength && nextInput) {
            nextInput.focus();
        }
    }

    /** 
     * @by Mohit Gurjar
     * String to convert in date forrmat {YYYY-MM-DD}
     * @param string in date [04/12/2020]
     * @param saprator [/]
     */
    stringToDate(string, saprator) {
        let dateArray = string.split(saprator);
        return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
    }

    /** 
     * @by Mohit Gurjar
     * Difference between two dates / current date in Days
     * @param string in date [24/10/2020]
     * @param date
     */
    getPaymentDueDay(dateSent) {
        let currentDate = new Date();
        dateSent = new Date(dateSent);
        const days = Math.floor((Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));
        if (days > 0) {
          return days;
        } else {
          return 0;
        }
      }

    decodeUrl(url){
        let prevUrl=[];
        let queryParams={}
        if(url){
            prevUrl = url.split('?')
            if(typeof prevUrl[1]!='undefined'){

                let params = prevUrl[1].split('&');
                for(let i in params){
                    let param = params[i].split("=");
                    queryParams[param[0]]=param[1];
                }
            }

            return {
                url : prevUrl[0],
                params : queryParams
            }
        }
        return {
            url : '/',
            params : {}
        };
    }

    getUserCountry(){

        try{
          let countryCode = localStorage.getItem("__uorigin");
          return countryCode || '';
        }
        catch(e){
            return '';
        }
    }
}

