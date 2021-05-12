"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.LaytripOkPopup = exports.FlightItemWrapperComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var moment = require("moment");
var jwt_helper_1 = require("../../../../../app/_helpers/jwt.helper");
var FlightItemWrapperComponent = /** @class */ (function () {
    function FlightItemWrapperComponent(flightService, router, route, cookieService, commonFunction, genericService, cartService, toastr, spinner, modalService) {
        this.flightService = flightService;
        this.router = router;
        this.route = route;
        this.cookieService = cookieService;
        this.commonFunction = commonFunction;
        this.genericService = genericService;
        this.cartService = cartService;
        this.toastr = toastr;
        this.spinner = spinner;
        this.modalService = modalService;
        this.changeLoading = new core_1.EventEmitter;
        this.maxCartValidation = new core_1.EventEmitter;
        this.removeFlight = new core_1.EventEmitter;
        this.isFlightNotAvailable = false;
        this.cartItems = [];
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
        this.showFareDetails = 0;
        this.isRoundTrip = false;
        this.subcell = '$100';
        this.isLoggedIn = false;
        this.showTotalLayCredit = 0;
        this._isLayCredit = false;
        this.totalLayCredit = 0;
    }
    FlightItemWrapperComponent.prototype.ngOnInit = function () {
        var _this = this;
        var _currency = localStorage.getItem('_curr');
        this.currency = JSON.parse(_currency);
        this.flightList = this.flightDetails;
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        if (this.route.snapshot.queryParams['trip'] === 'roundtrip') {
            this.isRoundTrip = true;
        }
        else if (this.route.snapshot.queryParams['trip'] === 'oneway') {
            this.isRoundTrip = false;
        }
        //this.totalLaycredit();
        this.checkInstalmentAvalability();
        this.checkUser();
        this.cartService.getCartItems.subscribe(function (cartItems) {
            _this.cartItems = cartItems;
        });
        setTimeout(function () { _this.loadJquery(); }, 3000);
    };
    FlightItemWrapperComponent.prototype.loadJquery = function () {
        $("body").click(function () {
            $(".code_name_m").hide();
        });
        $(".code_bt_m").click(function (e) {
            e.stopPropagation();
            $(this).siblings(".code_name_m").toggle();
        });
        $('.code_name_m').click(function (e) {
            e.stopPropagation();
        });
    };
    FlightItemWrapperComponent.prototype.ngDoCheck = function () {
        // this.checkUser();
    };
    FlightItemWrapperComponent.prototype.checkUser = function () {
        var userToken = jwt_helper_1.getLoginUserInfo();
        this.isLoggedIn = false;
        if (typeof userToken != 'undefined' && userToken.roleId != 7) {
            localStorage.removeItem("_isSubscribeNow");
            this.isLoggedIn = true;
        }
    };
    FlightItemWrapperComponent.prototype.opened = function () {
    };
    FlightItemWrapperComponent.prototype.getBaggageDetails = function (routeCode) {
        var _this = this;
        this.loadBaggageDetails = true;
        this.flightService.getBaggageDetails(routeCode).subscribe(function (data) {
            _this.baggageDetails = data;
            _this.loadBaggageDetails = false;
        });
    };
    FlightItemWrapperComponent.prototype.getCancellationPolicy = function (routeCode) {
        // this.loadCancellationPolicy = true;
        // this.loadMoreCancellationPolicy = false;
        // this.errorMessage = '';
        // this.cancellationPolicyArray = [];
        // this.cancellationPolicy = '';
        // this.flightService.getCancellationPolicy(routeCode).subscribe((data: any) => {
        //   this.cancellationPolicyArray = data.cancellation_policy.split('--')
        //   this.loadCancellationPolicy = false;
        //   this.cancellationPolicy = data;
        // }, (err) => {
        //   this.loadCancellationPolicy = false;
        //   this.errorMessage = err.message;
        // });
    };
    FlightItemWrapperComponent.prototype.toggleCancellationContent = function () {
        this.loadMoreCancellationPolicy = !this.loadMoreCancellationPolicy;
    };
    FlightItemWrapperComponent.prototype.ngAfterContentChecked = function () {
        var _this = this;
        this.flightListArray = this.flightList;
        this.flightListArray.forEach(function (item) {
            _this.flightDetailIdArray.push(item.route_code);
        });
    };
    FlightItemWrapperComponent.prototype.showDetails = function (index, flag) {
        var _this = this;
        if (flag === void 0) { flag = null; }
        if (typeof this.showFlightDetails[index] === 'undefined') {
            this.showFlightDetails[index] = true;
        }
        else {
            this.showFlightDetails[index] = !this.showFlightDetails[index];
        }
        if (flag == 'true') {
            this.showFareDetails = 1;
        }
        else {
            this.showFareDetails = 0;
        }
        this.showFlightDetails = this.showFlightDetails.map(function (item, i) {
            return ((index === i) && _this.showFlightDetails[index] === true) ? true : false;
        });
    };
    FlightItemWrapperComponent.prototype.closeFlightDetail = function () {
        this.showFareDetails = 0;
        this.showFlightDetails = this.showFlightDetails.map(function (item) {
            return false;
        });
    };
    FlightItemWrapperComponent.prototype.bookNow = function (route) {
        var _this = this;
        this.removeFlight.emit(this.flightUniqueCode);
        this.isFlightNotAvailable = false;
        /*  console.log(this.flightListArray)
        this.flightListArray = this.flightListArray.filter(obj => obj.unique_code !== this.flightUniqueCode);
        console.log(this.flightListArray)
     */
        /* if (!this.isLoggedIn) {
          const modalRef = this.modalService.open(LaytripOkPopup, {
            centered: true,
            keyboard: false,
            backdrop: 'static'
          });
        } else { */
        if (this.cartItems && this.cartItems.length >= 10) {
            this.changeLoading.emit(false);
            this.maxCartValidation.emit(true);
        }
        else {
            this.changeLoading.emit(true);
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
            var payload = {
                module_id: 1,
                route_code: route.route_code,
                referral_id: this.route.snapshot.queryParams['utm_source'] ? this.route.snapshot.queryParams['utm_source'] : ''
            };
            //payload.guest_id = !this.isLoggedIn?this.commonFunction.getGuestUser():'';
            this.cartService.addCartItem(payload).subscribe(function (res) {
                _this.changeLoading.emit(true);
                var queryParamsNew = {};
                if (res) {
                    var newItem = { id: res.data.id, module_Info: res.data.moduleInfo[0] };
                    _this.cartItems = __spreadArrays(_this.cartItems, [newItem]);
                    _this.cartService.setCartItems(_this.cartItems);
                    localStorage.setItem('$crt', JSON.stringify(_this.cartItems.length));
                    if (_this.commonFunction.isRefferal()) {
                        var parms = _this.commonFunction.getRefferalParms();
                        _this.router.navigate(['cart/booking'], { queryParams: { utm_source: parms.utm_source, utm_medium: parms.utm_medium } });
                    }
                    else {
                        _this.router.navigate(['cart/booking']);
                    }
                }
            }, function (error) {
                _this.changeLoading.emit(false);
                //this.toastr.warning(error.message, 'Warning', { positionClass: 'toast-top-center', easeTime: 1000 });
                _this.isFlightNotAvailable = true;
                _this.flightUniqueCode = route.unique_code;
                // this.isFlightNotAvailable.emit(true)
            });
        }
        /* } */
    };
    FlightItemWrapperComponent.prototype.checkInstalmentAvalability = function () {
        var _this = this;
        var instalmentRequest = {
            checkin_date: this.route.snapshot.queryParams['departure_date'],
            booking_date: moment().format("YYYY-MM-DD")
        };
        this.genericService.getInstalemntsAvailability(instalmentRequest).subscribe(function (res) {
            if (res.instalment_availability) {
                _this.isInstalmentAvailable = res.instalment_availability;
            }
        });
    };
    FlightItemWrapperComponent.prototype.totalLaycredit = function () {
        var _this = this;
        this.genericService.getAvailableLaycredit().subscribe(function (res) {
            _this.totalLaycreditPoints = res.total_available_points;
        }, (function (error) {
        }));
    };
    FlightItemWrapperComponent.prototype.ngOnChanges = function (changes) {
        if (changes && changes.flightDetails && changes.flightDetails.currentValue) {
            this.flightList = changes.flightDetails.currentValue;
        }
        else if (changes && changes.filteredLabel && changes.filteredLabel.currentValue) {
            this.filteredLabel = changes.filteredLabel.currentValue;
        }
        // this.flightList = changes.flightDetails.currentValue;
    };
    FlightItemWrapperComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
    };
    FlightItemWrapperComponent.prototype.getDayDiff = function (arrivalDate, departureDate) {
        var diff = moment(arrivalDate, "DD/MM/YYYY").diff(moment(departureDate, "DD/MM/YYYY"), 'days');
        return diff;
    };
    FlightItemWrapperComponent.prototype.convertTime = function (time) {
        var newTime = this.commonFunction.convertTime(time, 'h:mm A', 'h:mma');
        return newTime.slice(0, -1);
    };
    FlightItemWrapperComponent.prototype.hideFlightNotAvailable = function () {
        this.isFlightNotAvailable = false;
        this.flightUniqueCode = '';
    };
    __decorate([
        core_1.Input()
    ], FlightItemWrapperComponent.prototype, "flightDetails");
    __decorate([
        core_1.Input()
    ], FlightItemWrapperComponent.prototype, "filter");
    __decorate([
        core_1.Input()
    ], FlightItemWrapperComponent.prototype, "filteredLabel");
    __decorate([
        core_1.Output()
    ], FlightItemWrapperComponent.prototype, "changeLoading");
    __decorate([
        core_1.Output()
    ], FlightItemWrapperComponent.prototype, "maxCartValidation");
    __decorate([
        core_1.Output()
    ], FlightItemWrapperComponent.prototype, "removeFlight");
    FlightItemWrapperComponent = __decorate([
        core_1.Component({
            selector: 'app-flight-item-wrapper',
            templateUrl: './flight-item-wrapper.component.html',
            styleUrls: ['./flight-item-wrapper.component.scss']
        })
    ], FlightItemWrapperComponent);
    return FlightItemWrapperComponent;
}());
exports.FlightItemWrapperComponent = FlightItemWrapperComponent;
var LaytripOkPopup = /** @class */ (function () {
    function LaytripOkPopup(modal) {
        this.modal = modal;
    }
    LaytripOkPopup = __decorate([
        core_1.Component({
            selector: 'laytrip-ok-popup',
            template: "<div class=\"modal-header\">\n      <h4 class=\"modal-title\">Warning</h4>\n    </div>\n    <div class=\"modal-body\">\n      <p>Please login to book flight</p>\n    </div>\n    <div class=\"modal-footer\">\n      <button type=\"button\" class=\"btn btn-light\" (click)=\"modal.close('Close click')\">OK</button>\n    </div>"
        })
    ], LaytripOkPopup);
    return LaytripOkPopup;
}());
exports.LaytripOkPopup = LaytripOkPopup;
