"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HotelCartItemComponent = void 0;
var core_1 = require("@angular/core");
//import { MODAL_TYPE } from '../../../../components/confirmation-modal/confirmation-modal.component';
var delete_cartitem_confirmation_popup_component_1 = require("../../../../components/delete-cartitem-confirmation-popup/delete-cartitem-confirmation-popup.component");
var environment_1 = require("../../../../../environments/environment");
var HotelCartItemComponent = /** @class */ (function () {
    function HotelCartItemComponent(commonFunction, genericService, cartService, cd, router, spinner, modalService) {
        this.commonFunction = commonFunction;
        this.genericService = genericService;
        this.cartService = cartService;
        this.cd = cd;
        this.router = router;
        this.spinner = spinner;
        this.modalService = modalService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
    }
    HotelCartItemComponent.prototype.ngOnInit = function () {
        this.getCartList();
    };
    HotelCartItemComponent.prototype.getCartList = function () {
        var _this = this;
        this.cartService.getCartItems.subscribe(function (cartItems) {
            _this.cartItems = cartItems;
        });
    };
    HotelCartItemComponent.prototype.openDeleteConfirmationPopup = function (cartId) {
        var _this = this;
        this.modalRef = this.modalService.open(delete_cartitem_confirmation_popup_component_1.DeleteCartitemConfirmationPopupComponent, {
            windowClass: 'delete_cart_item_block', centered: true, backdrop: 'static',
            keyboard: false
        }).result.then(function (result) {
            if (result.STATUS === delete_cartitem_confirmation_popup_component_1.MODAL_TYPE.DELETE) {
                _this.deleteCart(cartId);
            }
        });
    };
    HotelCartItemComponent.prototype.deleteCart = function (id) {
        this.cartService.setCardId(id);
    };
    __decorate([
        core_1.Input()
    ], HotelCartItemComponent.prototype, "cartItem");
    __decorate([
        core_1.Input()
    ], HotelCartItemComponent.prototype, "travelers");
    __decorate([
        core_1.Input()
    ], HotelCartItemComponent.prototype, "cartNumber");
    HotelCartItemComponent = __decorate([
        core_1.Component({
            selector: 'app-hotel-cart-item',
            templateUrl: './hotel-cart-item.component.html',
            styleUrls: ['./hotel-cart-item.component.scss']
        })
    ], HotelCartItemComponent);
    return HotelCartItemComponent;
}());
exports.HotelCartItemComponent = HotelCartItemComponent;
