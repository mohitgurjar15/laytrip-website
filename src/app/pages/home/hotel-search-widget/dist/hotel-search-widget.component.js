"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HotelSearchWidgetComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var moment = require("moment");
var forms_1 = require("@angular/forms");
var HotelSearchWidgetComponent = /** @class */ (function () {
    function HotelSearchWidgetComponent(commonFunction, fb, router, route, homeService, cd) {
        this.commonFunction = commonFunction;
        this.fb = fb;
        this.router = router;
        this.route = route;
        this.homeService = homeService;
        this.cd = cd;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.currentChangeCounter = new core_1.EventEmitter();
        this.checkInDate = new Date();
        this.checkOutDate = new Date();
        this.maxDate = {};
        this.minDate = {};
        this.validSearch = true;
        this.fromDestinationInfo = {
            title: "Cancún, Mexico",
            city: "Cancún",
            state: "",
            city_id: 800026864,
            country: "Mexico",
            type: "city",
            hotel_id: null,
            geo_codes: {
                lat: 21.1613,
                long: -86.8341
            }
        };
        this.showHotelDropDown = false;
        this.hotelSearchFormSubmitted = false;
        this.searchHotelInfo = {
            latitude: null,
            longitude: null,
            check_in: null,
            check_out: null,
            city_id: '',
            occupancies: [
                {
                    adults: null,
                    children: []
                }
            ]
        };
        this.selectedGuest = {
            rooms: 1,
            adults: 1,
            child: 0,
            children: []
        };
        this.showCommingSoon = false;
        this.customStartDateValidation = "2021-06-02";
        this.customEndDateValidation = "2021-06-03";
        this.counterChangeVal = 0;
        this.hotelSearchForm = this.fb.group({
            fromDestination: ['', [forms_1.Validators.required]]
        });
        this.setHotelDate();
        this.checkOutMinDate = this.checkInDate;
        this.checkOutDate = moment(this.checkInDate).add(1, 'days').toDate();
        this.rangeDates = [this.checkInDate, this.checkOutDate];
        this.searchHotelInfo =
            {
                latitude: null,
                longitude: null,
                check_in: this.checkInDate,
                check_out: this.checkOutDate,
                location: {},
                occupancies: {
                    adults: null,
                    children: []
                }
            };
        var host = window.location.origin;
        if (host.includes("staging")) {
            this.showCommingSoon = true;
        }
    }
    HotelSearchWidgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scrollTo(0, 0);
        if (this.commonFunction.isRefferal()) {
            setTimeout(function () {
                _this.homeService.getSlideOffers.subscribe(function (currentSlide) {
                    if (typeof currentSlide != 'undefined' && Object.keys(currentSlide).length > 0) {
                        var keys = currentSlide;
                        _this.dealDateValidation();
                        _this.fromDestinationInfo.city = _this.fromDestinationInfo.title = '';
                        _this.fromDestinationInfo.city = _this.fromDestinationInfo.title = keys.location.to.hotel_option.title;
                        _this.searchHotelInfo.latitude = _this.fromDestinationInfo.geo_codes.lat = keys.location.to.hotel_option.geo_codes.lat;
                        _this.searchHotelInfo.longitude = _this.fromDestinationInfo.geo_codes.long = keys.location.to.hotel_option.geo_codes.long;
                        _this.searchHotelInfo.city_id = _this.fromDestinationInfo.city_id = keys.location.to.hotel_option.city_id;
                        _this.searchHotelInfo.location = _this.fromDestinationInfo;
                        _this.validateSearch(true);
                    }
                });
            }, 3000);
        }
        // this.checkInDate = moment(this.customStartDateValidation).toDate();
        if (new Date(this.customStartDateValidation) <= new Date()) {
            this.checkInDate = moment().add('31', 'days').toDate();
        }
        this.countryCode = this.commonFunction.getUserCountry();
        if (this.route && this.route.snapshot.queryParams['check_in']) {
            // this.$dealLocatoin.unsubscribe();  
            this.homeService.removeToString('hotel');
            this.checkInDate = moment(this.route.snapshot.queryParams['check_in']).toDate();
            this.checkInMinDate = moment().add(31, 'days').toDate();
            this.checkOutDate = moment(this.route.snapshot.queryParams['check_out']).isValid() ? moment(this.route.snapshot.queryParams['check_out']).toDate() : moment(this.route.snapshot.queryParams['check_in']).add(1, 'days').toDate();
            this.checkOutMinDate = this.checkOutDate;
            this.rangeDates = [this.checkInDate, this.checkOutDate];
            var info = void 0;
            this.searchHotelInfo =
                {
                    latitude: this.route.snapshot.queryParams['latitude'],
                    longitude: this.route.snapshot.queryParams['longitude'],
                    check_in: moment(this.route.snapshot.queryParams['check_in']).format('MM/DD/YYYY'),
                    check_out: moment(this.checkOutDate).format('MM/DD/YYYY'),
                    city_id: this.route.snapshot.queryParams['city_id'],
                    hotel_id: this.route.snapshot.queryParams['hotel_id']
                };
            if (this.route.snapshot.queryParams['location']) {
                info = JSON.parse(decodeURIComponent(atob(this.route.snapshot.queryParams['location'])));
                this.searchHotelInfo.location = info;
                if (info) {
                    this.fromDestinationInfo.title = info.title;
                    this.fromDestinationInfo.city = info.city;
                    this.fromDestinationInfo.country = info.country;
                    this.searchHotelInfo.city = info.city;
                    this.searchHotelInfo.country = info.country;
                }
            }
            if (this.route.snapshot.queryParams['itenery']) {
                info = JSON.parse(decodeURIComponent(atob(this.route.snapshot.queryParams['itenery'])));
                this.searchHotelInfo.occupancies = info;
            }
        }
        else {
            this.searchHotelInfo.latitude = this.fromDestinationInfo.geo_codes.lat;
            this.searchHotelInfo.city_id = this.fromDestinationInfo.city_id;
            this.searchHotelInfo.hotel_id = this.fromDestinationInfo.hotel_id;
            // this.searchHotelInfo.type = this.fromDestinationInfo.type;
            this.searchHotelInfo.longitude = this.fromDestinationInfo.geo_codes.long;
            this.searchHotelInfo.location = this.fromDestinationInfo;
            this.searchHotelInfo.occupancies = this.selectedGuest;
        }
        this.$dealLocatoin = this.homeService.getLocationForHotelDeal.subscribe(function (hotelInfo) {
            if (typeof hotelInfo != 'undefined' && Object.keys(hotelInfo).length > 0) {
                _this.dealDateValidation();
                _this.fromDestinationInfo.city = _this.fromDestinationInfo.title = '';
                _this.fromDestinationInfo.city = _this.fromDestinationInfo.title = hotelInfo.title;
                _this.searchHotelInfo.latitude = _this.fromDestinationInfo.geo_codes.lat = hotelInfo.lat;
                _this.searchHotelInfo.longitude = _this.fromDestinationInfo.geo_codes.long = hotelInfo.long;
                _this.searchHotelInfo.city_id = _this.fromDestinationInfo.city_id = hotelInfo.city_id;
                _this.searchHotelInfo.location = _this.fromDestinationInfo;
                _this.validateSearch(true);
            }
        });
        this.homeService.removeToString('hotel');
    };
    HotelSearchWidgetComponent.prototype.ngOnChanges = function (changes) {
        //home page image slider
        /*  if(typeof changes['currentSlide'].currentValue!=='undefined'){
           this.dealDateValidation();
           this.fromDestinationInfo.city = this.fromDestinationInfo.title = '';
           this.fromDestinationInfo.city = this.fromDestinationInfo.title = changes['currentSlide'].currentValue.location.to.hotel_option.title;
           this.searchHotelInfo.latitude = this.fromDestinationInfo.geo_codes.lat = changes['currentSlide'].currentValue.location.to.hotel_option.geo_codes.lat;
           this.searchHotelInfo.longitude = this.fromDestinationInfo.geo_codes.long = changes['currentSlide'].currentValue.location.to.hotel_option.geo_codes.long;
           this.searchHotelInfo.city_id = this.fromDestinationInfo.city_id = changes['currentSlide'].currentValue.location.to.hotel_option.city_id;
           this.searchHotelInfo.location = this.fromDestinationInfo;
           this.validateSearch(true);
         } */
    };
    HotelSearchWidgetComponent.prototype.dealDateValidation = function () {
        if (moment(moment(this.customStartDateValidation).subtract(31, 'days')).diff(moment(), 'days') > 0) {
            this.searchHotelInfo.check_in = this.checkInDate = moment(this.customStartDateValidation).toDate();
        }
        else {
            this.searchHotelInfo.check_in = this.checkInDate = moment().add(90, 'days').toDate();
        }
        this.searchHotelInfo.check_out = this.checkOutMinDate = this.checkOutDate = moment(this.searchHotelInfo.check_in).add(1, 'days').toDate();
        this.rangeDates = [this.checkInDate, this.checkOutDate];
    };
    HotelSearchWidgetComponent.prototype.setHotelDate = function () {
        var curretdate = moment().format();
        var customStartDate = moment(this.customStartDateValidation).format('YYYY-MM-DD');
        var daysDiff = moment(this.customStartDateValidation, "YYYY-MM-DD").diff(moment(curretdate, "YYYY-MM-DD"), 'days');
        if (curretdate < customStartDate && daysDiff > 30) {
            this.checkInDate = moment(customStartDate).toDate();
            this.checkInMinDate = this.checkInDate;
        }
        else if (daysDiff < 30) {
            this.checkInDate = moment(curretdate).add(31, 'days').toDate();
            this.checkInMinDate = this.checkInDate;
            // this.departureDate = date; 
        }
        else {
            this.checkInDate = moment(curretdate).add(31, 'days').toDate();
            this.checkInMinDate = this.checkInDate;
            // this.flightDepartureMinDate =  date;
        }
    };
    HotelSearchWidgetComponent.prototype.selectCheckInDateUpdate = function (date) {
        // this is only for closing date range picker, after selecting both dates
        if (this.rangeDates[1]) { // If second date is selected
            this.dateFilter.hideOverlay();
        }
        ;
        var daysDiff = this.rangeDates[0] ? moment(this.rangeDates[1], "YYYY-MM-DD").diff(moment(this.rangeDates[0], "YYYY-MM-DD"), 'days') : 0;
        if (daysDiff == 0) {
            // this.checkInMinDate = moment(this.rangeDates[0],'YYYY-MM-DD').add(1,'days').toDate();
            this.checkOutDate = moment(this.rangeDates[0]).add(1, 'days').toDate();
            this.rangeDates[1] = this.searchHotelInfo.check_out = this.checkOutDate;
        }
    };
    HotelSearchWidgetComponent.prototype.changeGuestInfo = function (event) {
        this.searchHotelInfo.occupancies = event;
    };
    HotelSearchWidgetComponent.prototype.fromBinary = function (encoded) {
        var binary = atob(encoded);
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < bytes.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return String.fromCharCode.apply(String, new Uint16Array(bytes.buffer));
    };
    HotelSearchWidgetComponent.prototype.toBinary = function (string) {
        var codeUnits = new Uint16Array(string.length);
        for (var i = 0; i < codeUnits.length; i++) {
            codeUnits[i] = string.charCodeAt(i);
        }
        return btoa(String.fromCharCode.apply(String, new Uint8Array(codeUnits.buffer)));
    };
    HotelSearchWidgetComponent.prototype.searchHotels = function () {
        var _this = this;
        console.log($('.hotel_desination').val());
        this.hotelSearchFormSubmitted = true;
        if ($('.hotel_desination').val() == '') {
            this.validSearch = false;
        }
        var queryParams = {};
        queryParams.check_in = moment(this.rangeDates[0]).format('YYYY-MM-DD');
        queryParams.check_out = moment(this.rangeDates[1]).isValid() ? moment(this.rangeDates[1]).format('YYYY-MM-DD') : moment(this.rangeDates[0]).add(1, 'days').format('YYYY-MM-DD');
        queryParams.check_out = moment(this.rangeDates[1]).format('YYYY-MM-DD');
        queryParams.latitude = parseFloat(this.searchHotelInfo.latitude);
        queryParams.longitude = parseFloat(this.searchHotelInfo.longitude);
        queryParams.city_id = parseFloat(this.searchHotelInfo.city_id);
        queryParams.hotel_id = this.searchHotelInfo.type == "hotel" ? parseFloat(this.searchHotelInfo.hotel_id) : '';
        // queryParams.type = this.searchHotelInfo.type ? this.searchHotelInfo.type : '';
        console.log(this.searchHotelInfo);
        queryParams.itenery = btoa(encodeURIComponent(JSON.stringify(this.searchHotelInfo.occupancies)));
        queryParams.location = btoa(encodeURIComponent(JSON.stringify(this.searchHotelInfo.location))).replace(/\=+$/, '');
        if (this.commonFunction.isRefferal()) {
            var parms = this.commonFunction.getRefferalParms();
            queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
            if (parms.utm_medium) {
                queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
            }
            if (parms.utm_campaign) {
                queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
            }
        }
        if (this.validSearch && this.searchHotelInfo && this.searchHotelInfo.latitude && this.searchHotelInfo.longitude &&
            this.searchHotelInfo.check_in && this.searchHotelInfo.check_out && this.searchHotelInfo.occupancies) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
                _this.router.navigate(['hotel/search'], { queryParams: queryParams, queryParamsHandling: 'merge' });
            });
        }
        else {
            this.validSearch = false;
        }
    };
    HotelSearchWidgetComponent.prototype.selectedHotel = function (event) {
        if (event.type == 'city') {
            this.searchHotelInfo.city_id = event.city_id;
        }
        else {
            this.searchHotelInfo.hotel_id = event.hotel_id;
        }
        this.searchHotelInfo.type = event.type;
        this.searchHotelInfo.location = event;
        this.searchHotelInfo.latitude = event.geo_codes.lat;
        this.searchHotelInfo.longitude = event.geo_codes.long;
        if (event && event.city_id == '' && event.objType === 'invalid') {
            this.fromDestinationInfo = event;
            this.validateSearch(true);
        }
        // console.log(this.searchHotelInfo,event)
    };
    HotelSearchWidgetComponent.prototype.validateSearch = function (event) {
        this.currentChangeCounter.emit(this.counterChangeVal += 1);
        this.validSearch = event;
    };
    __decorate([
        core_1.ViewChild('dateFilter', /* TODO: add static flag */ undefined)
    ], HotelSearchWidgetComponent.prototype, "dateFilter");
    __decorate([
        core_1.Input()
    ], HotelSearchWidgetComponent.prototype, "currentSlide");
    __decorate([
        core_1.Output()
    ], HotelSearchWidgetComponent.prototype, "currentChangeCounter");
    HotelSearchWidgetComponent = __decorate([
        core_1.Component({
            selector: 'app-hotel-search-widget',
            templateUrl: './hotel-search-widget.component.html',
            styleUrls: ['./hotel-search-widget.component.scss']
        })
    ], HotelSearchWidgetComponent);
    return HotelSearchWidgetComponent;
}());
exports.HotelSearchWidgetComponent = HotelSearchWidgetComponent;
