"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MainFooterComponent = void 0;
var core_1 = require("@angular/core");
var share_social_media_component_1 = require("../../components/share-social-media/share-social-media.component");
var environment_1 = require("../../../environments/environment");
var MainFooterComponent = /** @class */ (function () {
    function MainFooterComponent(modalService, translate, commonFunction, renderer, genericService) {
        this.modalService = modalService;
        this.translate = translate;
        this.commonFunction = commonFunction;
        this.renderer = renderer;
        this.genericService = genericService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.langunages = [];
        this.selectedLanunage = { id: 0, name: '', iso_1Code: '', iso_2Code: '', active: false };
        this.isLanunageSet = false;
        this.currencies = [];
        this.isCurrencySet = false;
        this.countryCode = '';
        this.selectedCurrency = { id: 0, country: '', code: '', symbol: '', status: false, flag: '' };
        this.countryCode = this.commonFunction.getUserCountry();
        var _langunage = localStorage.getItem('_lang');
        var _currency = localStorage.getItem('_curr');
        if (_langunage) {
            try {
                var _lang = JSON.parse(_langunage);
                this.selectedLanunage = _lang;
                translate.setDefaultLang(this.selectedLanunage.iso_1Code);
                this.isLanunageSet = true;
                this.renderer.addClass(document.body, this.selectedLanunage.iso_1Code + "_lang");
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
        this.countryCode = this.commonFunction.getUserCountry();
    }
    MainFooterComponent.prototype.ngOnInit = function () {
        this.getLangunages();
        this.getCurrencies();
        this.loadJquery();
    };
    MainFooterComponent.prototype.loadJquery = function () {
        // Start Back to Top Js
        $(window).scroll(function () {
            var height = $(window).scrollTop();
            if (height > 100) {
                $('#back_to_top').css("display", "flex").fadeIn(10000);
            }
            else {
                $('#back_to_top').css("display", "none").fadeOut(0);
            }
        });
        $(document).ready(function () {
            $("#back_to_top").click(function (event) {
                event.preventDefault();
                $("html, body").animate({
                    scrollTop: 0
                }, "slow");
                return false;
            });
        });
        // Close Back to Top Js
    };
    /**
    * change user lanunage
    * @param langunage
    */
    MainFooterComponent.prototype.changeLangunage = function (langunage) {
        if (JSON.stringify(langunage) != JSON.stringify(this.selectedLanunage)) {
            this.selectedLanunage = langunage;
            localStorage.setItem("_lang", JSON.stringify(langunage));
            this.renderer.removeClass(document.body, "en_lang");
            this.renderer.removeClass(document.body, "es_lang");
            this.renderer.removeClass(document.body, "it_lang");
            this.translate.use(langunage.iso_1Code);
            this.renderer.addClass(document.body, this.selectedLanunage.iso_1Code + "_lang");
        }
    };
    /**
     * Get all langunages
     */
    MainFooterComponent.prototype.getLangunages = function () {
        var _this = this;
        this.genericService.getAllLangunage().subscribe(function (response) {
            _this.langunages = response.data.filter(function (lang) { return lang.active == true; });
            if (!_this.isLanunageSet) {
                _this.isLanunageSet = true;
                _this.selectedLanunage = _this.langunages[0];
                localStorage.setItem("_lang", JSON.stringify(_this.langunages[0]));
            }
            else {
                var find = _this.langunages.find(function (langunage) { return langunage.id == _this.selectedLanunage.id; });
                if (!find) {
                    _this.isLanunageSet = true;
                    _this.selectedLanunage = _this.langunages[0];
                    localStorage.setItem("_lang", JSON.stringify(_this.langunages[0]));
                }
            }
        }, function (error) {
        });
    };
    /**
    * Get all currencies
    */
    MainFooterComponent.prototype.getCurrencies = function () {
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
            else {
                var find = _this.currencies.find(function (currency) { return currency.id == _this.selectedCurrency.id; });
                if (!find) {
                    _this.isCurrencySet = true;
                    _this.selectedCurrency = _this.currencies[0];
                    localStorage.setItem("_curr", JSON.stringify(_this.currencies[0]));
                }
            }
        }, function (error) {
        });
    };
    MainFooterComponent.prototype.changeCurrency = function (currency) {
        if (JSON.stringify(currency) != JSON.stringify(this.selectedCurrency)) {
            this.selectedCurrency = currency;
            localStorage.setItem("_curr", JSON.stringify(currency));
        }
    };
    MainFooterComponent.prototype.openShareModal = function () {
        this.modalService.open(share_social_media_component_1.ShareSocialMediaComponent, { windowClass: 'share_modal', centered: true, backdrop: 'static', keyboard: false });
    };
    MainFooterComponent = __decorate([
        core_1.Component({
            selector: 'app-main-footer',
            templateUrl: './main-footer.component.html',
            styleUrls: ['./main-footer.component.scss']
        })
    ], MainFooterComponent);
    return MainFooterComponent;
}());
exports.MainFooterComponent = MainFooterComponent;
