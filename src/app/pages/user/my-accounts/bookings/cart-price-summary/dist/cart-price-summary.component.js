"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CartPriceSummaryComponent = void 0;
var core_1 = require("@angular/core");
var generic_helper_1 = require("../../../../../_helpers/generic.helper");
var CartPriceSummaryComponent = /** @class */ (function () {
    function CartPriceSummaryComponent(commonFunction) {
        this.commonFunction = commonFunction;
        this.cartItem = {};
        this.cartDueLoopNum = 0;
        this.installmentType = generic_helper_1.installmentType.en;
    }
    CartPriceSummaryComponent.prototype.ngOnInit = function () {
    };
    CartPriceSummaryComponent.prototype.ngOnChanges = function (changes) {
        if (typeof changes['cartItem'].currentValue != 'undefined') {
            this.cartItem = changes['cartItem'].currentValue;
            var loop = 0;
            this.cartItem.cartInstallments.forEach(function (element) {
                if (element.instalmentStatus == 0) {
                    loop += 1;
                    if (loop == 1) {
                        element.dueInstallment = 1;
                    }
                    else {
                        element.dueInstallment = 0;
                    }
                }
                else {
                    element.dueInstallment = 0;
                }
            });
        }
    };
    CartPriceSummaryComponent.prototype.setLoopNumber = function (loopNumber) {
        // console.log(loopNumber)
        this.cartDueLoopNum = loopNumber;
        return loopNumber;
    };
    __decorate([
        core_1.Input()
    ], CartPriceSummaryComponent.prototype, "cartItem");
    CartPriceSummaryComponent = __decorate([
        core_1.Component({
            selector: 'app-cart-price-summary',
            templateUrl: './cart-price-summary.component.html',
            styleUrls: ['./cart-price-summary.component.scss']
        })
    ], CartPriceSummaryComponent);
    return CartPriceSummaryComponent;
}());
exports.CartPriceSummaryComponent = CartPriceSummaryComponent;
