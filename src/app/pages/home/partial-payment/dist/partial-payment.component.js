"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PartialPaymentComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var PartialPaymentComponent = /** @class */ (function () {
    function PartialPaymentComponent(router) {
        this.router = router;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
    }
    PartialPaymentComponent.prototype.ngOnInit = function () {
    };
    PartialPaymentComponent.prototype.redirectToAboutPage = function () {
        this.router.navigate(['/about/']);
    };
    PartialPaymentComponent = __decorate([
        core_1.Component({
            selector: 'app-partial-payment',
            templateUrl: './partial-payment.component.html',
            styleUrls: ['./partial-payment.component.scss']
        })
    ], PartialPaymentComponent);
    return PartialPaymentComponent;
}());
exports.PartialPaymentComponent = PartialPaymentComponent;
