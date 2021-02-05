"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PrivacyPolicyComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var PrivacyPolicyComponent = /** @class */ (function () {
    function PrivacyPolicyComponent(genericService, commonFunction) {
        this.genericService = genericService;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
    }
    PrivacyPolicyComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scroll(0, 0);
        $('body').addClass('cms-bgColor');
        var pageType = 'privacy-policy';
        this.loading = true;
        this.genericService.getCmsByPageType(pageType).subscribe(function (res) {
            _this.cmsData = res;
            _this.loading = false;
        });
    };
    PrivacyPolicyComponent = __decorate([
        core_1.Component({
            selector: 'app-privacy-policy',
            templateUrl: './privacy-policy.component.html',
            styleUrls: ['./privacy-policy.component.scss']
        })
    ], PrivacyPolicyComponent);
    return PrivacyPolicyComponent;
}());
exports.PrivacyPolicyComponent = PrivacyPolicyComponent;
