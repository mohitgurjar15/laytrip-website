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
var add_card_component_1 = require("../../../components/add-card/add-card.component");
var BookingComponent = /** @class */ (function () {
    function BookingComponent(router, flightService, genericService, travelerService, checkOutService, cartService, commonFunction, cookieService) {
        this.router = router;
        this.flightService = flightService;
        this.genericService = genericService;
        this.travelerService = travelerService;
        this.checkOutService = checkOutService;
        this.cartService = cartService;
        this.commonFunction = commonFunction;
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
        this.guestUserId = '';
        this.notAvailableError = '';
        this.isNotAvailableItinerary = false;
        this.isAllAlertClosed = true;
        this.isSubmitted = false;
        this.alertErrorMessage = '';
        this.inValidCartTravller = [];
        this.lottieLoaderType = "";
        this.add_new_card = false;
        this.totalCard = 0;
        this.modules = [];
        //this.totalLaycredit();
        this.getCountry();
    }
    BookingComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scroll(0, 0);
        localStorage.removeItem("__alrt");
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        if (this.userInfo && this.userInfo.roleId != 7) {
            this.getTravelers();
        }
        else {
            this.getTravelers();
            this.guestUserId = this.commonFunction.getGuestUser();
        }
        this.cartLoading = true;
        this.cartService.getCartList('yes').subscribe(function (items) {
            _this.cartLoading = false;
            var cart;
            var price;
            for (var i = 0; i < items.data.length; i++) {
                cart = {};
                price = {};
                cart.type = items.data[i].type;
                cart.travelers = items.data[i].travelers;
                cart.id = items.data[i].id;
                cart.is_available = items.data[i].is_available;
                _this.modules.push(items.data[i].type);
                if (_this.modules.some(function (x) { return x === "flight"; })) {
                    _this.lottieLoaderType = "flight";
                }
                else {
                    _this.lottieLoaderType = "hotel";
                }
                if (items.data[i].type == 'flight') {
                    cart.module_info = items.data[i].moduleInfo[0];
                    cart.old_module_info = {
                        selling_price: items.data[i].oldModuleInfo[0].selling_price
                    };
                    price.selling_price = items.data[i].moduleInfo[0].selling_price;
                    price.departure_date = items.data[i].moduleInfo[0].departure_date;
                    price.start_price = items.data[i].moduleInfo[0].start_price;
                    price.type = items.data[i].type;
                    price.location = items.data[i].moduleInfo[0].departure_code + "-" + items.data[i].moduleInfo[0].arrival_code;
                }
                else if (items.data[i].type == 'hotel') {
                    cart.module_info = items.data[i].moduleInfo[0];
                    cart.old_module_info = {
                        selling_price: items.data[i].oldModuleInfo[0].selling.total
                    };
                    price.type = items.data[i].type;
                    price.price_break_down = items.data[i].moduleInfo[0].selling;
                    price.mandatory_fee_details = items.data[i].moduleInfo[0].mandatory_fee_details;
                    price.selling_price = items.data[i].moduleInfo[0].selling.total;
                    price.departure_date = moment(items.data[i].moduleInfo[0].input_data.check_in, "YYYY-MM-DD").format('DD/MM/YYYY');
                    price.start_price = 0;
                    price.location = items.data[i].moduleInfo[0].hotel_name;
                }
                _this.carts.push(cart);
                _this.cartPrices.push(price);
            }
            _this.cartService.setCartItems(_this.carts);
            _this.cartService.setCartPrices(_this.cartPrices);
        }, function (error) {
            _this.isCartEmpty = true;
            _this.cartLoading = false;
            _this.carts = [];
            _this.cartPrices = [];
            localStorage.setItem('$crt', '0');
        });
        this.$cartIdsubscription = this.cartService.getCartId.subscribe(function (cartId) {
            if (cartId > 0) {
                _this.deleteCart(cartId);
            }
        });
        try {
            this.cardToken = this.cookieService.get('__cc');
            this.cardToken = this.cardToken || '';
        }
        catch (e) {
            this.cardToken = '';
        }
        this.checkOutService.getTravelerFormData.subscribe(function (travelerFrom) {
            _this.isValidTravelers = travelerFrom.status === 'VALID' ? true : false;
            _this.travelerForm = travelerFrom;
            if (_this.carts.length && _this.isSubmitted) {
                _this.validationErrorMessage = '';
                _this.validateCartItems();
            }
        });
        this.cartService.getLoaderStatus.subscribe(function (state) {
            _this.loading = state;
        });
        this.genericService.getCardItems.subscribe(function (res) {
            if (_this.totalCard != res.length) {
                _this.totalCard = res.length;
                _this.add_new_card = false;
            }
        });
        sessionStorage.setItem('__insMode', btoa(this.instalmentMode));
    };
    BookingComponent.prototype.totalNumberOfcard = function (event) {
        console.log(event, "------");
        //this.totalCard = event;
    };
    BookingComponent.prototype.addNewCard = function () {
        this.add_new_card = true;
    };
    BookingComponent.prototype.closeNewCardPanel = function (event) {
        console.log("Event", event);
        this.add_new_card = event;
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
            },
            type5: {
                adults: []
            },
            type6: {
                adults: []
            },
            type7: {
                adults: []
            },
            type8: {
                adults: []
            },
            type9: {
                adults: []
            }
        });
        if (this.addCardRef) {
            this.addCardRef.ngOnDestroy();
        }
        this.cartService.setCartNumber(0);
        this.cartService.setCardId(0);
        this.$cartIdsubscription.unsubscribe();
        this.checkOutService.setTravelers([]);
    };
    BookingComponent.prototype.redirectTo = function (uri) {
        var _this = this;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
            return _this.router.navigate([uri]);
        });
    };
    BookingComponent.prototype.deleteCart = function (cartId) {
        var _this = this;
        if (cartId == 0) {
            return;
        }
        this.loading = true;
        this.cartService.deleteCartItem(cartId).subscribe(function (res) {
            _this.loading = false;
            _this.redirectTo('/cart/booking');
            var index = _this.carts.findIndex(function (x) { return x.id == cartId; });
            _this.carts.splice(index, 1);
            _this.cartPrices.splice(index, 1);
            localStorage.removeItem('$cartOver');
            setTimeout(function () {
                _this.cartService.setCartItems(_this.carts);
                _this.cartService.setCartPrices(_this.cartPrices);
            }, 2000);
            if (_this.carts.length == 0) {
                _this.isCartEmpty = true;
            }
            if (index > 0) {
                _this.cartService.setCartNumber(index - 1);
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
        this.validationErrorMessage = '';
        this.validateCartItems();
    };
    BookingComponent.prototype.removeValidationError = function () {
        this.validationErrorMessage = '';
    };
    BookingComponent.prototype.validateCartItems = function () {
        this.validationErrorMessage = '';
        this.inValidCartTravller = [];
        /* if (!this.isValidTravelers) { */
        //this.validationErrorMessage = 'Complete required fields in Traveler Details for'
        var message = '';
        for (var i in Object.keys(this.travelerForm.controls)) {
            message = '';
            for (var j = 0; j < this.travelerForm.controls["type" + i]['controls'].adults.controls.length; j++) {
                console.log(this.travelerForm.controls["type" + i]['controls'].adults.controls[j]);
                if (typeof this.carts[i] != 'undefined' && this.carts[i].is_available && this.travelerForm.controls["type" + i]['controls'].adults.controls[j].status == 'INVALID') {
                    if (this.validationErrorMessage == '') {
                        this.validationErrorMessage = 'Complete required fields in Traveler Details for';
                    }
                    if (!this.inValidCartTravller.includes(i)) {
                        if (this.carts[i].type == 'flight') {
                            message = " " + this.carts[i].module_info.departure_code + "- " + this.carts[i].module_info.arrival_code + " ,";
                        }
                        if (this.carts[i].type == 'hotel') {
                            message = " " + this.carts[i].module_info.hotel_name + " ,";
                        }
                        this.validationErrorMessage += message;
                    }
                    this.isValidTravelers = false;
                    this.inValidCartTravller.push(i);
                }
                if (typeof this.carts[i] != 'undefined' && this.carts[i].is_available && this.travelerForm.controls["type" + i]['controls'].adults.controls[j].status == 'VALID') {
                    if (this.carts[i].is_available && this.travelerForm.controls["type" + i]['controls'].adults.controls[j].value.userId == "") {
                        if (this.validationErrorMessage == '') {
                            this.validationErrorMessage = 'Complete required fields in Traveler Details for';
                        }
                        if (!this.inValidCartTravller.includes(i)) {
                            if (this.carts[i].type == 'flight') {
                                message = " " + this.carts[i].module_info.departure_code + "- " + this.carts[i].module_info.arrival_code + " ,";
                            }
                            if (this.carts[i].type == 'hotel') {
                                message = " " + this.carts[i].module_info.title + " ,";
                            }
                            this.validationErrorMessage += message;
                        }
                        this.isValidTravelers = false;
                        this.inValidCartTravller.push(i);
                    }
                }
            }
        }
        var index = this.validationErrorMessage.lastIndexOf(" ");
        this.validationErrorMessage = this.validationErrorMessage.substring(0, index);
        /* } */
        var notAvailableMessage = '';
        this.notAvailableError = 'Itinerary is not available from ';
        for (var i = 0; i < this.carts.length; i++) {
            notAvailableMessage = '';
            if (!this.carts[i].is_available) {
                this.isNotAvailableItinerary = true;
                if (this.carts[i].type == 'flight') {
                    notAvailableMessage = " " + this.carts[i].module_info.departure_code + "- " + this.carts[i].module_info.arrival_code + " ,";
                }
                if (this.carts[i].type == 'hotel') {
                    notAvailableMessage = " " + this.carts[i].module_info.title + " ,";
                }
                this.notAvailableError += notAvailableMessage;
            }
        }
        if (this.isNotAvailableItinerary) {
            var index_1 = this.notAvailableError.lastIndexOf(" ");
            this.notAvailableError = this.notAvailableError.substring(0, index_1);
            //this.notAvailableError +='.';
        }
        var cartAlerts = localStorage.getItem("__alrt");
        this.alertErrorMessage = '';
        try {
            if (cartAlerts) {
                this.alertErrorMessage = 'Please close alert of price change for';
                cartAlerts = JSON.parse(cartAlerts);
                if (cartAlerts.length) {
                    for (var i = 0; i < cartAlerts.length; i++) {
                        if (cartAlerts[i].type == 'price_change') {
                            this.alertErrorMessage += " " + cartAlerts[i].name + " ,";
                        }
                    }
                    var index_2 = this.alertErrorMessage.lastIndexOf(" ");
                    this.alertErrorMessage = this.alertErrorMessage.substring(0, index_2);
                    /* for (let i = 0; i < cartAlerts.length; i++) {
                      if (cartAlerts[i].type == 'installment_vartion') {
                        if (cartAlerts.length == 1) {
                          this.alertErrorMessage = "Please close alert of odd installment amount.";
                        }
                        else {
                          this.alertErrorMessage += ` and odd installment amount.`;
                        }
                      }
                    } */
                    this.isAllAlertClosed = false;
                }
                else {
                    this.isAllAlertClosed = true;
                }
            }
            else {
                this.isAllAlertClosed = true;
            }
        }
        catch (e) {
            this.isAllAlertClosed = true;
        }
    };
    BookingComponent.prototype.continueToCheckout = function () {
        var _this = this;
        this.validationErrorMessage = '';
        this.validateCartItems();
        this.isSubmitted = true;
        if (this.cardToken == '') {
            if (this.validationErrorMessage == '') {
                this.validationErrorMessage = " Please select credit card";
            }
            else {
                this.validationErrorMessage += " and please select credit card";
            }
        }
        if (this.isValidTravelers && this.cardToken != '' && !this.isNotAvailableItinerary && this.isAllAlertClosed) {
            this.loading = true;
            this.travelerForm.enable();
            var _loop_2 = function (i) {
                var data = this_2.travelerForm.controls["type" + i].value.adults;
                /*  */
                var travelers = [];
                for (var k = 0; k < data.length; k++) {
                    travelers.push({
                        traveler_id: data[k].userId
                    });
                    if (data[k].dob) {
                        data[k].dob = moment(data[k].dob, "MM/DD/YYYY").format("YYYY-MM-DD");
                    }
                    if (data[k].passport_expiry) {
                        data[k].passport_expiry = moment(data[k].passport_expiry, "MM/DD/YYYY").format("YYYY-MM-DD");
                    }
                    this_2.travelerService.updateAdult(data[k], data[k].userId).subscribe(function (traveler) {
                    });
                }
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
        //this.add_new_card = false;
        this.cardListChangeCount = data;
    };
    BookingComponent.prototype.removeNotAvailableError = function () {
        this.isNotAvailableItinerary = false;
    };
    BookingComponent.prototype.removeAllAlertError = function () {
        this.isAllAlertClosed = true;
    };
    __decorate([
        core_1.ViewChild(add_card_component_1.AddCardComponent, { static: false })
    ], BookingComponent.prototype, "addCardRef");
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
