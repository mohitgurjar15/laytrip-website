"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightsComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../../environments/environment");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var FlightsComponent = /** @class */ (function () {
    function FlightsComponent(commonFunction, modalService, accountService) {
        this.commonFunction = commonFunction;
        this.modalService = modalService;
        this.accountService = accountService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.cartItem = {};
        this.laytrip_cart_id = '';
        this.closeResult = '';
        this.bookingId = '';
        this.laytripCartId = new core_1.EventEmitter();
        this.upCommingloadingValue = new core_1.EventEmitter();
    }
    FlightsComponent.prototype.ngOnInit = function () {
    };
    FlightsComponent.prototype.ngOnChanges = function (changes) {
        if (typeof changes['cartItem'].currentValue != 'undefined') {
            this.cartItem = changes['cartItem'].currentValue;
            // console.log(this.cartItem)
            this.laytrip_cart_id = changes['laytrip_cart_id'].currentValue;
        }
    };
    FlightsComponent.prototype.convertHHMM = function (time) {
        time = time.replace(' AM', '');
        time = time.replace(' PM', '');
        return time; // 5:04 PM
    };
    FlightsComponent.prototype.open = function (content, bookingId) {
        var _this = this;
        this.bookingId = bookingId;
        this.modalService.open(content, {
            windowClass: 'delete_account_window', centered: true, backdrop: 'static',
            keyboard: false
        }).result.then(function (result) {
            _this.closeResult = "Closed with: " + result;
        }, function (reason) {
            _this.closeResult = "Dismissed " + _this.getDismissReason(reason);
        });
    };
    FlightsComponent.prototype.getDismissReason = function (reason) {
        if (reason === ng_bootstrap_1.ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        }
        else if (reason === ng_bootstrap_1.ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        }
        else {
            return "with: " + reason;
        }
    };
    FlightsComponent.prototype.cancelBooking = function () {
        var _this = this;
        // this.upCommingloadingValue.emit(true);
        this.accountService.cancelBooking(this.bookingId).subscribe(function (data) {
            _this.laytripCartId.emit(_this.bookingId);
            // this.upCommingloadingValue.emit(false);
            _this.modalService.dismissAll();
        }, function (error) {
            // this.upCommingloadingValue.emit(false);
            _this.modalService.dismissAll();
        });
    };
    __decorate([
        core_1.Input()
    ], FlightsComponent.prototype, "cartItem");
    __decorate([
        core_1.Input()
    ], FlightsComponent.prototype, "laytrip_cart_id");
    __decorate([
        core_1.Output()
    ], FlightsComponent.prototype, "laytripCartId");
    __decorate([
        core_1.Output()
    ], FlightsComponent.prototype, "upCommingloadingValue");
    FlightsComponent = __decorate([
        core_1.Component({
            selector: 'app-flights',
            templateUrl: './flights.component.html',
            styleUrls: ['./flights.component.scss']
        })
    ], FlightsComponent);
    return FlightsComponent;
}());
exports.FlightsComponent = FlightsComponent;
