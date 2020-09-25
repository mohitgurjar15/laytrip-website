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
    function MainHeaderComponent(genericService, translate, modalService, router) {
        this.genericService = genericService;
        this.translate = translate;
        this.modalService = modalService;
        this.router = router;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.langunages = [];
        this.selectedLanunage = { id: 0, name: '', iso_1Code: '', iso_2Code: '', active: false };
        this.isLanunageSet = false;
        this.defaultImage = this.s3BucketUrl + 'assets/images/profile_im.svg';
        this.currencies = [];
        this.selectedCurrency = { id: 0, country: '', code: '', symbol: '', status: false, flag: '' };
        this.isCurrencySet = false;
        this.isLoggedIn = false;
        var _langunage = localStorage.getItem('_lang');
        var _currency = localStorage.getItem('_curr');
        if (_langunage) {
            try {
                var _lang = JSON.parse(_langunage);
                this.selectedLanunage = _lang;
                translate.setDefaultLang(this.selectedLanunage.iso_1Code);
                this.isLanunageSet = true;
            }
            catch (error) {
                this.isLanunageSet = false;
                translate.setDefaultLang('en');
            }
        }
        else {
            translate.setDefaultLang('en');
        }
        if (_currency) {
            try {
                var _curr = JSON.parse(_currency);
                this.selectedCurrency = _curr;
                this.isCurrencySet = true;
            }
            catch (error) {
                this.isCurrencySet = false;
            }
        }
    }
    MainHeaderComponent.prototype.ngOnInit = function () {
        this.checkUser();
        this.getLangunages();
        this.getCurrencies();
        this.loadJquery();
        this.userDetails = jwt_helper_1.getLoginUserInfo();
        if (Object.keys(this.userDetails).length > 0) {
            if (this.userDetails.roleId != 7) {
                this.totalLaycredit();
            }
        }
    };
    MainHeaderComponent.prototype.ngDoCheck = function () {
        this.checkUser();
        //this.totalLaycredit();
    };
    MainHeaderComponent.prototype.ngOnChanges = function () {
        //this.totalLaycredit();
    };
    /**
     * change user lanunage
     * @param langunage
     */
    MainHeaderComponent.prototype.changeLangunage = function (langunage) {
        if (JSON.stringify(langunage) != JSON.stringify(this.selectedLanunage)) {
            this.selectedLanunage = langunage;
            localStorage.setItem("_lang", JSON.stringify(langunage));
            this.translate.use(langunage.iso_1Code);
        }
    };
    /**
     * Get all langunages
     */
    MainHeaderComponent.prototype.getLangunages = function () {
        var _this = this;
        this.genericService.getAllLangunage().subscribe(function (response) {
            _this.langunages = response.data.filter(function (lang) { return lang.active == true; });
            if (!_this.isLanunageSet) {
                _this.isLanunageSet = true;
                _this.selectedLanunage = _this.langunages[0];
                localStorage.setItem("_lang", JSON.stringify(_this.langunages[0]));
            }
        }, function (error) {
        });
    };
    /**
     * Get all currencies
     */
    MainHeaderComponent.prototype.getCurrencies = function () {
        var _this = this;
        this.genericService.getCurrencies().subscribe(function (response) {
            _this.currencies = response.data.filter(function (currency) { return currency.status == true; });
            for (var i = 0; i < _this.currencies.length; i++) {
                _this.currencies[i].flag = _this.s3BucketUrl + "assets/images/icon/" + _this.currencies[i].code + ".svg";
            }
            if (!_this.isCurrencySet) {
                _this.isCurrencySet = true;
                _this.selectedCurrency = _this.currencies[0];
                localStorage.setItem("_curr", JSON.stringify(_this.currencies[0]));
            }
        }, function (error) {
        });
    };
    MainHeaderComponent.prototype.changeCurrency = function (currency) {
        if (JSON.stringify(currency) != JSON.stringify(this.selectedCurrency)) {
            this.selectedCurrency = currency;
            localStorage.setItem("_curr", JSON.stringify(currency));
        }
    };
    MainHeaderComponent.prototype.checkUser = function () {
        var userToken = localStorage.getItem('_lay_sess');
        this.isLoggedIn = false;
        if (userToken && userToken != 'undefined' && userToken != 'null') {
            this.isLoggedIn = true;
        }
    };
    MainHeaderComponent.prototype.onLoggedout = function () {
        this.isLoggedIn = false;
        localStorage.removeItem('_lay_sess');
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
        this.genericService.getAvailableLaycredit().subscribe(function (res) {
            console.log("res", res);
            _this.totalLayCredit = res.total_available_points;
        }, (function (error) {
        }));
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
