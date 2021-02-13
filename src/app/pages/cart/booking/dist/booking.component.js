"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BookingComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var jwt_helper_1 = require("../../../_helpers/jwt.helper");
var moment = require("moment");
var BookingComponent = /** @class */ (function () {
    function BookingComponent(router, flightService, genericService, travelerService, checkOutService, cartService, toster, cookieService) {
        this.router = router;
        this.flightService = flightService;
        this.genericService = genericService;
        this.travelerService = travelerService;
        this.checkOutService = checkOutService;
        this.cartService = cartService;
        this.toster = toster;
        this.cookieService = cookieService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.progressStep = { step1: true, step2: false, step3: false, step4: false };
        this.isShowPaymentOption = true;
        this.laycreditpoints = 0;
        this.flightSummary = [];
        this.instalmentMode = 'instalment';
        this.instalmentType = 'weekly';
        this.isLoggedIn = false;
        this.showPartialPayemntOption = true;
        this.priceData = [];
        this.totalLaycreditPoints = 0;
        this.isLayCreditLoading = false;
        this.carts = [];
        this.isValidData = false;
        this.isValidTravelers = false;
        this.cartLoading = false;
        this.loading = false;
        this.isCartEmpty = false;
        this.cartPrices = [];
        this.cardToken = '';
        this.validationErrorMessage = '';
        this.cardListChangeCount = 0;
        //this.totalLaycredit();
        this.getCountry();
    }
    BookingComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scroll(0, 0);
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        if (this.userInfo && Object.keys(this.userInfo).length > 0) {
            this.getTravelers();
        }
        this.cartLoading = true;
        this.cartService.getCartList('yes').subscribe(function (items) {
            _this.cartLoading = false;
            var notAvilableItems = [];
            var cart;
            var price;
            for (var i = 0; i < items.data.length; i++) {
                cart = {};
                cart.type = items.data[i].type;
                cart.module_info = items.data[i].moduleInfo[0];
                cart.old_module_info = {
                    selling_price: items.data[i].oldModuleInfo[0].selling_price
                };
                cart.travelers = items.data[i].travelers;
                cart.id = items.data[i].id;
                _this.carts.push(cart);
                price = {};
                price.selling_price = items.data[i].moduleInfo[0].selling_price;
                price.departure_date = items.data[i].moduleInfo[0].departure_date;
                price.start_price = items.data[i].moduleInfo[0].start_price;
                price.location = items.data[i].moduleInfo[0].departure_code + "-" + items.data[i].moduleInfo[0].arrival_code;
                _this.cartPrices.push(price);
                if (items.data[i].is_available) {
                }
                else {
                    notAvilableItems.push(items.data[i]);
                }
            }
            _this.cartService.setCartPrices(_this.cartPrices);
            if (notAvilableItems.length) {
                // this.toastrService.warning(`${notAvilableItems.length} itinerary is not available`);
            }
        }, function (error) {
            _this.isCartEmpty = true;
            _this.cartLoading = false;
        });
        this.cartService.getCartId.subscribe(function (cartId) {
            if (cartId > 0) {
                _this.deleteCart(cartId);
                _this.cartService.setCardId(0);
            }
        });
        this.checkOutService.getTravelerFormData.subscribe(function (travelerFrom) {
            _this.isValidTravelers = travelerFrom.status === 'VALID' ? true : false;
            _this.travelerForm = travelerFrom;
        });
        sessionStorage.setItem('__insMode', btoa(this.instalmentMode));
    };
    BookingComponent.prototype.ngAfterViewInit = function () {
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        if (this.userInfo && Object.keys(this.userInfo).length > 0) {
            this.getTravelers();
        }
    };
    BookingComponent.prototype.totalLaycredit = function () {
        var _this = this;
        this.isLayCreditLoading = true;
        this.genericService.getAvailableLaycredit().subscribe(function (res) {
            _this.isLayCreditLoading = false;
            _this.totalLaycreditPoints = res.total_available_points;
        }, (function (error) {
            _this.isLayCreditLoading = false;
        }));
    };
    BookingComponent.prototype.applyLaycredit = function (laycreditpoints) {
        this.laycreditpoints = laycreditpoints;
        this.isShowPaymentOption = true;
        if (this.laycreditpoints >= this.sellingPrice) {
            this.isShowPaymentOption = false;
        }
    };
    BookingComponent.prototype.getSellingPrice = function () {
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
    BookingComponent.prototype.selectInstalmentMode = function (instalmentMode) {
        this.instalmentMode = instalmentMode;
        this.showPartialPayemntOption = (this.instalmentMode == 'instalment') ? true : false;
        sessionStorage.setItem('__insMode', btoa(this.instalmentMode));
    };
    BookingComponent.prototype.getInstalmentData = function (data) {
        this.instalmentType = data.instalmentType;
        //this.laycreditpoints = data.layCreditPoints;
        this.priceSummary = data;
        this.checkOutService.setPriceSummary(this.priceSummary);
        sessionStorage.setItem('__islt', btoa(JSON.stringify(data)));
    };
    BookingComponent.prototype.ngDoCheck = function () {
        var userToken = localStorage.getItem('_lay_sess');
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        if (userToken) {
            this.isLoggedIn = true;
        }
    };
    BookingComponent.prototype.redeemableLayCredit = function (event) {
        this.redeemableLayPoints = event;
    };
    BookingComponent.prototype.getTravelers = function () {
        var _this = this;
        this.travelerService.getTravelers().subscribe(function (res) {
            //this.travelers=res.data;
            _this.checkOutService.setTravelers(res.data);
        });
    };
    BookingComponent.prototype.getCountry = function () {
        var _this = this;
        this.genericService.getCountry().subscribe(function (res) {
            _this.checkOutService.setCountries(res);
        });
    };
    BookingComponent.prototype.handleSubmit = function () {
        this.router.navigate(['/flight/checkout']);
    };
    BookingComponent.prototype.ngOnDestroy = function () {
        this.cartService.setCartTravelers({
            type0: {
                adults: []
            },
            type1: {
                adults: []
            },
            type2: {
                adults: []
            },
            type3: {
                adults: []
            },
            type4: {
                adults: []
            }
        });
    };
    BookingComponent.prototype.deleteCart = function (cartId) {
        var _this = this;
        this.loading = true;
        this.cartService.deleteCartItem(cartId).subscribe(function (res) {
            _this.loading = false;
            var index = _this.carts.findIndex(function (x) { return x.id == cartId; });
            _this.carts.splice(index, 1);
            _this.cartPrices.splice(index, 1);
            setTimeout(function () {
                _this.cartService.setCartItems(_this.carts);
                _this.cartService.setCartPrices(_this.cartPrices);
            }, 2000);
            if (_this.carts.length == 0) {
                _this.isCartEmpty = true;
            }
            localStorage.setItem('$crt', JSON.stringify(_this.carts.length));
            _this.cartService.setDeletedCartItem(index);
        }, function (error) {
            _this.loading = false;
            if (error.status == 404) {
                var index = _this.carts.findIndex(function (x) { return x.id == cartId; });
                _this.carts.splice(index, 1);
                _this.cartService.setCartItems(_this.carts);
                if (_this.carts.length == 0) {
                    _this.isCartEmpty = true;
                }
                localStorage.setItem('$crt', JSON.stringify(_this.carts.length));
            }
        });
    };
    BookingComponent.prototype.saveAndSearch = function () {
        var _this = this;
        this.router.navigate(['/']);
        return false;
        this.validationErrorMessage = '';
        if (this.isValidTravelers) {
            this.loading = true;
            var _loop_1 = function (i) {
                var data = this_1.travelerForm.controls["type" + i].value.adults;
                var travelers = data.map(function (traveler) { return { traveler_id: traveler.userId }; });
                var cartData = {
                    cart_id: this_1.carts[i].id,
                    travelers: travelers
                };
                this_1.cartService.updateCart(cartData).subscribe(function (data) {
                    if (i === _this.carts.length - 1) {
                        _this.loading = false;
                        _this.router.navigate(['/']);
                    }
                });
            };
            var this_1 = this;
            for (var i = 0; i < this.carts.length; i++) {
                _loop_1(i);
            }
        }
        else {
            this.validateCartItems();
        }
    };
    BookingComponent.prototype.selectCreditCard = function (data) {
        this.cardToken = data;
        this.cookieService.put("__cc", this.cardToken);
    };
    BookingComponent.prototype.removeValidationError = function () {
        this.validationErrorMessage = '';
    };
    BookingComponent.prototype.validateCartItems = function () {
        this.validationErrorMessage = '';
        if (!this.isValidTravelers) {
            this.validationErrorMessage = 'Traveller details is not valid for ';
            var message = '';
            for (var i in Object.keys(this.travelerForm.controls)) {
                message = '';
                if (this.travelerForm.controls["type" + i].status == "INVALID") {
                    message = this.carts[i].module_info.departure_code + "- " + this.carts[i].module_info.arrival_code + " and";
                    this.validationErrorMessage += message;
                }
            }
            var index = this.validationErrorMessage.lastIndexOf(" ");
            this.validationErrorMessage = this.validationErrorMessage.substring(0, index);
        }
    };
    BookingComponent.prototype.continueToCheckout = function () {
        var _this = this;
        this.validationErrorMessage = '';
        this.validateCartItems();
        if (this.cardToken == '') {
            if (this.validationErrorMessage == '') {
                this.validationErrorMessage = " Please select credit card";
            }
            else {
                this.validationErrorMessage += " and please select credit card";
            }
        }
        if (this.isValidTravelers && this.cardToken != '') {
            this.loading = true;
            var _loop_2 = function (i) {
                var data = this_2.travelerForm.controls["type" + i].value.adults;
                var travelers = data.map(function (traveler) { return { traveler_id: traveler.userId }; });
                var cartData = {
                    cart_id: this_2.carts[i].id,
                    travelers: travelers
                };
                this_2.cartService.updateCart(cartData).subscribe(function (data) {
                    if (i === _this.carts.length - 1) {
                        _this.loading = false;
                        _this.router.navigate(['/cart/checkout']);
                    }
                });
            };
            var this_2 = this;
            for (var i = 0; i < this.carts.length; i++) {
                _loop_2(i);
            }
        }
    };
    BookingComponent.prototype.getCardListChange = function (data) {
        this.cardListChangeCount = data;
    };
    BookingComponent = __decorate([
        core_1.Component({
            selector: 'app-booking',
            templateUrl: './booking.component.html',
            styleUrls: ['./booking.component.scss']
        })
    ], BookingComponent);
    return BookingComponent;
}());
exports.BookingComponent = BookingComponent;
