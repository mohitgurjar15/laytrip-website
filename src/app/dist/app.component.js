"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var moment = require("moment");
var AppComponent = /** @class */ (function () {
    function AppComponent(cookieService, genericService) {
        this.cookieService = cookieService;
        this.genericService = genericService;
        this.title = 'laytrip-website';
        this.setUserOrigin();
        this.getUserLocationInfo();
    }
    AppComponent.prototype.setUserOrigin = function () {
        var host = window.location.origin;
        if (host.includes("dr.")) {
            localStorage.setItem('__uorigin', 'DR');
        }
        else {
            localStorage.removeItem('__uorigin');
        }
    };
    AppComponent.prototype.getUserLocationInfo = function () {
        var _this = this;
        try {
            var location = this.cookieService.get('__loc');
            if (typeof location == 'undefined') {
                this.genericService.getUserLocationInfo().subscribe(function (res) {
                    _this.cookieService.put('__loc', JSON.stringify(res), { expires: new Date(moment().add('7', "days").format()) });
                    _this.redirectToDRsite(res);
                }, function (error) {
                });
            }
            else {
                location = JSON.parse(location);
                this.redirectToDRsite(location);
            }
        }
        catch (e) {
        }
    };
    AppComponent.prototype.redirectToDRsite = function (location) {
        if (location.country.iso2 == 'PL') {
            if (window.location.origin == 'https://staging.laytrip.com' || window.location.origin == 'http://staging.laytrip.com' || window.location.origin == 'http://localhost:4200') {
                //window.location.href='https://www.google.com/'
            }
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;