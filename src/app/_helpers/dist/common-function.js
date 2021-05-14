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
var jwt_helper_1 = require("./jwt.helper");
var CommonFunction = /** @class */ (function () {
    function CommonFunction(cookieService, _location, router, route) {
        this.cookieService = cookieService;
        this._location = _location;
        this.router = router;
        this.route = route;
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
                    Authorization: "Bearer " + accessToken,
                    referral_id: this.route.snapshot.queryParams['utm_source'] ? "" + this.route.snapshot.queryParams['utm_source'] : ""
                }
            };
        }
        console.log(this.route.snapshot.queryParams['utm_source']);
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
    CommonFunction.prototype.convertDateMMDDYYYY = function (date, sourceFormat) {
        return moment(date, sourceFormat).format('MM/DD/YYYY');
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
    CommonFunction.prototype.getGuestUser = function () {
        var userDetails = jwt_helper_1.getLoginUserInfo();
        if (!userDetails.roleId || userDetails.roleId == 7) {
            var guestuserId = localStorage.getItem('__gst');
            if (guestuserId) {
                return guestuserId;
            }
            else {
                return '';
            }
        }
        else {
            return '';
        }
    };
    CommonFunction.prototype.convertCustomDateFormat = function (date, sourceFormat, destFormat, languageCode) {
        if (languageCode === void 0) { languageCode = null; }
        if (languageCode == null) {
            return moment(date, sourceFormat).format(destFormat);
        }
        return date;
    };
    CommonFunction.prototype.preventNumberInput = function (event) {
        var a = [];
        var k = event.which;
        for (var i = 48; i < 58; i++)
            a.push(i);
        if ((a.indexOf(k) >= 0))
            event.preventDefault();
    };
    CommonFunction.prototype.preventSpecialCharacter = function (event) {
        var a = [];
        var k = event.charCode;
        if ((k >= 33 && k <= 91) || k == 32 || k == 64 || (k >= 123 && k <= 126) || (k >= 92 && k <= 96))
            event.preventDefault();
    };
    CommonFunction.prototype.convertTime = function (time, sourceFormat, targetFormat) {
        return moment(time, sourceFormat).format(targetFormat);
    };
    CommonFunction.prototype.isRefferal = function () {
        if (this.route.snapshot.queryParams && this.route.snapshot.queryParams['utm_source']) {
            return true;
        }
        else {
            return false;
        }
    };
    CommonFunction.prototype.getRefferalParms = function () {
        var parms = {};
        if (this.route.snapshot.queryParams && this.route.snapshot.queryParams['utm_source']) {
            parms.utm_source = this.route.snapshot.queryParams['utm_source'];
        }
        if (this.route.snapshot.queryParams && this.route.snapshot.queryParams['utm_medium']) {
            parms.utm_medium = this.route.snapshot.queryParams['utm_medium'];
        }
        if (this.route.snapshot.queryParams && this.route.snapshot.queryParams['utm_campaign']) {
            parms.utm_campaign = this.route.snapshot.queryParams['utm_campaign'];
        }
        return parms;
    };
    CommonFunction = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CommonFunction);
    return CommonFunction;
}());
exports.CommonFunction = CommonFunction;
