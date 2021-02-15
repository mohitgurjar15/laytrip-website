"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CommonFunction = void 0;
var core_1 = require("@angular/core");
var moment = require("moment");
var CommonFunction = /** @class */ (function () {
    function CommonFunction(cookieService, _location) {
        this.cookieService = cookieService;
        this._location = _location;
    }
    CommonFunction.prototype.closeModal = function (modelBox) {
        return modelBox = false;
    };
    CommonFunction.prototype.parseDateWithFormat = function (date) {
        if (date.departuredate) {
            return {
                departuredate: moment(date.departuredate.date1).format('YYYY-MM-DD')
            };
        }
        if (date.returndate) {
            return { returndate: moment(date.returndate.date1).format('YYYY-MM-DD') };
        }
    };
    CommonFunction.prototype.validateNumber = function (e) {
        var input = String.fromCharCode(e.charCode);
        var reg = /^[0-9]*$/;
        if (!reg.test(input)) {
            e.preventDefault();
        }
    };
    CommonFunction.prototype.validatePhoneCode = function (e) {
        var input = String.fromCharCode(e.charCode);
        var reg = /^[0-9+]*$/;
        if (!reg.test(input)) {
            e.preventDefault();
        }
    };
    CommonFunction.prototype.validateNotAllowSpecial = function (e) {
        var input = String.fromCharCode(e.charCode);
        var reg = /^[a-zA-Z0-9-]*$/;
        if (!reg.test(input)) {
            e.preventDefault();
        }
    };
    CommonFunction.prototype.setHeaders = function (params) {
        if (params === void 0) { params = null; }
        var reqData = { headers: {} };
        var accessToken = localStorage.getItem('_lay_sess');
        if (accessToken) {
            reqData = {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            };
        }
        if (params) {
            var reqParams = {};
            Object.keys(params).map(function (k) {
                reqData.headers[k] = params[k];
            });
            //reqData.headers = reqParams;
        }
        return reqData;
    };
    CommonFunction.prototype.convertDateFormat = function (date, sourceFormat, languageCode) {
        if (languageCode === void 0) { languageCode = null; }
        if (languageCode == null) {
            return moment(date, sourceFormat).format('MMM DD, YYYY');
        }
        return date;
    };
    CommonFunction.prototype.convertDateYYYYMMDD = function (date, sourceFormat) {
        return moment(date, sourceFormat).format('YYYY-MM-DD');
    };
    CommonFunction.prototype.dateFormat = function (languageCode) {
        if (languageCode === void 0) { languageCode = null; }
        var dateFormats = {
            en: {
                date: 'MM/DD/YYYY',
                datetime: 'MM/DD/YYYY hh',
                minuteseconds: 'HH:II'
            }
        };
        if (languageCode != null)
            return dateFormats[languageCode];
        else
            dateFormats.en;
    };
    CommonFunction.prototype.onInputEntry = function (event, nextInput) {
        var input = event.target;
        var length = input.value.length;
        var maxLength = input.attributes.maxlength.value;
        if (length >= maxLength && nextInput) {
            nextInput.focus();
        }
    };
    /**
     * @by Mohit Gurjar
     * String to convert in date forrmat {YYYY-MM-DD}
     * @param string in date [04/12/2020]
     * @param saprator [/]
     */
    CommonFunction.prototype.stringToDate = function (string, saprator) {
        var dateArray = string.split(saprator);
        return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
    };
    /**
     * @by Mohit Gurjar
     * Difference between two dates / current date in Days
     * @param string in date [24/10/2020]
     * @param date
     */
    CommonFunction.prototype.getPaymentDueDay = function (dateSent) {
        var currentDate = new Date();
        dateSent = new Date(dateSent);
        var days = Math.floor((Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));
        if (days > 0) {
            return days;
        }
        else {
            return 0;
        }
    };
    CommonFunction.prototype.decodeUrl = function (url) {
        var prevUrl = [];
        var queryParams = {};
        if (url) {
            prevUrl = url.split('?');
            if (typeof prevUrl[1] != 'undefined') {
                var params = prevUrl[1].split('&');
                for (var i in params) {
                    var param = params[i].split("=");
                    queryParams[param[0]] = param[1];
                }
            }
            return {
                url: prevUrl[0],
                params: queryParams
            };
        }
        return {
            url: '/',
            params: {}
        };
    };
    CommonFunction.prototype.getUserCountry = function () {
        try {
            var countryCode = localStorage.getItem("__uorigin");
            return countryCode || '';
        }
        catch (e) {
            return '';
        }
    };
    CommonFunction.prototype.goBack = function () {
        this._location.back();
    };
    CommonFunction.prototype.convertFlotToDecimal = function (floatNumber) {
        return Math.round(floatNumber);
    };
    CommonFunction = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CommonFunction);
    return CommonFunction;
}());
exports.CommonFunction = CommonFunction;
