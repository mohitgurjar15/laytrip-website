"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CartItemComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var CartItemComponent = /** @class */ (function () {
    function CartItemComponent(commonFunction, cd, cartService) {
        this.commonFunction = commonFunction;
        this.cd = cd;
        this.cartService = cartService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.priceFluctuationAmount = 0;
        this.cartAlerts = [];
        this.origin = '';
    }
    CartItemComponent.prototype.ngOnInit = function () {
        this.origin = window.location.pathname;
    };
    CartItemComponent.prototype.ngOnChanges = function (changes) {
        try {
            var cartAlerts = localStorage.getItem("__alrt");
            if (cartAlerts) {
                this.cartAlerts = JSON.parse(cartAlerts);
            }
            else {
                this.cartAlerts = [];
            }
        }
        catch (e) {
            this.cartAlerts = [];
        }
        if (changes && changes['cartItem']) {
            this.cartItem = changes['cartItem'].currentValue;
            if (this.cartItem.old_module_info.selling_price != this.cartItem.module_info.selling_price) {
                this.priceFluctuationAmount = this.cartItem.module_info.selling_price - this.cartItem.old_module_info.selling_price;
                /* let indexExist = this.cartAlerts.findIndex(x=>x.id==this.cartItem.id);
        
                if(indexExist==-1){
                  this.cartAlerts.push({
                    type : 'price_change',
                    name : `${this.cartItem.module_info.departure_code}-${this.cartItem.module_info.arrival_code}`,
                    id : this.cartItem.id
                  })
                  localStorage.setItem('__alrt',JSON.stringify(this.cartAlerts))
                } */
            }
            this.cd.detectChanges();
        }
    };
    CartItemComponent.prototype.closePricePopup = function (id) {
        try {
            var cartAlerts = localStorage.getItem("__alrt");
            if (cartAlerts) {
                this.cartAlerts = JSON.parse(cartAlerts);
                var index = this.cartAlerts.findIndex(function (x) { return x.id == id; });
                this.cartAlerts.splice(index, 1);
            }
            else {
                this.cartAlerts = [];
            }
        }
        catch (e) {
            this.cartAlerts = [];
        }
        localStorage.setItem('__alrt', JSON.stringify(this.cartAlerts));
        this.priceFluctuationAmount = 0;
    };
    CartItemComponent.prototype.deleteCart = function (id) {
        this.cartService.setCardId(id);
    };
    __decorate([
        core_1.Input()
    ], CartItemComponent.prototype, "cartItem");
    __decorate([
        core_1.Input()
    ], CartItemComponent.prototype, "travelers");
    __decorate([
        core_1.Input()
    ], CartItemComponent.prototype, "cartNumber");
    CartItemComponent = __decorate([
        core_1.Component({
            selector: 'app-cart-item',
            templateUrl: './cart-item.component.html',
            styleUrls: ['./cart-item.component.scss']
        })
    ], CartItemComponent);
    return CartItemComponent;
}());
exports.CartItemComponent = CartItemComponent;
