"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BookComponent = void 0;
var core_1 = require("@angular/core");
// import { BookService } from 'src/app/services/book.service';
var BookComponent = /** @class */ (function () {
    function BookComponent(route, 
    // private bookService: BookService,
    router, cartService, commonFunction) {
        this.route = route;
        this.router = router;
        this.cartService = cartService;
        this.commonFunction = commonFunction;
    }
    BookComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.uuid = this.route.snapshot.paramMap.get('uuid');
        this.transaction_token = this.route.snapshot.queryParamMap.get('transaction_token');
        this.cartService.getCartItems.subscribe(function (data) {
            if (data.length > 0) {
                _this.carts = data;
            }
        });
        this.cartService.getCartPrice.subscribe(function (data) {
            _this.cartPrices = data;
        });
        this.bookFlight();
    };
    BookComponent.prototype.bookFlight = function () {
        var _this = this;
        var bookingData = {
            uuid: this.uuid,
            transaction_token: this.transaction_token
        };
        this.bookingRequest = JSON.parse(sessionStorage.getItem('__cbk'));
        this.bookingRequest.uuid = this.uuid;
        this.bookingRequest.transaction_token = this.transaction_token;
        if (this.commonFunction.isRefferal()) {
            var parms = this.commonFunction.getRefferalParms();
            this.bookingRequest.referral_id = parms.utm_source ? parms.utm_source : '';
        }
        // this.bookService.bookFlight(bookingData).subscribe((res: any) => {
        //   console.log(res);
        //   if (res.status == 'complete') {
        //     this.router.navigateByUrl('/book/confirmation',{ skipLocationChange: false })
        //   } else {
        //     this.router.navigateByUrl('/book/failure',{ skipLocationChange: false })
        //   }
        // });
        this.cartService.bookCart(this.bookingRequest).subscribe(function (result) {
            var successItem = result.carts.filter(function (cart) {
                if (cart.status == 1) {
                    return { cart_id: cart.id };
                }
            });
            var failedItem = result.carts.filter(function (cart) {
                if (cart.status == 2) {
                    return { car_id: cart.id };
                }
            });
            var index;
            var _loop_1 = function (item) {
                index = _this.carts.findIndex(function (x) { return x.id == item.cart_id; });
                _this.carts.splice(index, 1);
                _this.cartPrices.splice(index, 1);
            };
            for (var _i = 0, successItem_1 = successItem; _i < successItem_1.length; _i++) {
                var item = successItem_1[_i];
                _loop_1(item);
            }
            _this.cartService.setCartItems(_this.carts);
            _this.cartService.setCartPrices(_this.cartPrices);
            localStorage.setItem('$crt', failedItem.length || 0);
            if (_this.commonFunction.isRefferal()) {
                var parms = _this.commonFunction.getRefferalParms();
                var queryParams = {};
                queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
                if (parms.utm_medium) {
                    queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
                }
                if (parms.utm_campaign) {
                    queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
                }
                _this.router.navigate(["/cart/confirm/" + result.laytripCartId], { queryParams: queryParams });
            }
            else {
                _this.router.navigate(["/cart/confirm/" + result.laytripCartId]);
            }
        });
    };
    BookComponent = __decorate([
        core_1.Component({
            selector: 'app-book',
            templateUrl: './book.component.html',
            styleUrls: ['./book.component.scss']
        })
    ], BookComponent);
    return BookComponent;
}());
exports.BookComponent = BookComponent;
