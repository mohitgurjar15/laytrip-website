"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RedeemLaycreditComponent = void 0;
var core_1 = require("@angular/core");
var RedeemLaycreditComponent = /** @class */ (function () {
    function RedeemLaycreditComponent(genericService) {
        this.genericService = genericService;
        this.applyLaycredit = new core_1.EventEmitter();
        this.totalLaycreditPoints = 0;
        this.value = 100;
        this.selectedLayCredit = 0;
        this.laycreditOptions = {
            floor: 0,
            ceil: 0,
            step: 0.1,
            disabled: true
        };
    }
    RedeemLaycreditComponent.prototype.ngOnInit = function () {
        this.totalLaycredit();
    };
    RedeemLaycreditComponent.prototype.totalLaycredit = function () {
        var _this = this;
        this.genericService.getAvailableLaycredit().subscribe(function (res) {
            _this.totalLaycreditPoints = res.total_available_points;
            //this.laycreditOptions.ceil=res.total_available_points;
        }, (function (error) {
        }));
    };
    RedeemLaycreditComponent.prototype.selectLaycredit = function (changeContext) {
        this.selectedLayCredit = changeContext.value;
        this.applyLaycredit.emit(this.selectedLayCredit);
    };
    RedeemLaycreditComponent.prototype.toggleLayCredit = function (event) {
        if (event.target.checked) {
            this.laycreditOptions = Object.assign({}, this.laycreditOptions, { disabled: false });
            this.applyLaycredit.emit(this.selectedLayCredit);
        }
        else {
            /* const newOptions: Options = Object.assign({}, this.laycreditOptions);
            newOptions.floor = 0;
            this.laycreditOptions = newOptions; */
            this.laycreditOptions = Object.assign({}, this.laycreditOptions, { disabled: true });
            this.applyLaycredit.emit(0);
        }
    };
    RedeemLaycreditComponent.prototype.ngOnChanges = function (changes) {
        if (changes['sellingPrice'].currentValue != 'undefined') {
            if (this.sellingPrice) {
                this.sellingPrice = changes['sellingPrice'].currentValue;
                this.laycreditOptions.ceil = Math.floor(this.sellingPrice);
                var laycreditOptions = Object.assign({}, this.laycreditOptions);
                if (this.totalLaycreditPoints > this.sellingPrice) {
                    laycreditOptions.ceil = this.sellingPrice;
                }
                else {
                    laycreditOptions.ceil = this.totalLaycreditPoints;
                }
                this.laycreditOptions = laycreditOptions;
            }
        }
    };
    __decorate([
        core_1.Output()
    ], RedeemLaycreditComponent.prototype, "applyLaycredit");
    __decorate([
        core_1.Input()
    ], RedeemLaycreditComponent.prototype, "sellingPrice");
    RedeemLaycreditComponent = __decorate([
        core_1.Component({
            selector: 'app-redeem-laycredit',
            templateUrl: './redeem-laycredit.component.html',
            styleUrls: ['./redeem-laycredit.component.scss']
        })
    ], RedeemLaycreditComponent);
    return RedeemLaycreditComponent;
}());
exports.RedeemLaycreditComponent = RedeemLaycreditComponent;
