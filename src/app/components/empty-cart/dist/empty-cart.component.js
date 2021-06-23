"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EmptyCartComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var EmptyCartComponent = /** @class */ (function () {
    function EmptyCartComponent(renderer, router, activeModal, commonFunction) {
        this.renderer = renderer;
        this.router = router;
        this.activeModal = activeModal;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
    }
    EmptyCartComponent.prototype.ngOnInit = function () {
        $('#cart_modal').modal('show');
        this.renderer.addClass(document.body, 'cms-bgColor');
    };
    EmptyCartComponent.prototype.ngOnDestroy = function () {
        this.renderer.removeClass(document.body, 'cms-bgColor');
    };
    EmptyCartComponent.prototype.redirectToHome = function () {
        $('#cart_modal').modal('hide');
        this.activeModal.close();
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
            this.router.navigate(['/'], { queryParams: queryParams });
        }
        else {
            this.router.navigate(['/']);
        }
    };
    EmptyCartComponent.prototype.close = function () {
        $('#cart_modal').modal('hide');
        this.activeModal.close();
        var url = window.location.href;
        if (url.includes('cart/checkout')) {
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
                this.router.navigate(['/'], { queryParams: queryParams });
            }
            else {
                this.router.navigate(['/']);
            }
        }
    };
    EmptyCartComponent = __decorate([
        core_1.Component({
            selector: 'app-empty-cart',
            templateUrl: './empty-cart.component.html',
            styleUrls: ['./empty-cart.component.scss']
        })
    ], EmptyCartComponent);
    return EmptyCartComponent;
}());
exports.EmptyCartComponent = EmptyCartComponent;
