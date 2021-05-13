"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MainHeaderComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var jwt_helper_1 = require("../../_helpers/jwt.helper");
var moment = require("moment");
var empty_cart_component_1 = require("../../components/empty-cart/empty-cart.component");
var apple_security_login_popup_component_1 = require("../../pages/user/apple-security-login-popup/apple-security-login-popup.component");
var generic_helper_1 = require("../../_helpers/generic.helper");
var MainHeaderComponent = /** @class */ (function () {
    function MainHeaderComponent(genericService, translate, modalService, router, commonFunction, cd, cartService, cookieService, userService) {
        this.genericService = genericService;
        this.translate = translate;
        this.modalService = modalService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.cd = cd;
        this.cartService = cartService;
        this.cookieService = cookieService;
        this.userService = userService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
        this.isLoggedIn = false;
        this.totalLayCredit = 0;
        this.showTotalLayCredit = 0;
        this._isLayCredit = false;
        this.isCovidPage = true;
        this.fullPageLoading = false;
        this.guestUserId = '';
        this.isOpenAppleLoginPopup = false;
        this.paymentType = '';
        this.instalmentType = 'weekly';
    }
    MainHeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.checkUser();
        this.loadJquery();
        //this.getUserLocationInfo();
        if (this.isLoggedIn) {
            this.totalLaycredit();
        }
        this.getCartList();
        this.installmentOptions = generic_helper_1.installmentType;
        this.cartService.getCartItems.subscribe(function (data) {
            if (data.length > 0) {
                _this.updateCartSummary();
            }
        });
        this.countryCode = this.commonFunction.getUserCountry();
        this.cartService.getPaymentOptions.subscribe(function (data) {
            if (Object.keys(data).length > 0) {
                _this.paymentInfo = data;
                if (data.paymentType == 'instalment') {
                    _this.paymentType = 'instalment';
                    _this.instalmentType = data.instalmentType;
                    _this.installmentAmount = data.instalments.instalment_date[1].instalment_amount;
                }
                else {
                    _this.paymentType = 'no-instalment';
                    _this.instalmentType = '';
                }
            }
            else {
                try {
                    var data_1 = localStorage.getItem("__pm_inf");
                    data_1 = atob(data_1);
                    data_1 = JSON.parse(data_1);
                    _this.paymentInfo = data_1;
                    if (data_1.paymentType == 'instalment') {
                        _this.paymentType = 'instalment';
                        _this.instalmentType = data_1.instalmentType;
                        _this.installmentAmount = data_1.instalments.instalment_date[1].instalment_amount;
                    }
                    else {
                        _this.paymentType = 'no-instalment';
                        _this.instalmentType = '';
                    }
                }
                catch (e) {
                    _this.paymentInfo = {};
                }
            }
        });
    };
    MainHeaderComponent.prototype.getCartList = function () {
        var _this = this;
        var live_availiblity = 'no';
        var url = window.location.href;
        if (url.includes('cart/booking') || url.includes('cart/checkout')) {
            live_availiblity = 'yes';
        }
        this.cartService.getCartList(live_availiblity).subscribe(function (res) {
            if (res) {
                // SET CART ITEMS IN CART SERVICE
                var cartItems = res.data.map(function (item) { return { id: item.id, module_Info: item.moduleInfo[0], type: item.type }; });
                _this.cartItems = cartItems;
                _this.cartService.setCartItems(cartItems);
                if (cartItems) {
                    _this.cartItemsCount = res.data.length;
                    localStorage.setItem('$crt', _this.cartItemsCount);
                }
                _this.calculateInstalment(cartItems);
                // this.cd.detectChanges();
            }
        }, function (error) {
            if (error && error.status === 404) {
                _this.cartItems = [];
                _this.cartItemsCount = 0;
                localStorage.setItem('$crt', _this.cartItemsCount);
            }
        });
    };
    MainHeaderComponent.prototype.updateCartSummary = function () {
        var _this = this;
        var live_availiblity = 'no';
        var url = window.location.href;
        if (url.includes('cart/booking') || url.includes('cart/checkout')) {
            live_availiblity = 'yes';
        }
        this.cartService.getCartList(live_availiblity).subscribe(function (res) {
            if (res) {
                // SET CART ITEMS IN CART SERVICE
                var cartItems = res.data.map(function (item) {
                    return { id: item.id, module_Info: item.moduleInfo[0], type: item.type };
                });
                _this.calculateInstalment(cartItems);
                _this.cd.detectChanges();
            }
        }, function (error) {
            if (error && error.status === 404) {
            }
        });
    };
    MainHeaderComponent.prototype.ngDoCheck = function () {
        var _this = this;
        this.checkUser();
        this.cartOverLimit = JSON.parse(localStorage.getItem('$cartOver'));
        this.cd.detectChanges();
        var host = window.location.href;
        this.isCovidPage = true;
        if (host.includes("covid-19")) {
            this.isCovidPage = false;
        }
        this.cartService.getCartItems.subscribe(function (res) {
            try {
                _this.cartItemsCount = JSON.parse(localStorage.getItem('$crt'));
            }
            catch (e) {
            }
        });
    };
    MainHeaderComponent.prototype.checkUser = function () {
        this.userDetails = jwt_helper_1.getLoginUserInfo();
        this.isLoggedIn = false;
        if (Object.keys(this.userDetails).length && this.userDetails.roleId != 7) {
            localStorage.removeItem("_isSubscribeNow");
            this.isLoggedIn = true;
            if (typeof this.userDetails.email != 'undefined' && this.userDetails.email != '') {
                var name = this.userDetails.email.substring(0, this.userDetails.email.lastIndexOf("@"));
                var domain = this.userDetails.email.substring(this.userDetails.email.lastIndexOf("@") + 1);
            }
            this.username = this.userDetails.firstName ? this.userDetails.firstName : name;
            if (!this._isLayCredit) {
                this.totalLaycredit();
                this.getCartList();
            }
            this.showTotalLayCredit = this.totalLayCredit;
            if (this.userDetails && this.userDetails.requireToupdate) {
                if (!this.isOpenAppleLoginPopup) {
                    this.openAppleSecurityLogin();
                    this.isOpenAppleLoginPopup = true;
                }
            }
        }
    };
    MainHeaderComponent.prototype.openAppleSecurityLogin = function () {
        var modalRef = this.modalService.open(apple_security_login_popup_component_1.AppleSecurityLoginPopupComponent, {
            windowClass: 'apple_security_login_block', centered: true, backdrop: 'static',
            keyboard: false
        }).result.then(function (result) {
        });
    };
    MainHeaderComponent.prototype.onLoggedout = function () {
        this.isLoggedIn = this._isLayCredit = false;
        this.showTotalLayCredit = 0;
        localStorage.removeItem('_lay_sess');
        localStorage.removeItem('$crt');
        localStorage.removeItem('$cartOver');
        this.cookieService.remove('__cc');
        this.cartItemsCount = '';
        this.cartService.setCartItems([]);
        this.loginGuestUser();
        if (this.commonFunction.isRefferal()) {
            var parms = this.commonFunction.getRefferalParms();
            var queryParams = {};
            queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
            if (queryParams.utm_medium) {
                queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
            }
            if (queryParams.utm_campaign) {
                queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
            }
            this.router.navigate(["/"], { queryParams: queryParams });
        }
        else {
            this.router.navigate(['/']);
        }
    };
    MainHeaderComponent.prototype.loadJquery = function () {
        // Start sticky header js
        $(document).ready(function () {
            if ($(window).width() > 992) {
                var navbar_height = $('.site_header').outerHeight();
                $(window).scroll(function () {
                    if ($(this).scrollTop() > 30) {
                        $('.site_header').css('height', navbar_height + 'px');
                        $('.site_header').addClass("fixed-top");
                    }
                    else {
                        $('.site_header').removeClass("fixed-top");
                        $('.site_header').css('height', 'auto');
                    }
                });
            }
        });
        // Close sticky header js
    };
    MainHeaderComponent.prototype.totalLaycredit = function () {
        var _this = this;
        this._isLayCredit = true;
        this.genericService.getAvailableLaycredit().subscribe(function (res) {
            _this.totalLayCredit = res.total_available_points;
        }, (function (error) {
            if (error.status == 406) {
                jwt_helper_1.redirectToLogin();
            }
        }));
    };
    MainHeaderComponent.prototype.openSignModal = function () {
        $('#sign_in_modal').modal('show');
        $("#signin-form").trigger("reset");
    };
    MainHeaderComponent.prototype.redirectToPayment = function () {
        this.cartItemsCount = JSON.parse(localStorage.getItem('$crt')) || 0;
        if (this.cartItemsCount > 0) {
            if (this.commonFunction.isRefferal()) {
                var parms = this.commonFunction.getRefferalParms();
                this.router.navigate(["cart/booking"], { queryParams: { utm_source: parms.utm_source, utm_medium: parms.utm_medium } });
            }
            else {
                this.router.navigate(["cart/booking"]);
            }
        }
        else {
            this.openEmptyCartPopup();
        }
    };
    MainHeaderComponent.prototype.openEmptyCartPopup = function () {
        this.modalService.open(empty_cart_component_1.EmptyCartComponent, {
            centered: true, backdrop: 'static',
            keyboard: false
        });
    };
    MainHeaderComponent.prototype.calculateInstalment = function (cartPrices) {
        var _this = this;
        var totalPrice = 0;
        var checkinDate;
        if (cartPrices && cartPrices.length > 0) {
            checkinDate = this.getCheckinDate(cartPrices[0].module_Info, cartPrices[0].type);
            for (var i = 0; i < cartPrices.length; i++) {
                totalPrice += this.getPrice(cartPrices[i].module_Info, cartPrices[i].type);
                if (i == 0) {
                    continue;
                }
                if (moment(checkinDate).isAfter(moment(this.getCheckinDate(cartPrices[i].module_Info, cartPrices[i].type)))) {
                    checkinDate = this.getCheckinDate(cartPrices[i].module_Info, cartPrices[i].type);
                }
            }
        }
        this.totalAmount = totalPrice;
        var instalmentRequest = {
            instalment_type: this.paymentInfo.instalmentType || "weekly",
            checkin_date: checkinDate,
            booking_date: moment().format("YYYY-MM-DD"),
            amount: totalPrice,
            additional_amount: 0,
            selected_down_payment: this.paymentInfo.selectedDownPayment || 0
        };
        this.genericService.getInstalemnts(instalmentRequest).subscribe(function (res) {
            if (res.instalment_available) {
                _this.installmentAmount = res.instalment_date[1].instalment_amount;
            }
            else {
                _this.installmentAmount = 0;
            }
        }, function (err) {
            _this.installmentAmount = 0;
        });
    };
    MainHeaderComponent.prototype.emptyCart = function () {
        var _this = this;
        $('#empty_modal').modal('hide');
        this.fullPageLoading = true;
        this.genericService.emptyCart().subscribe(function (res) {
            if (res) {
                _this.fullPageLoading = false;
                _this.cartItems = [];
                _this.cartItemsCount = 0;
                localStorage.setItem('$crt', _this.cartItemsCount);
                localStorage.removeItem('$cartOver');
                _this.cartService.setCartItems(_this.cartItems);
                _this.redirectToHome();
            }
        });
    };
    MainHeaderComponent.prototype.closeModal = function () {
        $('#empty_modal').modal('hide');
    };
    MainHeaderComponent.prototype.redirectToHome = function () {
        $('#empty_modal').modal('hide');
        if (this.commonFunction.isRefferal()) {
            var parms = this.commonFunction.getRefferalParms();
            var queryParams = {};
            queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
            if (queryParams.utm_medium) {
                queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
            }
            if (queryParams.utm_campaign) {
                queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
            }
            this.router.navigate(["/"], { queryParams: queryParams });
        }
        else {
            this.router.navigate(['/']);
        }
    };
    MainHeaderComponent.prototype.loginGuestUser = function () {
        var uuid = localStorage.getItem('__gst');
        this.userService.registerGuestUser({ guest_id: uuid }).subscribe(function (result) {
            localStorage.setItem("_lay_sess", result.accessToken);
        });
    };
    MainHeaderComponent.prototype.closeCartMaximum = function () {
        localStorage.removeItem('$cartOver');
    };
    MainHeaderComponent.prototype.imgError = function () {
        return this.userDetails.profilePic = '';
    };
    MainHeaderComponent.prototype.getCheckinDate = function (module_Info, type) {
        var checkinDate;
        //console.log(module_Info)
        if (type == 'flight') {
            checkinDate = moment(module_Info.departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
        }
        else if (type == 'hotel') {
            checkinDate = moment(module_Info.input_data.check_in, "YYYY-MM-DD'").format("YYYY-MM-DD");
        }
        return checkinDate;
    };
    MainHeaderComponent.prototype.getPrice = function (module_Info, type) {
        var price;
        if (type == 'flight') {
            price = module_Info.selling_price;
        }
        else if (type == 'hotel') {
            price = module_Info.selling.total;
        }
        return price;
    };
    MainHeaderComponent = __decorate([
        core_1.Component({
            selector: 'app-main-header',
            templateUrl: './main-header.component.html',
            styleUrls: ['./main-header.component.scss']
        })
    ], MainHeaderComponent);
    return MainHeaderComponent;
}());
exports.MainHeaderComponent = MainHeaderComponent;
