"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TermsComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var TermsComponent = /** @class */ (function () {
    function TermsComponent(genericService, commonFunction) {
        this.genericService = genericService;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
    }
    TermsComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('body').addClass('cms-bgColor');
        window.scroll(0, 0);
        var pageType = 'terms';
        this.loading = true;
        this.genericService.getCmsByPageType(pageType).subscribe(function (res) {
            _this.cmsData = res;
            var concatUrl = '';
            if (_this.commonFunction.isRefferal()) {
                var parms = _this.commonFunction.getRefferalParms();
                concatUrl = parms.utm_source ? '?utm_source=' + parms.utm_source : '';
                if (parms.utm_medium) {
                    concatUrl += parms.utm_medium ? '&utm_medium=' + parms.utm_medium : '';
                }
                if (parms.utm_campaign) {
                    concatUrl += parms.utm_campaign ? '&utm_campaign=' + parms.utm_campaign : '';
                }
            }
            _this.cmsData.enContent = res.enContent.replace('laytrip.com/', 'laytrip.com/' + concatUrl);
            _this.cmsData.enContent = res.enContent.replace('/privacy-policy', '/privacy-policy' + concatUrl);
            _this.loading = false;
        });
    };
    TermsComponent = __decorate([
        core_1.Component({
            selector: 'app-terms',
            templateUrl: './terms.component.html',
            styleUrls: ['./terms.component.scss']
        })
    ], TermsComponent);
    return TermsComponent;
}());
exports.TermsComponent = TermsComponent;
