"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightItemWrapperComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var animations_1 = require("@angular/animations");
var FlightItemWrapperComponent = /** @class */ (function () {
    function FlightItemWrapperComponent(layTripStoreService, flightService, router, route, cookieService, commonFunction) {
        this.layTripStoreService = layTripStoreService;
        this.flightService = flightService;
        this.router = router;
        this.route = route;
        this.cookieService = cookieService;
        this.commonFunction = commonFunction;
        this.animationState = 'out';
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.defaultImage = this.s3BucketUrl + 'assets/images/profile_im.svg';
        this.flightListArray = [];
        this.subscriptions = [];
        this.flightDetailIdArray = [];
        this.hideDiv = true;
        this.showFlightDetails = [];
        this.showDiv = false;
        this.routeCode = [];
        this.loadBaggageDetails = true;
        this.isRoundTrip = false;
        this.subcell = '$100';
    }
    FlightItemWrapperComponent.prototype.ngOnInit = function () {
        var _currency = localStorage.getItem('_curr');
        this.currency = JSON.parse(_currency);
        this.loadJquery();
        // console.log(this.flightDetails);
        this.flightList = this.flightDetails;
        if (this.route.snapshot.queryParams['trip'] === 'roundtrip') {
            this.isRoundTrip = true;
        }
        else if (this.route.snapshot.queryParams['trip'] === 'oneway') {
            this.isRoundTrip = false;
        }
        // this.subscriptions.push(this.layTripStoreService.selectFlightSearchResult().subscribe(res => {
        //   if (res) {
        //     if (res.items) {
        //       // FOR FLIGHT LIST & DETAILS
        //       this.flightList = res.items;
        //     }
        //   }
        // }));
        // setTimeout(() => {
        //   const cells = Array.from(document.querySelectorAll<HTMLDivElement>('.mat-calendar .mat-calendar-body-cell-content'));
        //   cells.forEach(c => {
        //     c.innerHTML = c.innerHTML + ' ' + this.subcell;
        //   });
        // });
    };
    FlightItemWrapperComponent.prototype.opened = function () {
        // setTimeout(() => {
        //   const cells = Array.from(document.querySelectorAll<HTMLDivElement>('.mat-calendar .mat-calendar-body-cell-content'));
        //   cells.forEach(c => {
        //     c.innerHTML = c.innerHTML + ' ' + this.subcell;
        //   });
        // });
    };
    FlightItemWrapperComponent.prototype.getBaggageDetails = function (routeCode) {
        var _this = this;
        this.loadBaggageDetails = true;
        this.flightService.getBaggageDetails(routeCode).subscribe(function (data) {
            console.log('baggage:::', data);
            _this.baggageDetails = data;
            _this.loadBaggageDetails = false;
        });
    };
    FlightItemWrapperComponent.prototype.getCancellationPolicy = function (routeCode) {
        var _this = this;
        this.cancellationPolicy = '';
        this.flightService.getCancellationPolicy(routeCode).subscribe(function (data) {
            console.log('cancellation-policy:::', data);
            _this.errorMessage = '';
            _this.cancellationPolicy = data;
        }, function (err) {
            console.log(err);
            _this.errorMessage = err.message;
        });
    };
    FlightItemWrapperComponent.prototype.loadJquery = function () {
    };
    FlightItemWrapperComponent.prototype.ngAfterContentChecked = function () {
        var _this = this;
        this.flightListArray = this.flightList;
        this.flightListArray.forEach(function (item) {
            _this.flightDetailIdArray.push(item.route_code);
        });
    };
    FlightItemWrapperComponent.prototype.showDetails = function (index) {
        var _this = this;
        if (typeof this.showFlightDetails[index] === 'undefined') {
            this.showFlightDetails[index] = true;
        }
        else {
            this.showFlightDetails[index] = !this.showFlightDetails[index];
        }
        this.showFlightDetails = this.showFlightDetails.map(function (item, i) {
            return ((index === i) && _this.showFlightDetails[index] === true) ? true : false;
        });
    };
    FlightItemWrapperComponent.prototype.closeFlightDetail = function () {
        this.showFlightDetails = this.showFlightDetails.map(function (item) {
            return false;
        });
    };
    FlightItemWrapperComponent.prototype.bookNow = function (routeCode, is_passport) {
        var itinerary = {
            adult: this.route.snapshot.queryParams["adult"],
            child: this.route.snapshot.queryParams["child"],
            infant: this.route.snapshot.queryParams["infant"],
            is_passport_required: is_passport
        };
        this.cookieService.put('_itinerary', JSON.stringify(itinerary));
        this.router.navigate(["flight/traveler/" + routeCode]);
    };
    FlightItemWrapperComponent.prototype.ngOnChanges = function (changes) {
        this.flightList = changes.flightDetails.currentValue;
    };
    FlightItemWrapperComponent.prototype.logAnimation = function (event) {
        console.log(event);
    };
    FlightItemWrapperComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
    };
    __decorate([
        core_1.Input()
    ], FlightItemWrapperComponent.prototype, "flightDetails");
    __decorate([
        core_1.Input()
    ], FlightItemWrapperComponent.prototype, "filter");
    FlightItemWrapperComponent = __decorate([
        core_1.Component({
            selector: 'app-flight-item-wrapper',
            templateUrl: './flight-item-wrapper.component.html',
            styleUrls: ['./flight-item-wrapper.component.scss'],
            animations: [
                animations_1.trigger('listAnimation', [
                    animations_1.transition('* => *', [
                        animations_1.query(':leave', [
                            animations_1.stagger(50, [
                                animations_1.animate('0.5s', animations_1.style({ opacity: 0 }))
                            ])
                        ], { optional: true }),
                        animations_1.query(':enter', [
                            animations_1.style({ opacity: 0 }),
                            animations_1.stagger(200, [
                                animations_1.animate('0.5s', animations_1.style({ opacity: 1 }))
                            ])
                        ], { optional: true })
                    ])
                ])
            ]
        })
    ], FlightItemWrapperComponent);
    return FlightItemWrapperComponent;
}());
exports.FlightItemWrapperComponent = FlightItemWrapperComponent;
