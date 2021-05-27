"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CartComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var CartComponent = /** @class */ (function () {
    function CartComponent(cartService, cd, commonFunction, router) {
        this.cartService = cartService;
        this.cd = cd;
        this.commonFunction = commonFunction;
        this.router = router;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.selectedCart = 0;
        this.ismaxCartAdded = new core_1.EventEmitter();
        this.totalCarts = localStorage.getItem('$crt') ? localStorage.getItem('$crt') : 0;
    }
    CartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.cartService.getCartDeletedItem.subscribe(function (index) {
            if (index > 0) {
                _this.selectedCart = index - 1;
            }
        });
    };
    CartComponent.prototype.ngOnChanges = function (changes) {
        if (changes && changes['carts']) {
            this.carts = changes['carts'].currentValue;
            this.cd.detectChanges();
        }
    };
    CartComponent.prototype.selectCart = function (cartNumber) {
        this.selectedCart = cartNumber;
        this.cartService.setCartNumber(cartNumber);
    };
    CartComponent.prototype.saveAndSearch = function () {
        var totalCarts = localStorage.getItem('$crt');
        console.log(totalCarts);
        if (totalCarts == 10) {
            this.ismaxCartAdded.emit(true);
        }
        else {
            this.ismaxCartAdded.emit(false);
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
        return false;
        /*  this.validationErrorMessage = '';
         if (this.isValidTravelers) {
           this.loading = true;
           for (let i = 0; i < this.carts.length; i++) {
             let data = this.travelerForm.controls[`type${i}`].value.adults;
             let travelers = data.map(traveler => { return { traveler_id: traveler.userId } })
             let cartData = {
               cart_id: this.carts[i].id,
               travelers: travelers
             }
             this.cartService.updateCart(cartData).subscribe(data => {
               if (i === this.carts.length - 1) {
                 this.loading = false;
                 this.router.navigate(['/'])
               }
             });
           }
         }
         else {
           this.validateCartItems();
         } */
    };
    __decorate([
        core_1.Input()
    ], CartComponent.prototype, "carts");
    __decorate([
        core_1.Output()
    ], CartComponent.prototype, "ismaxCartAdded");
    CartComponent = __decorate([
        core_1.Component({
            selector: 'app-cart',
            templateUrl: './cart.component.html',
            styleUrls: ['./cart.component.scss']
        })
    ], CartComponent);
    return CartComponent;
}());
exports.CartComponent = CartComponent;
