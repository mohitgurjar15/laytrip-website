"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AboutUsComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var AboutUsComponent = /** @class */ (function () {
    function AboutUsComponent(genericService) {
        this.genericService = genericService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
    }
    AboutUsComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scroll(0, 0);
        var pageType = 'about';
        this.loading = true;
        this.genericService.getCmsByPageType(pageType).subscribe(function (res) {
            console.log(_this.cmsData);
            _this.cmsData = res;
            _this.loading = false;
        });
    };
    AboutUsComponent = __decorate([
        core_1.Component({
            selector: 'app-about-us',
            templateUrl: './about-us.component.html',
            styleUrls: ['./about-us.component.scss']
        })
    ], AboutUsComponent);
    return AboutUsComponent;
}());
exports.AboutUsComponent = AboutUsComponent;
