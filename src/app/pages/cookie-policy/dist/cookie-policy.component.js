"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CookiePolicyComponent = exports.MODAL_TYPE = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var moment = require("moment");
var MODAL_TYPE;
(function (MODAL_TYPE) {
    MODAL_TYPE[MODAL_TYPE["CLOSE"] = 0] = "CLOSE";
})(MODAL_TYPE = exports.MODAL_TYPE || (exports.MODAL_TYPE = {}));
var CookiePolicyComponent = /** @class */ (function () {
    function CookiePolicyComponent(activeModal, modalService, cookieService, router, commonFunction) {
        this.activeModal = activeModal;
        this.modalService = modalService;
        this.cookieService = cookieService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.cookieExpiredDate = new Date();
    }
    CookiePolicyComponent.prototype.ngOnInit = function () {
        this.cookieExpiredDate.setDate(this.cookieExpiredDate.getSeconds() + 5);
    };
    CookiePolicyComponent.prototype.close = function () {
        this.cookieService.put('__cke', JSON.stringify(true), { expires: new Date(moment().add(50, "years").format()) });
        this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
    };
    CookiePolicyComponent.prototype.acceptCookiePolicy = function () {
        this.cookieService.put('__cke', JSON.stringify(true), { expires: new Date(moment().add(50, "years").format()) });
        this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
    };
    CookiePolicyComponent.prototype.goToPrivacyPolicy = function () {
        this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
        if (this.commonFunction.isRefferal()) {
            var parms = this.commonFunction.getRefferalParms();
            var queryParams = {};
            queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
            if (parms.utm_medium) {
                queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
            }
            if (parms.utm_campaign) {
                queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
            }
            this.router.navigate(['/privacy-policy'], { queryParams: queryParams });
        }
        else {
            this.router.navigate(['/privacy-policy']);
        }
    };
    CookiePolicyComponent = __decorate([
        core_1.Component({
            selector: 'app-cookie-policy',
            templateUrl: './cookie-policy.component.html',
            styleUrls: ['./cookie-policy.component.scss']
        })
    ], CookiePolicyComponent);
    return CookiePolicyComponent;
}());
exports.CookiePolicyComponent = CookiePolicyComponent;
