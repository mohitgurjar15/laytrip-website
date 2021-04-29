"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CheckoutComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var jwt_helper_1 = require("../../../_helpers/jwt.helper");
var moment = require("moment");
var add_card_component_1 = require("../../../components/add-card/add-card.component");
var CheckoutComponent = /** @class */ (function () {
    function CheckoutComponent(genericService, travelerService, checkOutService, cartService, cookieService, cd, router, commonFunction, route, modalService, spreedly) {
        this.genericService = genericService;
        this.travelerService = travelerService;
        this.checkOutService = checkOutService;
        this.cartService = cartService;
        this.cookieService = cookieService;
        this.cd = cd;
        this.router = router;
        this.commonFunction = commonFunction;
        this.route = route;
        this.modalService = modalService;
        this.spreedly = spreedly;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.progressStep = { step1: true, step2: true };
        this.isShowPaymentOption = true;
        this.laycreditpoints = 0;
        this.flightSummary = [];
        this.isLoggedIn = false;
        this.priceData = [];
        this.carts = [];
        this.isValidData = false;
        this.cartLoading = false;
        this.loading = false;
        this.isCartEmpty = false;
        this.cartPrices = [];
        this.cardToken = '';
        this.validationErrorMessage = '';
        this.isValidTravelers = false;
        this.cardListChangeCount = 0;
        this.isBookingProgress = false;
        this.guestUserId = '';
        this.bookingRequest = {
            payment_type: "",
            laycredit_points: 0,
            card_token: "",
            instalment_type: "",
            additional_amount: 0,
            booking_through: "web",
            cart: [],
            browser_info: {},
            site_url: "",
            selected_down_payment: 0
        };
        this.challengePopUp = false;
        this.isSessionTimeOut = false;
        this.isBookingRequest = false;
        this.inValidCartTravller = [];
        this.totalCard = 0;
        this.add_new_card = false;
        this.alertErrorMessage = '';
        this.isAllAlertClosed = true;
        this.isTermConditionAccepted = false;
        this.isTermConditionError = false;
        this.isExcludedCountryAccepted = false;
        this.isExcludedCountryError = false;
        this.lottieLoaderType = "";
        this.modules = [];
        //this.totalLaycredit();
        this.getCountry();
        // this.openBookingCompletionErrorPopup();
    }
    CheckoutComponent.prototype.ngOnInit = function () {
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
            if (items && items.data && items.data.length) {
                _this.bookingTimerConfiguration();
            }
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
        });
        try {
            var data = sessionStorage.getItem('__islt');
            data = atob(data);
            this.priceSummary = JSON.parse(data);
        }
        catch (e) {
            this.router.navigate(['/']);
        }
        this.$cartIdsubscription = this.cartService.getCartId.subscribe(function (cartId) {
            if (cartId > 0) {
                _this.deleteCart(cartId);
            }
        });
        this.checkOutService.getTravelerFormData.subscribe(function (travelerFrom) {
            _this.isValidTravelers = travelerFrom.status === 'VALID' ? true : false;
            _this.travelerForm = travelerFrom;
        });
        try {
            this.cardToken = this.cookieService.get('__cc');
        }
        catch (e) {
            this.cardToken = '';
        }
        this.cartService.getLoaderStatus.subscribe(function (state) {
            _this.loading = state;
        });
        this.genericService.getCardItems.subscribe(function (res) {
            if (_this.totalCard != res.length) {
                _this.totalCard = res.length;
                _this.add_new_card = false;
            }
        });
    };
    CheckoutComponent.prototype.sessionTimeout = function (event) {
        this.isSessionTimeOut = event;
        if (this.isSessionTimeOut && !this.isBookingRequest) {
            this.router.navigate(['/cart/booking']);
        }
    };
    CheckoutComponent.prototype.bookingTimerConfiguration = function () {
        this.bookingTimerConfig = Object.assign({}, {
            leftTime: 600,
            format: 'm:s'
        });
    };
    CheckoutComponent.prototype.getTravelers = function () {
        var _this = this;
        this.travelerService.getTravelers().subscribe(function (res) {
            _this.checkOutService.setTravelers(res.data);
            _this.cd.detectChanges();
        });
    };
    CheckoutComponent.prototype.getCountry = function () {
        var _this = this;
        this.genericService.getCountry().subscribe(function (res) {
            _this.checkOutService.setCountries(res);
        });
    };
    CheckoutComponent.prototype.ngOnDestroy = function () {
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
    CheckoutComponent.prototype.getCardListChange = function (data) {
        //this.add_new_card = false;
        this.cardListChangeCount = data;
    };
    CheckoutComponent.prototype.redirectTo = function (uri) {
        var _this = this;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
            return _this.router.navigate([uri]);
        });
    };
    CheckoutComponent.prototype.deleteCart = function (cartId) {
        var _this = this;
        if (cartId == 0) {
            return;
        }
        this.loading = true;
        this.cartService.deleteCartItem(cartId).subscribe(function (res) {
            _this.loading = false;
            _this.redirectTo('/cart/checkout');
            var index = _this.carts.findIndex(function (x) { return x.id == cartId; });
            _this.carts.splice(index, 1);
            _this.cartPrices.splice(index, 1);
            localStorage.removeItem('$cartOver');
            _this.adjustPriceSummary();
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
    CheckoutComponent.prototype.validateCartItems = function () {
        this.validationErrorMessage = '';
        var message = '';
        this.inValidCartTravller = [];
        for (var i in Object.keys(this.travelerForm.controls)) {
            message = '';
            for (var j = 0; j < this.travelerForm.controls["type" + i]['controls'].adults.controls.length; j++) {
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
                    var index_1 = this.alertErrorMessage.lastIndexOf(" ");
                    this.alertErrorMessage = this.alertErrorMessage.substring(0, index_1);
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
        if (!this.isTermConditionAccepted) {
            this.isTermConditionError = true;
        }
        else {
            this.isTermConditionError = false;
        }
        if (!this.isExcludedCountryAccepted) {
            this.isExcludedCountryError = true;
        }
        else {
            this.isExcludedCountryError = false;
        }
    };
    CheckoutComponent.prototype.removeValidationError = function () {
        this.validationErrorMessage = '';
    };
    CheckoutComponent.prototype.bookFlight = function () {
        var _this = this;
        this.isBookingRequest = true;
        this.validationErrorMessage = '';
        this.validateCartItems();
        if (this.userInfo.roleId == 7) {
            $('#sign_in_modal').modal('show');
            return false;
        }
        var carts = this.carts.map(function (cart) { return { cart_id: cart.id }; });
        this.bookingRequest.card_token = this.cardToken;
        this.bookingRequest.selected_down_payment = this.priceSummary.selectedDownPayment;
        this.bookingRequest.payment_type = this.priceSummary.paymentType;
        this.bookingRequest.instalment_type = this.priceSummary.instalmentType;
        this.bookingRequest.cart = carts;
        sessionStorage.setItem('__cbk', JSON.stringify(this.bookingRequest));
        if (this.isValidTravelers && this.cardToken != '' && this.isAllAlertClosed && this.isTermConditionAccepted && this.isExcludedCountryAccepted) {
            this.isBookingProgress = true;
            window.scroll(0, 0);
            var _loop_1 = function (i) {
                var data = this_1.travelerForm.controls["type" + i].value.adults;
                //let travelers = data.map(traveler => { return { traveler_id: traveler.userId } })
                var travelers = [];
                for (var k = 0; k < data.length; k++) {
                    travelers.push({
                        traveler_id: data[k].userId
                    });
                    data[k].dob = moment(data[k].dob, "MM/DD/YYYY").format("YYYY-MM-DD");
                    if (data[k].passport_expiry) {
                        data[k].passport_expiry = moment(data[k].passport_expiry, "MM/DD/YYYY").format("YYYY-MM-DD");
                    }
                    this_1.travelerService.updateAdult(data[k], data[k].userId).subscribe(function (traveler) {
                    });
                }
                var cartData = {
                    cart_id: this_1.carts[i].id,
                    travelers: travelers
                };
                this_1.cartService.updateCart(cartData).subscribe(function (data) {
                    if (i === _this.carts.length - 1) {
                        var browser_info = _this.spreedly.browserInfo();
                        console.log(browser_info);
                        _this.bookingRequest.browser_info = browser_info;
                        if (window.location.origin.includes("localhost")) {
                            _this.bookingRequest.site_url = 'https://demo.eztoflow.com';
                        }
                        else {
                            _this.bookingRequest.site_url = window.location.origin;
                        }
                        _this.cartService.validate(_this.bookingRequest).subscribe(function (res) {
                            var transaction = res.transaction;
                            var redirection = res.redirection.replace('https://demo.eztoflow.com', 'http://localhost:4200');
                            res.redirection = redirection;
                            console.log("res", res);
                            if (transaction.state == "succeeded") {
                                console.log('succeeded', [redirection]);
                                window.location.href = redirection;
                            }
                            else if (transaction.state == "pending") {
                                console.log('pending', [res]);
                                _this.isBookingProgress = false;
                                _this.challengePopUp = true;
                                _this.spreedly.lifeCycle(res);
                            }
                            else {
                                console.log('fail', [res]);
                                _this.router.navigate(['/cart/checkout']);
                            }
                        }, function (error) {
                            console.log(error);
                        });
                    }
                }, function (error) {
                    _this.isBookingProgress = false;
                });
            };
            var this_1 = this;
            for (var i = 0; i < this.carts.length; i++) {
                _loop_1(i);
            }
        }
        else {
            this.isBookingProgress = false;
        }
    };
    CheckoutComponent.prototype.adjustPriceSummary = function () {
        var _this = this;
        var totalPrice = 0;
        var checkinDate;
        if (this.cartPrices.length > 0) {
            checkinDate = moment(this.cartPrices[0].departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
            for (var i = 0; i < this.cartPrices.length; i++) {
                totalPrice += this.cartPrices[i].selling_price;
                if (i == 0) {
                    continue;
                }
                if (moment(checkinDate).isAfter(moment(this.cartPrices[i].departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD"))) {
                    checkinDate = moment(this.cartPrices[i].departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
                }
            }
        }
        var instalmentRequest = {
            instalment_type: this.priceSummary.instalmentType,
            checkin_date: checkinDate,
            booking_date: moment().format("YYYY-MM-DD"),
            amount: totalPrice,
            additional_amount: 0,
            selected_down_payment: this.priceSummary.selectedDownPayment
        };
        this.genericService.getInstalemnts(instalmentRequest).subscribe(function (res) {
            if (res.instalment_available == true) {
                _this.priceSummary.instalments = res;
                _this.priceSummary.remainingAmount = totalPrice - res.instalment_date[0].instalment_amount;
                _this.priceSummary.totalAmount = totalPrice;
                _this.priceSummary = Object.assign({}, _this.priceSummary);
                _this.cd.detectChanges();
            }
        }, function (err) {
        });
    };
    CheckoutComponent.prototype.addNewCard = function () {
        this.add_new_card = true;
    };
    CheckoutComponent.prototype.closeNewCardPanel = function (event) {
        this.add_new_card = event;
    };
    CheckoutComponent.prototype.totalNumberOfcard = function (event) {
        console.log(event);
        //this.totalCard = event;
    };
    CheckoutComponent.prototype.acceptTermCondition = function (event) {
        if (event.target.checked) {
            this.isTermConditionAccepted = true;
            this.isTermConditionError = false;
        }
        else {
            this.isTermConditionAccepted = false;
            this.isTermConditionError = true;
        }
    };
    CheckoutComponent.prototype.removeTermConditionError = function () {
        this.isTermConditionError = false;
    };
    CheckoutComponent.prototype.acceptExcludedCountry = function (event) {
        if (event.target.checked) {
            this.isExcludedCountryAccepted = true;
            this.isExcludedCountryError = false;
        }
        else {
            this.isExcludedCountryAccepted = false;
            this.isExcludedCountryError = true;
        }
    };
    CheckoutComponent.prototype.removeExculdedError = function () {
        this.isExcludedCountryError = false;
    };
    __decorate([
        core_1.ViewChild(add_card_component_1.AddCardComponent, { static: false })
    ], CheckoutComponent.prototype, "addCardRef");
    CheckoutComponent = __decorate([
        core_1.Component({
            selector: 'app-checkout',
            templateUrl: './checkout.component.html',
            styleUrls: ['./checkout.component.scss']
        })
    ], CheckoutComponent);
    return CheckoutComponent;
}());
exports.CheckoutComponent = CheckoutComponent;
