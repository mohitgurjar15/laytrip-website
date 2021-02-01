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
var MainHeaderComponent = /** @class */ (function () {
    function MainHeaderComponent(genericService, translate, modalService, router, commonFunction, renderer, cd, cartService) {
        this.genericService = genericService;
        this.translate = translate;
        this.modalService = modalService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.renderer = renderer;
        this.cd = cd;
        this.cartService = cartService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
        this.isLoggedIn = false;
        this.totalLayCredit = 0;
        this.showTotalLayCredit = 0;
        this._isLayCredit = false;
        this.isCovidPage = true;
    }
    MainHeaderComponent.prototype.ngOnInit = function () {
        this.checkUser();
        this.loadJquery();
        //this.getUserLocationInfo();
        if (this.isLoggedIn) {
            if (this.userDetails.roleId != 7) {
                this.totalLaycredit();
                this.getCartList();
            }
        }
        this.countryCode = this.commonFunction.getUserCountry();
    };
    MainHeaderComponent.prototype.getCartList = function () {
        var _this = this;
        if (this.isLoggedIn) {
            // GET CART LIST FROM GENERIC SERVICE
            this.cartService.getCartList().subscribe(function (res) {
                if (res) {
                    // SET CART ITEMS IN CART SERVICE
                    _this.cartService.setCartItems(res.data);
                    _this.cartItems = res.data;
                    if (res.count) {
                        _this.cartItemsCount = res.count;
                        localStorage.setItem('$crt', _this.cartItemsCount);
                    }
                    _this.cd.detectChanges();
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
    MainHeaderComponent.prototype.ngDoCheck = function () {
        var _this = this;
        this.checkUser();
        var host = window.location.href;
        this.isCovidPage = true;
        if (host.includes("covid-19")) {
            this.isCovidPage = false;
            this.cd.detectChanges();
        }
        this.cartService.getCartItems.subscribe(function (res) {
            try {
                _this.cartItemsCount = JSON.parse(localStorage.getItem('$crt'));
            }
            catch (e) {
            }
        });
        // this.userDetails = getLoginUserInfo();
        // this.totalLaycredit();
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
        // const modalRef = this.modalService.open(AuthComponent);
        $('#sign_in_modal').modal('show');
        $("#signin-form").trigger("reset");
    };
    MainHeaderComponent.prototype.redirectToPayment = function () {
        /* if (this.isLoggedIn && this.cartItemsCount > 0) {
        } */
        this.router.navigate(["flight/payment/ZVZ4WEFNOW8ybVIwT0VX"]);
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
