"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PaymentModeComponent = void 0;
var core_1 = require("@angular/core");
var moment = require("moment");
var PaymentModeComponent = /** @class */ (function () {
    function PaymentModeComponent(genericService) {
        this.genericService = genericService;
        this.applyLaycredit = new core_1.EventEmitter();
        this.selectInstalmentMode = new core_1.EventEmitter();
        this.isInstalemtMode = false;
        this.value = 100;
        this.laycreditOptions = {
            floor: 0,
            ceil: 600
        };
        this.instalmentRequest = {
            instalment_type: "weekly",
            checkin_date: "2020-10-25",
            booking_date: moment().format("YYYY-MM-DD"),
            amount: 150,
            additional_amount: null,
            custom_instalment_no: null,
            custom_amount: null
        };
        this.additionalAmount = 0;
    }
    PaymentModeComponent.prototype.ngOnInit = function () {
        this.getInstalemnts('weekly');
    };
    /**
     *
     * @param type [weekly,biweekly,monthly]
     */
    PaymentModeComponent.prototype.getInstalemnts = function (type) {
        var _this = this;
        this.instalmentRequest.instalment_type = type;
        this.genericService.getInstalemnts(this.instalmentRequest).subscribe(function (res) {
            _this.instalments = res;
            if (_this.instalments.instalment_available == true) {
                _this.remainingAmount = _this.instalmentRequest.amount - parseFloat(_this.instalments.instalment_date[0].instalment_amount);
                _this.firstInstalment = _this.instalments.instalment_date[0].instalment_amount;
                _this.defaultInstalment = _this.instalments.instalment_date[0].instalment_amount;
                _this.customAmount = _this.instalments.instalment_date[0].instalment_amount;
                _this.customInstalment = _this.instalments.instalment_date.length;
                _this.defaultInstalmentNo = _this.instalments.instalment_date.length;
                _this.remainingInstalment = _this.instalments.instalment_date.length - 1;
                _this.secondInstalment = _this.instalments.instalment_date[1].instalment_amount;
            }
        }, function (err) {
        });
    };
    PaymentModeComponent.prototype.changeDuration = function (type) {
        this.durationType = type;
    };
    PaymentModeComponent.prototype.triggerPayemntMode = function (type) {
        if (type == 'instalment') {
            this.isInstalemtMode = true;
        }
        if (type == 'noinstalment') {
            this.isInstalemtMode = false;
        }
        this.selectInstalmentMode.emit(type);
    };
    PaymentModeComponent.prototype.selectLaycredit = function (changeContext) {
        this.applyLaycredit.emit(changeContext.value);
    };
    /**
     *
     * @param type [add,minus]
     */
    PaymentModeComponent.prototype.setAdditionalAmount = function (type) {
        if (type == 'add') {
            this.additionalAmount += 1;
            this.remainingAmount = this.remainingAmount - 1;
            this.firstInstalment += 1;
        }
        else {
            if (this.additionalAmount != 0) {
                this.additionalAmount -= 1;
                this.remainingAmount = this.remainingAmount + 1;
                this.firstInstalment -= 1;
            }
        }
        this.calculateInstalment();
    };
    /**
     *
     * @param type [increase,decrease]
     */
    PaymentModeComponent.prototype.setCustomAmount = function (type) {
        if (type == 'increase') {
            this.customAmount += 1;
        }
        else {
            if (this.defaultInstalment < this.customAmount) {
                this.customAmount -= 1;
            }
        }
    };
    /**
     *
     * @param type [increase,decrease]
     */
    PaymentModeComponent.prototype.setCustomInstalmentNo = function (type) {
        if (type == 'increase') {
            if (this.defaultInstalmentNo > this.customInstalment) {
                this.customInstalment += 1;
            }
        }
        else {
            if (this.customInstalment > 2) {
                this.customInstalment -= 1;
            }
        }
    };
    /**
     *
     * @param type [amount,instalment]
     */
    PaymentModeComponent.prototype.selectCustomMethod = function (type) {
        /* if(type=='amount'){
          this.customInstalment = this.defaultInstalmentNo;
        }
        else if(type=='instalment'){
          this.customAmount = this.firstInstalment;
        }
        this.calculateInstalment(); */
        this.customMethod = type;
    };
    PaymentModeComponent.prototype.calculateInstalment = function () {
        var _this = this;
        if (this.customMethod == 'amount') {
            this.instalmentRequest.custom_amount = this.customAmount;
            this.instalmentRequest.custom_instalment_no = null;
        }
        else {
            this.instalmentRequest.custom_amount = null;
            this.instalmentRequest.custom_instalment_no = this.customInstalment;
        }
        this.instalmentRequest.additional_amount = this.additionalAmount;
        this.instalmentRequest.additional_amount = this.additionalAmount;
        this.genericService.getInstalemnts(this.instalmentRequest).subscribe(function (res) {
            _this.instalments = res;
            if (_this.instalments.instalment_available == true) {
                _this.firstInstalment = _this.instalments.instalment_date[0].instalment_amount;
                _this.remainingAmount = _this.instalmentRequest.amount - parseFloat(_this.instalments.instalment_date[0].instalment_amount);
                _this.secondInstalment = _this.instalments.instalment_date[1].instalment_amount;
                _this.remainingInstalment = _this.instalments.instalment_date.length - 1;
            }
        }, function (err) {
        });
    };
    __decorate([
        core_1.Output()
    ], PaymentModeComponent.prototype, "applyLaycredit");
    __decorate([
        core_1.Output()
    ], PaymentModeComponent.prototype, "selectInstalmentMode");
    PaymentModeComponent = __decorate([
        core_1.Component({
            selector: 'app-payment-mode',
            templateUrl: './payment-mode.component.html',
            styleUrls: ['./payment-mode.component.scss']
        })
    ], PaymentModeComponent);
    return PaymentModeComponent;
}());
exports.PaymentModeComponent = PaymentModeComponent;
