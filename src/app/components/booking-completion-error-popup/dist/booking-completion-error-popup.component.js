"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BookingCompletionErrorPopupComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var BookingCompletionErrorPopupComponent = /** @class */ (function () {
    function BookingCompletionErrorPopupComponent(activeModal, router, commonFunction) {
        this.activeModal = activeModal;
        this.router = router;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
    }
    BookingCompletionErrorPopupComponent.prototype.ngOnInit = function () {
    };
    BookingCompletionErrorPopupComponent.prototype.returnToCart = function () {
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
            this.router.navigate(['/cart/checkout'], { queryParams: queryParams });
        }
        else {
            this.router.navigate(['/cart/checkout']);
        }
    };
    BookingCompletionErrorPopupComponent.prototype.close = function () {
        this.activeModal.close();
        //this.router.navigate(['/cart/booking']);
    };
    BookingCompletionErrorPopupComponent = __decorate([
        core_1.Component({
            selector: 'app-booking-completion-error-popup',
            templateUrl: './booking-completion-error-popup.component.html',
            styleUrls: ['./booking-completion-error-popup.component.scss']
        })
    ], BookingCompletionErrorPopupComponent);
    return BookingCompletionErrorPopupComponent;
}());
exports.BookingCompletionErrorPopupComponent = BookingCompletionErrorPopupComponent;
