"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CmsPagesComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var CmsPagesComponent = /** @class */ (function () {
    function CmsPagesComponent(route, genericService) {
        this.route = route;
        this.genericService = genericService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
    }
    CmsPagesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.queryParams.forEach(function (params) {
            if (params && params.preview) {
                _this.pageType = params.preview;
                _this.preview();
            }
            else {
            }
        });
    };
    CmsPagesComponent.prototype.preview = function () {
        var _this = this;
        this.loading = true;
        this.genericService.getCmsByPageType(this.pageType).subscribe(function (res) {
            _this.cmsData = res;
            _this.loading = false;
        }, function (err) {
            _this.loading = false;
            // this.isPaymentCalulcatorLoading=false;
        });
    };
    CmsPagesComponent = __decorate([
        core_1.Component({
            selector: 'app-cms-pages',
            templateUrl: './cms-pages.component.html',
            styleUrls: ['./cms-pages.component.scss']
        })
    ], CmsPagesComponent);
    return CmsPagesComponent;
}());
exports.CmsPagesComponent = CmsPagesComponent;
