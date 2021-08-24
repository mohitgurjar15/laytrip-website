import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie';
import { getLoginUserInfo } from './jwt.helper';
import { ActivatedRoute, Router } from '@angular/router';
@Injectable({
    providedIn: 'root',
})

export class CommonFunction {

    constructor(
        private cookieService: CookieService,
        private _location: Location,
        private router: Router,
        private route: ActivatedRoute
    ) {
        // Author: xavier | 2021/8/24
        // Description: Set locale for date & time functions
        // const lang = localStorage.getItem('_lang');
        // if(lang != null) {
        //     moment.locale(JSON.parse(lang).iso_1Code);
        // }
    }

    closeModal(modelBox) {
        return modelBox = false;
    }

    onRightClickDisabled(event) {
        event.preventDefault();
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
    validatePhoneCode(e: any) {
        let input = String.fromCharCode(e.charCode);
        const reg = /^[0-9+]*$/;

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
        let reqData: any = { headers: {} };
        const accessToken = localStorage.getItem('_lay_sess');
        if (accessToken) {
            reqData = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    referral_id: this.route.snapshot.queryParams['utm_source'] ? `${this.route.snapshot.queryParams['utm_source']}` : ``
                },
            };
        }
        if (params) {
            let reqParams = {};
            Object.keys(params).map(k => {
                reqData.headers[k] = params[k];
            });
            reqData.headers.referral_id = this.route.snapshot.queryParams['utm_source'] ? `${this.route.snapshot.queryParams['utm_source']}` : ``;
            //reqData.headers = reqParams;
        }
        return reqData;
    }

    setWithoutLoginHeader(){
        if(this.route.snapshot.queryParams['utm_source']){
        return {
            headers: {
                referral_id: this.route.snapshot.queryParams['utm_source'] ? `${this.route.snapshot.queryParams['utm_source']}` : ``
            },
        };
        } else {
        return {}
        }
    }

    convertDateFormat(date, sourceFormat, languageCode = null) {
        if (languageCode == null) {
            return moment(date, sourceFormat).format('MMM DD, YYYY')
        }
        return date;
    }

    convertDateYYYYMMDD(date, sourceFormat) {

        return moment(date, sourceFormat).format('YYYY-MM-DD')

    }
    convertDateMMDDYYYY(date, sourceFormat) {

        return moment(date, sourceFormat).format('MM/DD/YYYY')

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

    decodeUrl(url) {
        let prevUrl = [];
        let queryParams = {}
        if (url) {
            prevUrl = url.split('?')
            if (typeof prevUrl[1] != 'undefined') {

                let params = prevUrl[1].split('&');
                for (let i in params) {
                    let param = params[i].split("=");
                    queryParams[param[0]] = param[1];
                }
            }

            return {
                url: prevUrl[0],
                params: queryParams
            }
        }
        return {
            url: '/',
            params: {}
        };
    }

    getUserCountry() {

        try {
            let countryCode = localStorage.getItem("__uorigin");
            return countryCode || '';
        }
        catch (e) {
            return '';
        }
    }

    goBack() {
        this._location.back();
    }

    convertFlotToDecimal(floatNumber) {
        return Math.round(floatNumber);
    }

    getGuestUser() {

        let userDetails = getLoginUserInfo();
        if (!userDetails.roleId || userDetails.roleId == 7) {

            let guestuserId = localStorage.getItem('__gst')
            if (guestuserId) {
                return guestuserId
            }
            else {
                return '';
            }
        }
        else {
            return '';
        }
    }

    convertCustomDateFormat(date, sourceFormat, destFormat, languageCode = null) {

        if (languageCode == null) {
            return moment(date, sourceFormat).format(destFormat)
        }
        return date;
    }

    preventNumberInput(event: any) {
        var a = [];
        var k = event.which;

        for (let i = 48; i < 58; i++)
            a.push(i);

        if ((a.indexOf(k) >= 0))
            event.preventDefault();
    }

    preventSpecialCharacter(event: any) {
        var a = [];
        var k = event.charCode;

        if ((k >= 33 && k <= 91) || k == 32 || k == 64 || (k >= 123 && k <= 126) || (k >= 92 && k <= 96))
            event.preventDefault();
    }

    convertTime(time, sourceFormat, targetFormat) {
        return moment(time, sourceFormat).format(targetFormat)
    }

    isRefferal() {
        // console.log("utm_source",this.route.snapshot.queryParams['utm_source'])
        if (this.route.snapshot.queryParams && this.route.snapshot.queryParams['utm_source']) {
            return true
        }else {
            return false;
        } 
    }
    getRefferalParms(){
        var parms : any = {};
        if (this.route.snapshot.queryParams && this.route.snapshot.queryParams['utm_source']) {
            parms.utm_source = this.route.snapshot.queryParams['utm_source'];
        } 
        if (this.route.snapshot.queryParams && this.route.snapshot.queryParams['utm_medium']) {
            parms.utm_medium = this.route.snapshot.queryParams['utm_medium'];
        } 
        if (this.route.snapshot.queryParams && this.route.snapshot.queryParams['utm_campaign']) {
            parms.utm_campaign =  this.route.snapshot.queryParams['utm_campaign'];
        } 
        return parms;
    }

    
}

