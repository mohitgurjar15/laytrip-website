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
var MainHeaderComponent = /** @class */ (function () {
    function MainHeaderComponent(genericService, translate, modalService, router) {
        this.genericService = genericService;
        this.translate = translate;
        this.modalService = modalService;
        this.router = router;
        this.langunages = [];
        this.selectedLanunage = { id: 0, name: '', iso_1Code: '', iso_2Code: '', active: false };
        this.isLanunageSet = false;
        this.currencies = [];
        this.selectedCurrency = { id: 0, country: '', code: '', symbol: '', status: false, flag: '' };
        this.isCurrencySet = false;
        this.isLoggedIn = false;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
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
        this.getLangunages();
        this.getCurrencies();
        this.checkUser();
    };
    MainHeaderComponent.prototype.ngDoCheck = function () {
        this.checkUser();
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
        this.router.url;
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
