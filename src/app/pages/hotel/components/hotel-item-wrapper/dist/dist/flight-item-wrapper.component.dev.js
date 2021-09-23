"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--) {
            if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

exports.__esModule = true;
exports.FlightItemWrapperComponent = void 0;

var core_1 = require("@angular/core");

var environment_1 = require("../../../../../environments/environment");

var animations_1 = require("@angular/animations");

var moment = require("moment");

var jwt_helper_1 = require("../../../../../app/_helpers/jwt.helper");

var FlightItemWrapperComponent =
    /** @class */
    function() {
        function FlightItemWrapperComponent(flightService, router, route, cookieService, commonFunction, genericService) {
            this.flightService = flightService;
            this.router = router;
            this.route = route;
            this.cookieService = cookieService;
            this.commonFunction = commonFunction;
            this.genericService = genericService;
            this.animationState = 'out';
            this.s3BucketUrl = environment_1.environment.s3BucketUrl;
            this.defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
            this.flightListArray = [];
            this.subscriptions = [];
            this.flightDetailIdArray = [];
            this.hideDiv = true;
            this.showFlightDetails = [];
            this.showDiv = false;
            this.routeCode = [];
            this.cancellationPolicyArray = [];
            this.loadMoreCancellationPolicy = false;
            this.loadBaggageDetails = true;
            this.loadCancellationPolicy = false;
            this.isInstalmentAvailable = false;
            this.totalLaycreditPoints = 0;
            this.isRoundTrip = false;
            this.subcell = '$100';
        }

        FlightItemWrapperComponent.prototype.ngOnInit = function() {
            var _currency = localStorage.getItem('_curr');

            this.currency = JSON.parse(_currency);
            // console.log('sds', this.showFlightDetails);
            this.flightList = this.flightDetails;
            this.userInfo = jwt_helper_1.getLoginUserInfo();

            if (this.route.snapshot.queryParams['trip'] === 'roundtrip') {
                this.isRoundTrip = true;
            } else if (this.route.snapshot.queryParams['trip'] === 'oneway') {
                this.isRoundTrip = false;
            }

            this.totalLaycredit();
            this.checkInstalmentAvalability();
        };

        FlightItemWrapperComponent.prototype.opened = function() {};

        FlightItemWrapperComponent.prototype.getBaggageDetails = function(routeCode) {
            var _this = this;

            this.loadBaggageDetails = true;
            this.flightService.getBaggageDetails(routeCode).subscribe(function(data) {
                _this.baggageDetails = data;
                _this.loadBaggageDetails = false;
            });
        };

        FlightItemWrapperComponent.prototype.getCancellationPolicy = function(routeCode) {
            var _this = this;

            this.loadCancellationPolicy = true;
            this.loadMoreCancellationPolicy = false;
            this.errorMessage = '';
            this.flightService.getCancellationPolicy(routeCode).subscribe(function(data) {
                _this.cancellationPolicyArray = data.cancellation_policy.split('--');
                _this.loadCancellationPolicy = false;
                _this.cancellationPolicy = data;
            }, function(err) {
                _this.loadCancellationPolicy = false;
                _this.errorMessage = err.message;
            });
        };

        FlightItemWrapperComponent.prototype.toggleCancellationContent = function() {
            this.loadMoreCancellationPolicy = !this.loadMoreCancellationPolicy;
            // console.log("this.loadMoreCancellationPolicy", this.loadMoreCancellationPolicy);
        };

        FlightItemWrapperComponent.prototype.ngAfterContentChecked = function() {
            var _this = this;

            this.flightListArray = this.flightList;
            this.flightListArray.forEach(function(item) {
                _this.flightDetailIdArray.push(item.route_code);
            });
        };

        FlightItemWrapperComponent.prototype.showDetails = function(index) {
            var _this = this;

            if (typeof this.showFlightDetails[index] === 'undefined') {
                this.showFlightDetails[index] = true;
            } else {
                this.showFlightDetails[index] = !this.showFlightDetails[index];
            }

            this.showFlightDetails = this.showFlightDetails.map(function(item, i) {
                return index === i && _this.showFlightDetails[index] === true ? true : false;
            });
        };

        FlightItemWrapperComponent.prototype.closeFlightDetail = function() {
            this.showFlightDetails = this.showFlightDetails.map(function(item) {
                return false;
            });
        };

        FlightItemWrapperComponent.prototype.bookNow = function(route) {
            var itinerary = {
                adult: this.route.snapshot.queryParams["adult"],
                child: this.route.snapshot.queryParams["child"],
                infant: this.route.snapshot.queryParams["infant"],
                is_passport_required: route.is_passport_required
            };
            var lastSearchUrl = this.router.url;
            this.cookieService.put('_prev_search', lastSearchUrl);
            var dateNow = new Date();
            dateNow.setMinutes(dateNow.getMinutes() + 10);
            sessionStorage.setItem('_itinerary', JSON.stringify(itinerary));
            sessionStorage.setItem('__route', JSON.stringify(route));
            // console.log("this.isInstalmentAvailable", this.isInstalmentAvailable);

            if (this.isInstalmentAvailable) {
                this.router.navigate(["flight/payment/" + route.route_code]);
            } else {
                this.router.navigate(["flight/travelers/" + route.route_code]);
            }
        };

        FlightItemWrapperComponent.prototype.checkInstalmentAvalability = function() {
            var _this = this;

            var instalmentRequest = {
                checkin_date: this.route.snapshot.queryParams['departure_date'],
                booking_date: moment().format("YYYY-MM-DD")
            };
            this.genericService.getInstalemntsAvailability(instalmentRequest).subscribe(function(res) {
                if (res.instalment_availability) {
                    _this.isInstalmentAvailable = res.instalment_availability;
                }
            });
        };

        FlightItemWrapperComponent.prototype.totalLaycredit = function() {
            var _this = this;

            this.genericService.getAvailableLaycredit().subscribe(function(res) {
                _this.totalLaycreditPoints = res.total_available_points;
            }, function(error) {});
        };

        FlightItemWrapperComponent.prototype.ngOnChanges = function(changes) {
            this.flightList = changes.flightDetails.currentValue;
        };

        FlightItemWrapperComponent.prototype.logAnimation = function(event) {
            console.log(event);
        };

        FlightItemWrapperComponent.prototype.ngOnDestroy = function() {
            this.subscriptions.forEach(function(sub) {
                return sub.unsubscribe();
            });
        };

        __decorate([core_1.Input()], FlightItemWrapperComponent.prototype, "flightDetails");

        __decorate([core_1.Input()], FlightItemWrapperComponent.prototype, "filter");

        FlightItemWrapperComponent = __decorate([core_1.Component({
            selector: 'app-flight-item-wrapper',
            templateUrl: './flight-item-wrapper.component.html',
            styleUrls: ['./flight-item-wrapper.component.scss'],
            animations: [animations_1.trigger('listAnimation', [animations_1.transition('* => *', [animations_1.query(':leave', [animations_1.stagger(10, [animations_1.animate('0.001s', animations_1.style({
                opacity: 0
            }))])], {
                optional: true
            }), animations_1.query(':enter', [animations_1.style({
                opacity: 0
            }), animations_1.stagger(50, [animations_1.animate('0.5s', animations_1.style({
                opacity: 1
            }))])], {
                optional: true
            })])])]
        })], FlightItemWrapperComponent);
        return FlightItemWrapperComponent;
    }();

exports.FlightItemWrapperComponent = FlightItemWrapperComponent;