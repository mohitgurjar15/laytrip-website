"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HotelsComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../../environments/environment");
var HotelsComponent = /** @class */ (function () {
    function HotelsComponent(commonFunction, modalService) {
        this.commonFunction = commonFunction;
        this.modalService = modalService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.cartItem = {};
        this.laytrip_cart_id = '';
        this.closeResult = '';
        this.bookingId = '';
        this.laytripCartId = new core_1.EventEmitter();
        this.upCommingloadingValue = new core_1.EventEmitter();
    }
    HotelsComponent.prototype.ngOnInit = function () { };
    HotelsComponent.prototype.ngOnChanges = function (changes) {
        if (typeof changes['cartItem'].currentValue != 'undefined') {
            this.cartItem = changes['cartItem'].currentValue;
            this.laytrip_cart_id = changes['laytrip_cart_id'].currentValue;
        }
    };
    HotelsComponent.prototype.convertHHMM = function (time) {
        time = time.replace(' AM', '');
        time = time.replace(' PM', '');
        return time; // 5:04 PM
    };
    HotelsComponent.prototype.cancelCartIdRemove = function (event) {
        // console.log(event)
        this.laytripCartId.emit(event);
    };
    __decorate([
        core_1.Input()
    ], HotelsComponent.prototype, "cartItem");
    __decorate([
        core_1.Input()
    ], HotelsComponent.prototype, "laytrip_cart_id");
    __decorate([
        core_1.Output()
    ], HotelsComponent.prototype, "laytripCartId");
    __decorate([
        core_1.Output()
    ], HotelsComponent.prototype, "upCommingloadingValue");
    HotelsComponent = __decorate([
        core_1.Component({
            selector: 'app-hotels',
            templateUrl: './hotels.component.html',
            styleUrls: ['./hotels.component.scss']
        })
    ], HotelsComponent);
    return HotelsComponent;
}());
exports.HotelsComponent = HotelsComponent;
