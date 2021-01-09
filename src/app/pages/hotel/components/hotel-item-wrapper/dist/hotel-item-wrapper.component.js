"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HotelItemWrapperComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var animations_1 = require("@angular/animations");
var jwt_helper_1 = require("../../../../_helpers/jwt.helper");
var HotelItemWrapperComponent = /** @class */ (function () {
    function HotelItemWrapperComponent(router, route, cookieService, commonFunction, genericService) {
        this.router = router;
        this.route = route;
        this.cookieService = cookieService;
        this.commonFunction = commonFunction;
        this.genericService = genericService;
        this.animationState = 'out';
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
        this.hotelListArray = [];
        this.noOfDataToShowInitially = 20;
        this.dataToLoad = 20;
        this.isFullListDisplayed = false;
        this.isMapView = false;
        this.subscriptions = [];
        this.showHotelDetails = [];
        this.totalLaycreditPoints = 0;
        this.showFareDetails = 0;
        this.amenitiesObject = {
            breakfast: this.s3BucketUrl + "assets/images/hotels/breakfast.svg",
            wifi: this.s3BucketUrl + "assets/images/hotels/wifi.svg",
            no_smoking: this.s3BucketUrl + "assets/images/hotels/no_smoking.svg",
            tv: this.s3BucketUrl + "assets/images/hotels/tv.svg",
            ac: this.s3BucketUrl + "assets/images/hotels/ac.svg"
        };
        this.showMapDetails = [];
        this.scrollDistance = 2;
        this.throttle = 50;
        this.scrollLoading = false;
    }
    HotelItemWrapperComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scroll(0, 0);
        var _currency = localStorage.getItem('_curr');
        this.currency = JSON.parse(_currency);
        var info = JSON.parse(localStorage.getItem('_hote'));
        if (info) {
            info.forEach(function (element) {
                if (element.key === 'guest') {
                    _this.hotelInfo = element.value;
                }
            });
        }
        var hotelinfo = JSON.parse(atob(this.route.snapshot.queryParams['location']));
        if (hotelinfo) {
            this.hotelName = hotelinfo.city;
        }
        // this.hotelListArray = this.hotelDetails;
        this.hotelListArray = this.hotelDetails.slice(0, this.noOfDataToShowInitially);
        if (this.hotelListArray[0] && this.hotelListArray[0].address && this.hotelListArray[0].address.city_name) {
            // this.hotelName = `${this.hotelListArray[0].address.city_name},${this.hotelListArray[0].address.country_name}`;
        }
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        // this.totalLaycredit();
        this.defaultLat = parseFloat(this.route.snapshot.queryParams['latitude']);
        this.defaultLng = parseFloat(this.route.snapshot.queryParams['longitude']);
    };
    HotelItemWrapperComponent.prototype.onScrollDown = function () {
        var _this = this;
        this.scrollLoading = true;
        setTimeout(function () {
            if (_this.noOfDataToShowInitially <= _this.hotelListArray.length) {
                _this.noOfDataToShowInitially += _this.dataToLoad;
                _this.hotelListArray = _this.hotelDetails.slice(0, _this.noOfDataToShowInitially);
                _this.scrollLoading = false;
            }
            else {
                _this.isFullListDisplayed = true;
                _this.scrollLoading = false;
            }
        }, 1000);
    };
    HotelItemWrapperComponent.prototype.ngAfterContentChecked = function () {
        // this.hotelListArray = this.hotelDetails;
        this.hotelListArray = this.hotelDetails.slice(0, this.noOfDataToShowInitially);
        var hotelinfo = JSON.parse(atob(this.route.snapshot.queryParams['location']));
        if (hotelinfo) {
            this.hotelName = hotelinfo.city;
        }
        // if (this.hotelListArray[0] && this.hotelListArray[0].address && this.hotelListArray[0].address.city_name) {
        //   this.hotelName = `${this.hotelListArray[0].address.city_name},${this.hotelListArray[0].address.country_name}`;
        // }
    };
    HotelItemWrapperComponent.prototype.infoWindowAction = function (template, event, action) {
        if (action === 'open') {
            template.open();
        }
        else if (action === 'close') {
            template.close();
        }
        else if (action === 'click') {
            this.showMapInfo(template);
        }
    };
    HotelItemWrapperComponent.prototype.showMapInfo = function (index) {
        if (typeof this.showMapDetails[index] === 'undefined') {
            this.showMapDetails[index] = true;
            document.getElementById(index).scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else {
            this.showMapDetails[index] = !this.showMapDetails[index];
            document.getElementById(index).scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };
    HotelItemWrapperComponent.prototype.counter = function (i) {
        return new Array(i);
    };
    HotelItemWrapperComponent.prototype.differentView = function (view) {
        this.isMapView = (view !== 'listView');
    };
    HotelItemWrapperComponent.prototype.showDetails = function (index, flag) {
        var _this = this;
        if (flag === void 0) { flag = null; }
        if (typeof this.showHotelDetails[index] === 'undefined') {
            this.showHotelDetails[index] = true;
        }
        else {
            this.showHotelDetails[index] = !this.showHotelDetails[index];
        }
        if (flag == 'true') {
            this.showFareDetails = 1;
        }
        else {
            this.showFareDetails = 0;
        }
        this.showHotelDetails = this.showHotelDetails.map(function (item, i) {
            return ((index === i) && _this.showHotelDetails[index] === true) ? true : false;
        });
    };
    HotelItemWrapperComponent.prototype.closeHotelDetail = function () {
        this.showFareDetails = 0;
        this.showHotelDetails = this.showHotelDetails.map(function (item) {
            return false;
        });
    };
    HotelItemWrapperComponent.prototype.totalLaycredit = function () {
        var _this = this;
        this.genericService.getAvailableLaycredit().subscribe(function (res) {
            _this.totalLaycreditPoints = res.total_available_points;
        }, (function (error) {
        }));
    };
    HotelItemWrapperComponent.prototype.ngOnChanges = function (changes) {
        this.hotelsList = changes.hotelDetails.currentValue;
    };
    HotelItemWrapperComponent.prototype.logAnimation = function (event) {
        // console.log(event);
    };
    HotelItemWrapperComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
    };
    __decorate([
        core_1.Input()
    ], HotelItemWrapperComponent.prototype, "hotelDetails");
    __decorate([
        core_1.Input()
    ], HotelItemWrapperComponent.prototype, "filter");
    __decorate([
        core_1.Input()
    ], HotelItemWrapperComponent.prototype, "hotelToken");
    HotelItemWrapperComponent = __decorate([
        core_1.Component({
            selector: 'app-hotel-item-wrapper',
            templateUrl: './hotel-item-wrapper.component.html',
            styleUrls: ['./hotel-item-wrapper.component.scss'],
            animations: [
                animations_1.trigger('listAnimation', [
                    animations_1.transition('* => *', [
                        animations_1.query(':leave', [
                            animations_1.stagger(10, [
                                animations_1.animate('0.001s', animations_1.style({ opacity: 0 }))
                            ])
                        ], { optional: true }),
                        animations_1.query(':enter', [
                            animations_1.style({ opacity: 0 }),
                            animations_1.stagger(50, [
                                animations_1.animate('0.5s', animations_1.style({ opacity: 1 }))
                            ])
                        ], { optional: true })
                    ])
                ])
            ]
        })
    ], HotelItemWrapperComponent);
    return HotelItemWrapperComponent;
}());
exports.HotelItemWrapperComponent = HotelItemWrapperComponent;
