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
    function PaymentModeComponent(genericService, commonFunction, toastr, cartService) {
        this.genericService = genericService;
        this.commonFunction = commonFunction;
        this.toastr = toastr;
        this.cartService = cartService;
        this.selectInstalmentMode = new core_1.EventEmitter();
        this.redeemableLayCredit = new core_1.EventEmitter();
        this.getInstalmentData = new core_1.EventEmitter();
        this.customInstalmentData = {};
        this.priceData = [];
        this.showFullPartialPayOption = true;
        this.isShowPartialPaymentDetails = true;
        this.instalmentRequest = {
            instalment_type: "weekly",
            checkin_date: '',
            booking_date: moment().format("YYYY-MM-DD"),
            amount: 0,
            additional_amount: 0,
            selected_down_payment: 0
        };
        this.instalmentType = 'weekly'; // [weekly,biweekly,monthly]
        this.paymentType = 'instalment';
        this.additionalAmount = 0;
        this.totalLaycreditPoints = 0;
        this.instalmentAvavible = false;
        this.payNowPrice = 0;
        this.weeklyInstalment = 0;
        this.biWeeklyInstalment = 0;
        this.montlyInstalment = 0;
        this.downPayments = [];
        this.defaultDownPayments = {
            weekly: [],
            biweekly: [],
            monthly: []
        };
        this.selectedDownPaymentIndex = 0;
        this.minimumPriceValidationError = 'Your installment price is less then $5, Partial payment option is not available for this Offer.';
        this.isBelowMinimumInstallment = false;
        this.isLayCreditLoading = false;
        this.isPaymentCalulcatorLoading = false;
    }
    PaymentModeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.cartService.getCartPrice.subscribe(function (cartPrices) {
            _this.cartPrices = cartPrices;
            _this.getTotalPrice();
            if (_this.instalmentRequest.checkin_date) {
                _this.instalmentRequest.amount = _this.sellingPrice;
                _this.totalLaycredit();
                _this.getAllInstalment('set-default-down-payment');
                _this.calculateInstalment('down-payment', null);
            }
        });
    };
    /**
     *
     * @param type1 => To calculate first, second & third down payment
     * @param type2 => To calculate redeemable point
     */
    PaymentModeComponent.prototype.calculateInstalment = function (type1, type2, type3) {
        var _this = this;
        if (type1 === void 0) { type1 = null; }
        if (type2 === void 0) { type2 = null; }
        if (type3 === void 0) { type3 = null; }
        this.genericService.getInstalemnts(this.instalmentRequest).subscribe(function (res) {
            _this.instalments = res;
            if (_this.instalments.instalment_available == true) {
                if (type1 != null && type1 == 'down-payment') {
                    _this.downPayments = _this.instalments.down_payment;
                    _this.redeemableLayCredit.emit(_this.sellingPrice);
                }
                if (type2 != null && type2 == 'redeemable_point' && _this.sellingPrice) {
                    //Below line commented for temporary reason
                    //this.redeemableLayCredit.emit(this.sellingPrice-this.defaultDownPayments[this.instalmentType][this.selectedDownPaymentIndex]);
                }
                if (_this.instalments.instalment_date[1].instalment_amount < 5 && type3 == null) {
                    if (_this.paymentType == 'instalment') {
                        _this.toastr.warning(_this.minimumPriceValidationError, 'Warning', { positionClass: 'toast-top-center', easeTime: 1000 });
                        _this.togglePaymentMode('no-instalment');
                    }
                    _this.isBelowMinimumInstallment = true;
                    // this.minimumInstallmentValidation();
                }
                else {
                    _this.isBelowMinimumInstallment = false;
                    /* if(type3!=null && type3=='min-instal'){
                      this.minimumInstallmentValidation();
                    } */
                }
                _this.remainingAmount = _this.sellingPrice - _this.instalments.instalment_date[0].instalment_amount;
            }
            _this.getInstalmentData.emit({
                layCreditPoints: _this.laycreditpoints,
                instalmentType: _this.instalmentType,
                instalments: _this.instalments,
                remainingAmount: _this.remainingAmount,
                totalAmount: _this.sellingPrice
            });
        }, function (err) {
        });
    };
    PaymentModeComponent.prototype.ngOnChanges = function (changes) {
        if (changes['laycreditpoints']) {
            this.laycreditpoints = Number(changes['laycreditpoints'].currentValue);
            this.instalmentRequest.additional_amount = this.laycreditpoints;
            this.calculateInstalment('down-payment', null);
            this.getAllInstalment();
        }
        /* if(changes['priceData']){
          this.instalmentRequest.amount= changes['priceData'].currentValue[0].selling_price;
        } */
    };
    PaymentModeComponent.prototype.getPayNowAmount = function () {
    };
    PaymentModeComponent.prototype.getTotalPrice = function () {
        //this.sellingPrice=this.priceData[0].selling_price;
        var totalPrice = 0;
        if (this.cartPrices.length > 0) {
            var checkinDate = moment(this.cartPrices[0].departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
            for (var i = 0; i < this.cartPrices.length; i++) {
                totalPrice += this.cartPrices[i].selling_price;
                if (i == 0) {
                    continue;
                }
                if (moment(checkinDate).isAfter(moment(this.cartPrices[i].departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD"))) {
                    checkinDate = moment(this.cartPrices[i].departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
                }
            }
            this.sellingPrice = totalPrice;
            this.instalmentRequest.checkin_date = checkinDate;
            this.getInstalmentData.emit({
                layCreditPoints: this.laycreditpoints,
                instalmentType: this.instalmentType,
                instalments: this.instalments,
                remainingAmount: this.remainingAmount,
                totalAmount: this.sellingPrice
            });
        }
    };
    PaymentModeComponent.prototype.convertToNumber = function (number) {
        return Number(number);
    };
    PaymentModeComponent.prototype.getAllInstalment = function (type1) {
        var _this = this;
        if (type1 === void 0) { type1 = null; }
        if (!this.weeklyInstalment) {
            this.isPaymentCalulcatorLoading = true;
        }
        this.genericService.getAllInstalemnts(this.instalmentRequest).subscribe(function (res) {
            _this.isPaymentCalulcatorLoading = false;
            if (res.instalment_available == true) {
                _this.instalmentAvavible = true;
                _this.weeklyInstalment = res.weekly_instalments[1].instalment_amount;
                _this.biWeeklyInstalment = res.biweekly_instalments[1].instalment_amount;
                _this.montlyInstalment = res.monthly_instalments[1].instalment_amount;
                if (type1 != null && type1 == 'set-default-down-payment') {
                    _this.defaultDownPayments.weekly = res.weekly_down_payment;
                    _this.defaultDownPayments.biweekly = res.bi_weekly_down_payment;
                    _this.defaultDownPayments.monthly = res.monthly_down_payment;
                    //Below line commented for temporary reason
                    //this.redeemableLayCredit.emit(this.sellingPrice-this.defaultDownPayments[this.instalmentType][this.selectedDownPaymentIndex]);
                }
            }
        }, function (err) {
            _this.isPaymentCalulcatorLoading = false;
        });
    };
    PaymentModeComponent.prototype.calculateDownPayment = function (sellingPrice, firstDownPayment) {
        this.downPayments = [];
        this.downPayments.push(firstDownPayment);
        var secondDownPayment = firstDownPayment + (sellingPrice * 10) / 100;
        this.downPayments.push(secondDownPayment);
        var thirdDownPayment = secondDownPayment + (sellingPrice * 10) / 100;
        this.downPayments.push(thirdDownPayment);
    };
    /**
     *
     * @param type ['instalment','no-instalment']
     */
    PaymentModeComponent.prototype.togglePaymentMode = function (type) {
        if (type == 'instalment' && this.isBelowMinimumInstallment) {
            return;
        }
        this.paymentType = type;
    };
    /**
     *
     * @param type ['weekly','biweekly','monthly']
     */
    PaymentModeComponent.prototype.togglePaymentFrequency = function (type) {
        this.instalmentRequest.instalment_type = type;
        this.instalmentType = type;
        this.calculateInstalment('down-payment', 'redeemable_point', 'set-default-down-payment');
        this.getAllInstalment();
    };
    /**
     *
     * @param index [it will hold the first(0) ,second(1) or third(2) downpayment option]
     */
    PaymentModeComponent.prototype.toggleDownPayment = function (index) {
        this.selectedDownPaymentIndex = index;
        //this.instalmentRequest.down_payment= this.downPayments[index];
        this.instalmentRequest.selected_down_payment = this.selectedDownPaymentIndex;
        //Below line commented for temporary reason
        //this.redeemableLayCredit.emit(this.sellingPrice-this.defaultDownPayments[this.instalmentType][index]);
        this.calculateInstalment();
        this.getAllInstalment();
    };
    PaymentModeComponent.prototype.applyLaycredit = function (laycreditpoints) {
        this.laycreditpoints = laycreditpoints;
        this.instalmentRequest.additional_amount = this.laycreditpoints;
        if (this.instalmentAvavible) {
            this.calculateInstalment('down-payment', null);
            this.getAllInstalment();
        }
        else {
            this.getInstalmentData.emit({
                layCreditPoints: this.laycreditpoints,
                instalmentType: this.instalmentType,
                instalments: this.instalments,
                remainingAmount: this.remainingAmount,
                totalAmount: this.sellingPrice
            });
        }
    };
    PaymentModeComponent.prototype.totalLaycredit = function () {
        var _this = this;
        this.isLayCreditLoading = true;
        this.genericService.getAvailableLaycredit().subscribe(function (res) {
            _this.totalLaycreditPoints = res.total_available_points;
            _this.isLayCreditLoading = false;
        }, (function (error) {
            _this.isLayCreditLoading = false;
        }));
    };
    __decorate([
        core_1.Output()
    ], PaymentModeComponent.prototype, "selectInstalmentMode");
    __decorate([
        core_1.Output()
    ], PaymentModeComponent.prototype, "redeemableLayCredit");
    __decorate([
        core_1.Output()
    ], PaymentModeComponent.prototype, "getInstalmentData");
    __decorate([
        core_1.Input()
    ], PaymentModeComponent.prototype, "laycreditpoints");
    __decorate([
        core_1.Input()
    ], PaymentModeComponent.prototype, "customInstalmentData");
    __decorate([
        core_1.Input()
    ], PaymentModeComponent.prototype, "priceData");
    __decorate([
        core_1.Input()
    ], PaymentModeComponent.prototype, "isShowSummary");
    __decorate([
        core_1.Input()
    ], PaymentModeComponent.prototype, "showFullPartialPayOption");
    __decorate([
        core_1.Input()
    ], PaymentModeComponent.prototype, "isShowPartialPaymentDetails");
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
