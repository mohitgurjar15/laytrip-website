"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CheckoutProgressComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var CheckoutProgressComponent = /** @class */ (function () {
    function CheckoutProgressComponent(cartService, commonFunction) {
        this.cartService = cartService;
        this.commonFunction = commonFunction;
        this.progressArray = [];
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
    }
    CheckoutProgressComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        core_1.Input()
    ], CheckoutProgressComponent.prototype, "progressStep");
    CheckoutProgressComponent = __decorate([
        core_1.Component({
            selector: 'app-checkout-progress',
            templateUrl: './checkout-progress.component.html',
            styleUrls: ['./checkout-progress.component.scss']
        })
    ], CheckoutProgressComponent);
    return CheckoutProgressComponent;
}());
exports.CheckoutProgressComponent = CheckoutProgressComponent;
