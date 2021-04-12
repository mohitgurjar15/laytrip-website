"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PagesComponent = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var jwt_helper_1 = require("../_helpers/jwt.helper");
var PagesComponent = /** @class */ (function () {
    function PagesComponent(router, genericService, cd) {
        var _this = this;
        this.router = router;
        this.genericService = genericService;
        this.cd = cd;
        this.router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationStart) {
                // Trigger when route change
                _this.checkUserValidate();
            }
        });
    }
    PagesComponent.prototype.ngOnInit = function () {
        this.checkUserValidate();
        document.getElementById('loader_full_page').style.display = 'block' ? 'none' : 'block';
        this.lottieConfig = {
            path: 'assets/lottie-json/flight/data.json',
            autoplay: true,
            loop: true
        };
    };
    PagesComponent.prototype.checkUserValidate = function () {
        var token = localStorage.getItem('_lay_sess');
        if (token) {
            this.genericService.checkUserValidate(token).subscribe(function (res) {
            }, function (err) {
                jwt_helper_1.redirectToLogin();
            });
        }
    };
    PagesComponent = __decorate([
        core_1.Component({
            selector: 'app-pages',
            templateUrl: './pages.component.html',
            styleUrls: ['./pages.component.scss']
        })
    ], PagesComponent);
    return PagesComponent;
}());
exports.PagesComponent = PagesComponent;
