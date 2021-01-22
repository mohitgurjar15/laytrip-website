"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightPaymentComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var jwt_helper_1 = require("../../../_helpers/jwt.helper");
var moment = require("moment");
var FlightPaymentComponent = /** @class */ (function () {
    function FlightPaymentComponent(route, router, flightService, genericService, travelerService, checkOutService, cartService, toastrService) {
        this.route = route;
        this.router = router;
        this.flightService = flightService;
        this.genericService = genericService;
        this.travelerService = travelerService;
        this.checkOutService = checkOutService;
        this.cartService = cartService;
        this.toastrService = toastrService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.progressStep = { step1: true, step2: false, step3: false, step4: false };
        this.isShowPaymentOption = true;
        this.laycreditpoints = 0;
        this.flightSummary = [];
        this.instalmentMode = 'instalment';
        this.instalmentType = 'weekly';
        this.routeCode = '';
        this.isFlightNotAvailable = false;
        this.isShowGuestPopup = false;
        this.isLoggedIn = false;
        this.showPartialPayemntOption = true;
        this.payNowAmount = 0;
        this.priceData = [];
        this.totalLaycreditPoints = 0;
        this.isLayCreditLoading = false;
        this.travelers = [];
        this.carts = [];
        this.isValidData = false;
        this.totalLaycredit();
    }
    FlightPaymentComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scroll(0, 0);
        this.routeCode = this.route.snapshot.paramMap.get('rc');
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        if (Object.keys(this.userInfo).length > 0) {
            this.getTravelers();
        }
        /* this.genericService.getCartList().subscribe((items:any) => {
          let notAvilableItems=[];
          let cart:any;
          for(let i=0; i<items.data.length; i++){
            cart={};
            cart.type = items.data[i].type;
            cart.module_info = items.data[i].moduleInfo[0];
            this.carts.push(cart);
            if(items.data[i].is_available){
              
              
            }
            else{
              notAvilableItems.push(items.data[i])
            }
          }
          console.log("this.carts...",this.carts)
    
          if(notAvilableItems.length){
            this.toastrService.warning(`${notAvilableItems.length} itinerary is not available`);
          }
        }); */
        var __route = sessionStorage.getItem('__route');
        try {
            var response = JSON.parse(__route);
            response[0] = response;
            this.flightSummary = response;
            this.carts[0] = {
                type: 'flight',
                module_info: this.flightSummary
            };
            this.carts[1] = {
                type: 'flight',
                module_info: this.flightSummary
            };
            //this.sellingPrice = response[0].selling_price;
            this.getSellingPrice();
        }
        catch (e) {
        }
        this.checkOutService.getTravelerFormData.subscribe(function (travelerFrom) {
            console.log("get traveler form", travelerFrom);
            _this.isValidData = travelerFrom.status === 'VALID' ? true : false;
        });
        sessionStorage.setItem('__insMode', btoa(this.instalmentMode));
    };
    FlightPaymentComponent.prototype.ngAfterViewInit = function () {
        $(".trans_btn").hover(function () {
            $('.pink_search').toggleClass("d-none");
            $('.white_search').toggleClass("show");
        });
    };
    FlightPaymentComponent.prototype.totalLaycredit = function () {
        var _this = this;
        this.isLayCreditLoading = true;
        this.genericService.getAvailableLaycredit().subscribe(function (res) {
            _this.isLayCreditLoading = false;
            _this.totalLaycreditPoints = res.total_available_points;
            //console.log("this.totalLaycreditPoints////",this.totalLaycreditPoints)
        }, (function (error) {
            _this.isLayCreditLoading = false;
        }));
    };
    FlightPaymentComponent.prototype.applyLaycredit = function (laycreditpoints) {
        this.laycreditpoints = laycreditpoints;
        this.isShowPaymentOption = true;
        if (this.laycreditpoints >= this.sellingPrice) {
            this.isShowPaymentOption = false;
        }
    };
    FlightPaymentComponent.prototype.getSellingPrice = function () {
        var _this = this;
        var payLoad = {
            departure_date: moment(this.flightSummary[0].departure_date, 'DD/MM/YYYY').format("YYYY-MM-DD"),
            net_rate: this.flightSummary[0].net_rate
        };
        this.flightService.getSellingPrice(payLoad).subscribe(function (res) {
            _this.priceData = res;
            _this.sellingPrice = _this.priceData[0].selling_price;
        }, function (error) {
        });
    };
    FlightPaymentComponent.prototype.selectInstalmentMode = function (instalmentMode) {
        this.instalmentMode = instalmentMode;
        this.showPartialPayemntOption = (this.instalmentMode == 'instalment') ? true : false;
        sessionStorage.setItem('__insMode', btoa(this.instalmentMode));
    };
    FlightPaymentComponent.prototype.getInstalmentData = function (data) {
        this.instalmentType = data.instalmentType;
        //this.laycreditpoints = data.layCreditPoints;
        this.priceSummary = data;
        sessionStorage.setItem('__islt', btoa(JSON.stringify(data)));
    };
    FlightPaymentComponent.prototype.flightAvailable = function (event) {
        this.isFlightNotAvailable = event;
    };
    FlightPaymentComponent.prototype.checkUserAndRedirect = function () {
        if (typeof this.userInfo.roleId != 'undefined' && this.userInfo.roleId != 7) {
            this.router.navigate(['/flight/checkout', this.routeCode]);
        }
        else {
            this.isShowGuestPopup = true;
        }
    };
    FlightPaymentComponent.prototype.changePopupValue = function (event) {
        this.isShowGuestPopup = event;
    };
    FlightPaymentComponent.prototype.ngDoCheck = function () {
        var userToken = localStorage.getItem('_lay_sess');
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        if (userToken) {
            this.isLoggedIn = true;
        }
    };
    FlightPaymentComponent.prototype.redeemableLayCredit = function (event) {
        this.redeemableLayPoints = event;
    };
    FlightPaymentComponent.prototype.getTravelers = function () {
        var _this = this;
        this.travelerService.getTravelers().subscribe(function (res) {
            //this.travelers=res.data;
            _this.checkOutService.setTravelers(res.data);
        });
    };
    FlightPaymentComponent.prototype.handleSubmit = function () {
        console.log("valid data");
        this.router.navigate(['/flight/checkout', this.routeCode]);
    };
    FlightPaymentComponent = __decorate([
        core_1.Component({
            selector: 'app-flight-payment',
            templateUrl: './flight-payment.component.html',
            styleUrls: ['./flight-payment.component.scss']
        })
    ], FlightPaymentComponent);
    return FlightPaymentComponent;
}());
exports.FlightPaymentComponent = FlightPaymentComponent;
