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
var MainHeaderComponent = /** @class */ (function () {
    function MainHeaderComponent(genericService, translate, modalService, router, commonFunction, cd, cartService) {
        this.genericService = genericService;
        this.translate = translate;
        this.modalService = modalService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.cd = cd;
        this.cartService = cartService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
        this.isLoggedIn = false;
        this.totalLayCredit = 0;
        this.showTotalLayCredit = 0;
        this._isLayCredit = false;
        this.isCovidPage = true;
        this.fullPageLoading = false;
    }
    MainHeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.checkUser();
        this.loadJquery();
        //this.getUserLocationInfo();
        if (this.isLoggedIn) {
            if (this.userDetails.roleId != 7) {
                this.totalLaycredit();
                this.getCartList();
            }
        }
        this.cartService.getCartItems.subscribe(function (data) {
            if (data.length > 0) {
                _this.updateCartSummary();
            }
        });
        this.countryCode = this.commonFunction.getUserCountry();
    };
    MainHeaderComponent.prototype.getCartList = function () {
        var _this = this;
        if (this.isLoggedIn) {
            // GET CART LIST FROM GENERIC SERVICE
            var live_availiblity = 'no';
            var url = window.location.href;
            if (url.includes('cart/booking')) {
                live_availiblity = 'yes';
            }
            this.cartService.getCartList(live_availiblity).subscribe(function (res) {
                if (res) {
                    // SET CART ITEMS IN CART SERVICE
                    var cartItems = res.data.map(function (item) { return { id: item.id, module_Info: item.moduleInfo[0] }; });
                    _this.cartService.setCartItems(cartItems);
                    if (cartItems) {
                        _this.cartItemsCount = res.count;
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
        }
    };
    MainHeaderComponent.prototype.updateCartSummary = function () {
        var _this = this;
        if (this.isLoggedIn) {
            var live_availiblity = 'no';
            var url = window.location.href;
            if (url.includes('cart/booking')) {
                live_availiblity = 'yes';
            }
            this.cartService.getCartList(live_availiblity).subscribe(function (res) {
                if (res) {
                    // SET CART ITEMS IN CART SERVICE
                    var cartItems = res.data.map(function (item) { return { id: item.id, module_Info: item.moduleInfo[0] }; });
                    _this.calculateInstalment(cartItems);
                    _this.cd.detectChanges();
                }
            }, function (error) {
                if (error && error.status === 404) {
                }
            });
        }
    };
    MainHeaderComponent.prototype.ngDoCheck = function () {
        var _this = this;
        this.checkUser();
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
    MainHeaderComponent.prototype.ngOnChanges = function () {
        // this.totalLaycredit();
    };
    MainHeaderComponent.prototype.checkUser = function () {
        var userToken = localStorage.getItem('_lay_sess');
        this.isLoggedIn = false;
        if (userToken && userToken != 'undefined' && userToken != 'null') {
            localStorage.removeItem("_isSubscribeNow");
            this.isLoggedIn = true;
            this.userDetails = jwt_helper_1.getLoginUserInfo();
            var name = this.userDetails.email.substring(0, this.userDetails.email.lastIndexOf("@"));
            var domain = this.userDetails.email.substring(this.userDetails.email.lastIndexOf("@") + 1);
            this.username = this.userDetails.firstName ? this.userDetails.firstName : name;
            if (this.userDetails.roleId != 7 && !this._isLayCredit) {
                this.totalLaycredit();
                this.getCartList();
            }
            this.showTotalLayCredit = this.totalLayCredit;
        }
    };
    MainHeaderComponent.prototype.onLoggedout = function () {
        this.isLoggedIn = this._isLayCredit = false;
        this.showTotalLayCredit = 0;
        localStorage.removeItem('_lay_sess');
        localStorage.removeItem('$crt');
        this.cartItemsCount = '';
        this.router.navigate(['/']);
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
        /* if (this.isLoggedIn && this.cartItemsCount > 0) {
        } */
        this.router.navigate(["cart/booking"]);
    };
    MainHeaderComponent.prototype.calculateInstalment = function (cartPrices) {
        var _this = this;
        var totalPrice = 0;
        var checkinDate;
        //console.log('cartprices:::::', cartPrices);
        if (cartPrices && cartPrices.length > 0) {
            checkinDate = moment(cartPrices[0].module_Info.departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
            for (var i = 0; i < cartPrices.length; i++) {
                totalPrice += cartPrices[i].module_Info.selling_price;
                if (i == 0) {
                    continue;
                }
                if (moment(checkinDate).isAfter(moment(cartPrices[i].module_Info.departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD"))) {
                    checkinDate = moment(cartPrices[i].module_Info.departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
                }
            }
        }
        this.totalAmount = totalPrice;
        var instalmentRequest = {
            instalment_type: "weekly",
            checkin_date: checkinDate,
            booking_date: moment().format("YYYY-MM-DD"),
            amount: totalPrice,
            additional_amount: 0,
            selected_down_payment: 0
        };
        this.genericService.getInstalemnts(instalmentRequest).subscribe(function (res) {
            if (res.instalment_available) {
                _this.weeklyInstallmentAmount = res.instalment_date[1].instalment_amount;
            }
            else {
                _this.weeklyInstallmentAmount = 0;
            }
        }, function (err) {
            _this.weeklyInstallmentAmount = 0;
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
        this.router.navigate(['/']);
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
