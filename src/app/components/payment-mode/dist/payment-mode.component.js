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
    function PaymentModeComponent(genericService, commonFunction, flightService) {
        this.genericService = genericService;
        this.commonFunction = commonFunction;
        this.flightService = flightService;
        this.selectInstalmentMode = new core_1.EventEmitter();
        this.redeemableLayCredit = new core_1.EventEmitter();
        this.getInstalmentData = new core_1.EventEmitter();
        this.customInstalmentData = {};
        this.priceData = [];
        this.showFullPartialPayOption = true;
        this.isShowPartialPaymentDetails = true;
        this.isInstalemtMode = true;
        this.disablePartialPayment = false;
        this.predictionDate = '';
        this.pridictionLoading = false;
        this.partialPaymentSellingPrice = 0;
        this.instalmentRequest = {
            instalment_type: "weekly",
            checkin_date: '',
            booking_date: moment().format("YYYY-MM-DD"),
            amount: 0,
            additional_amount: null,
            custom_instalment_no: null,
            custom_amount: null
        };
        this.durationType = 'weekly'; // [weekly,biweekly,monthly]
        this.additionalAmount = 0;
        this.totalLaycreditPoints = 0;
        this.instalmentAvavible = false;
        this.showFirstAccrodian = false;
        this.weeklyDefaultInstalmentNo = 0;
        this.weeklyDefaultInstalment = 0;
        this.weeklyFirsttInstalment = 0;
        this.biWeeklyDefaultInstalmentNo = 0;
        this.biWeeklyDefaultInstalment = 0;
        this.biWeeklyFirstInstalment = 0;
        this.monthlyDefaultInstalmentNo = 0;
        this.monthlyDefaultInstalment = 0;
        this.monthlyFirstInstalment = 0;
        this.upFrontPayment = 0;
        this.payNowPrice = 0;
        this.secondAccordiain = false;
        this.showThirdAccrodian = false;
        this.weeklySecondInstalmentTemp = 0;
        this.biWeeklySecondInstalmentTemp = 0;
        this.monthlySecondInstalmentTemp = 0;
        this.getPredictionDate();
    }
    PaymentModeComponent.prototype.ngOnInit = function () {
        var _this = this;
        //console.log("laycreditpoints",this.laycreditpoints)
        this.instalmentRequest.amount = this.priceData[0].selling_price;
        this.partialPaymentSellingPrice = this.priceData[0].selling_price;
        this.instalmentRequest.checkin_date = moment(this.flightSummary[0].departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
        this.getInstalemntsBiweekly('biweekly');
        this.getInstalemntsMonthly('monthly');
        this.getInstalemntsWeekly('weekly');
        if (Object.keys(this.customInstalmentData).length) {
            this.additionalAmount = this.customInstalmentData.additionalAmount;
            this.durationType = this.customInstalmentData.instalmentType;
            this.customAmount = this.customInstalmentData.customAmount;
            this.customInstalment = this.customInstalmentData.customInstalment;
            this.laycreditpoints = this.customInstalmentData.layCreditPoints;
            if (this.customAmount != null) {
                this.customMethod = 'amount';
            }
            else if (this.customInstalment != null) {
                this.customMethod = 'instalment';
            }
            else {
                this.customMethod = '';
            }
            this.instalmentRequest.instalment_type = this.durationType;
            this.instalmentRequest.custom_instalment_no = this.customInstalment;
            this.instalmentRequest.custom_amount = this.customAmount;
            this.instalmentRequest.additional_amount = Number(this.additionalAmount) + Number(this.laycreditpoints);
            this.getInstalmentData.emit({
                additionalAmount: this.additionalAmount,
                instalmentType: this.durationType,
                customAmount: this.instalmentRequest.custom_amount,
                customInstalment: this.instalmentRequest.custom_instalment_no,
                layCreditPoints: this.laycreditpoints,
                partialPaymentAmount: this.secondInstalment,
                payNowAmount: this.getPayNowAmount(),
                firstInstalment: this.customInstalmentData.firstInstalment
            });
            setTimeout(function () { _this.getInstalemnts(_this.durationType); }, 2000);
        }
        else {
            this.getInstalemnts('weekly');
        }
    };
    PaymentModeComponent.prototype.toggleSecondAccordian = function () {
        this.secondAccordiain = !this.secondAccordiain;
    };
    PaymentModeComponent.prototype.toggleaccordin = function () {
        this.showFirstAccrodian = !this.showFirstAccrodian;
    };
    PaymentModeComponent.prototype.toggleThirdAccordian = function () {
        this.showThirdAccrodian = !this.showThirdAccrodian;
    };
    /* changeAdditionalAmount(event){
  
      this.additionalAmount = Number(event.target.value);
  
      this.remainingAmount=this.remainingAmount-this.additionalAmount;
      this.firstInstalment+=this.additionalAmount;
      this.getInstalmentData.emit({
        additionalAmount:this.additionalAmount ,
        instalmentType:this.durationType,
        customAmount: this.instalmentRequest.custom_amount,
        customInstalment : this.instalmentRequest.custom_instalment_no,
        layCreditPoints : this.laycreditpoints,
        partialPaymentAmount : this.secondInstalment
      })
      this.calculateInstalment();
    } */
    PaymentModeComponent.prototype.changeAdditionalAmount = function (event) {
        this.upFrontPayment = Number(event.target.value);
        if (this.upFrontPayment < this.defaultInstalment) {
            this.upFrontPayment = this.defaultInstalment;
        }
        this.additionalAmount = this.upFrontPayment - this.defaultInstalment;
        this.remainingAmount = this.remainingAmount - this.upFrontPayment;
        this.firstInstalment = this.upFrontPayment;
        this.getInstalmentData.emit({
            additionalAmount: this.additionalAmount,
            instalmentType: this.durationType,
            customAmount: this.instalmentRequest.custom_amount,
            customInstalment: this.instalmentRequest.custom_instalment_no,
            layCreditPoints: this.laycreditpoints,
            partialPaymentAmount: this.secondInstalment,
            payNowAmount: this.getPayNowAmount(),
            firstInstalment: this.firstInstalment
        });
        if ((Number(this.laycreditpoints) + Number(this.upFrontPayment)) >= this.priceData[0].selling_price) {
            this.toggleFullPayment();
        }
        this.calculateInstalment();
    };
    PaymentModeComponent.prototype.changeCustomInstalmentAmount = function (event) {
        if (this.customMethod == 'amount') {
            this.customAmount = Number(event.target.value);
            if (this.customAmount < this.secondInstalment) {
            }
            if (this.durationType == 'weekly' && this.customAmount < this.weeklyDefaultInstalment) {
                this.customAmount = this.weeklyDefaultInstalment;
            }
            else if (this.durationType == 'biweekly' && this.customAmount < this.biWeeklyDefaultInstalment) {
                this.customAmount = this.biWeeklyDefaultInstalment;
            }
            else if (this.durationType == 'monthly' && this.customAmount < this.monthlyDefaultInstalment) {
                this.customAmount = this.monthlyDefaultInstalment;
            }
            if (Number(this.firstInstalment) + this.customAmount > this.priceData[0].selling_price) {
                this.customAmount = this.priceData[0].selling_price - this.firstInstalment;
            }
        }
        this.getInstalmentData.emit({
            additionalAmount: this.additionalAmount,
            instalmentType: this.durationType,
            customAmount: this.customAmount,
            customInstalment: null,
            layCreditPoints: this.laycreditpoints,
            partialPaymentAmount: this.customAmount,
            payNowAmount: this.getPayNowAmount(),
            firstInstalment: this.firstInstalment
        });
        this.calculateInstalment();
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
                _this.instalmentAvavible = true;
                _this.remainingAmount = _this.instalmentRequest.amount - parseFloat(_this.instalments.instalment_date[0].instalment_amount);
                _this.firstInstalment = _this.instalments.instalment_date[0].instalment_amount;
                _this.defaultInstalment = _this.instalments.instalment_date[0].instalment_amount;
                _this.upFrontPayment = _this.instalments.instalment_date[0].instalment_amount - _this.laycreditpoints;
                _this.customAmount = _this.instalments.instalment_date[1].instalment_amount;
                _this.customInstalment = _this.instalments.instalment_date.length;
                _this.defaultInstalmentNo = _this.instalments.instalment_date.length;
                _this.remainingInstalment = _this.instalments.instalment_date.length - 1;
                _this.secondInstalment = _this.instalments.instalment_date[1].instalment_amount;
                _this.defaultInstalment = _this.defaultInstalment - Number(_this.laycreditpoints) - (_this.additionalAmount);
                /* console.log(this.defaultInstalmentNo,"----",this.customInstalment)
                if(this.customInstalment){
                  this.defaultInstalmentNo = this.defaultInstalmentNo - this.customInstalment;
                } */
                setTimeout(function () { _this.triggerPayemntMode('instalment'); }, 2000);
                _this.getInstalmentData.emit({
                    additionalAmount: _this.additionalAmount,
                    instalmentType: _this.durationType,
                    customAmount: _this.instalmentRequest.custom_amount,
                    customInstalment: _this.instalmentRequest.custom_instalment_no,
                    layCreditPoints: _this.laycreditpoints,
                    partialPaymentAmount: _this.secondInstalment,
                    payNowAmount: _this.getPayNowAmount(),
                    firstInstalment: _this.firstInstalment
                });
            }
            else {
                _this.instalmentAvavible = false;
                _this.selectInstalmentMode.emit('no-instalment');
            }
        }, function (err) {
        });
    };
    PaymentModeComponent.prototype.getInstalemntsBiweekly = function (type) {
        var _this = this;
        this.instalmentRequest.instalment_type = type;
        this.genericService.getInstalemnts(this.instalmentRequest).subscribe(function (res) {
            if (res.instalment_available == true) {
                _this.biWeeklyDefaultInstalmentNo = res.instalment_date.length;
                _this.biWeeklyDefaultInstalment = res.instalment_date[1].instalment_amount;
                _this.biWeeklyFirstInstalment = res.instalment_date[0].instalment_amount;
                _this.biWeeklySecondInstalmentTemp = res.instalment_date[1].instalment_amount;
            }
            else {
                _this.instalmentAvavible = false;
                _this.selectInstalmentMode.emit('no-instalment');
            }
        }, function (err) {
        });
    };
    PaymentModeComponent.prototype.getInstalemntsMonthly = function (type) {
        var _this = this;
        this.instalmentRequest.instalment_type = type;
        this.genericService.getInstalemnts(this.instalmentRequest).subscribe(function (res) {
            if (res.instalment_available == true) {
                _this.monthlyDefaultInstalmentNo = res.instalment_date.length;
                _this.monthlyDefaultInstalment = res.instalment_date[1].instalment_amount;
                _this.monthlyFirstInstalment = res.instalment_date[0].instalment_amount;
                _this.monthlySecondInstalmentTemp = res.instalment_date[1].instalment_amount;
            }
            else {
                _this.instalmentAvavible = false;
                _this.selectInstalmentMode.emit('no-instalment');
            }
        }, function (err) {
        });
    };
    PaymentModeComponent.prototype.getInstalemntsWeekly = function (type) {
        var _this = this;
        this.instalmentRequest.instalment_type = type;
        this.genericService.getInstalemnts(this.instalmentRequest).subscribe(function (res) {
            if (res.instalment_available == true) {
                _this.weeklyDefaultInstalmentNo = res.instalment_date.length;
                _this.weeklyDefaultInstalment = res.instalment_date[1].instalment_amount;
                _this.weeklyFirsttInstalment = res.instalment_date[0].instalment_amount;
                _this.weeklySecondInstalmentTemp = res.instalment_date[1].instalment_amount;
            }
            else {
                _this.instalmentAvavible = false;
                _this.selectInstalmentMode.emit('no-instalment');
            }
        }, function (err) {
        });
    };
    PaymentModeComponent.prototype.changeDuration = function (type) {
        this.durationType = type;
        this.customMethod = '';
        //this.secondInstalmentTemp=0;
        this.additionalAmount = 0;
        //this.laycreditpoints=0;
        this.instalmentRequest.custom_amount = null;
        this.instalmentRequest.custom_instalment_no = null;
        this.instalmentRequest.additional_amount = Number(this.laycreditpoints);
        this.getInstalemnts(this.durationType);
        this.getInstalmentData.emit({
            additionalAmount: this.additionalAmount,
            instalmentType: this.durationType,
            customAmount: this.instalmentRequest.custom_amount,
            customInstalment: this.instalmentRequest.custom_instalment_no,
            layCreditPoints: this.laycreditpoints,
            partialPaymentAmount: this.secondInstalment,
            payNowAmount: this.getPayNowAmount(),
            firstInstalment: this.firstInstalment
        });
        this.getInstalemntsWeekly('weekly');
        this.getInstalemntsBiweekly('biweekly');
        this.getInstalemntsMonthly('monthly');
    };
    PaymentModeComponent.prototype.triggerPayemntMode = function (type) {
        if ((Number(this.laycreditpoints) + Number(this.upFrontPayment)) <= this.priceData[0].selling_price) {
            if (type == 'instalment') {
                this.isInstalemtMode = true;
                this.getInstalmentData.emit({
                    additionalAmount: this.additionalAmount,
                    instalmentType: this.durationType,
                    customAmount: this.customAmount,
                    customInstalment: null,
                    layCreditPoints: this.laycreditpoints,
                    partialPaymentAmount: this.secondInstalment,
                    payNowAmount: this.getPayNowAmount(),
                    firstInstalment: this.firstInstalment
                });
                this.redeemableLayCredit.emit(this.priceData[0].selling_price - this.defaultInstalment);
            }
            if (type == 'no-instalment') {
                this.isInstalemtMode = false;
                this.getInstalmentData.emit({
                    additionalAmount: this.additionalAmount,
                    instalmentType: '',
                    customAmount: null,
                    customInstalment: null,
                    layCreditPoints: this.laycreditpoints,
                    partialPaymentAmount: this.instalments.instalment_date[1].instalment_amount,
                    payNowAmount: this.getPayNowAmount(),
                    firstInstalment: this.firstInstalment
                });
                this.redeemableLayCredit.emit(this.getTotalPrice());
            }
            this.selectInstalmentMode.emit(type);
        }
        else {
            this.isInstalemtMode = false;
        }
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
        this.getInstalmentData.emit({
            additionalAmount: this.additionalAmount,
            instalmentType: this.durationType,
            customAmount: this.instalmentRequest.custom_amount,
            customInstalment: this.instalmentRequest.custom_instalment_no,
            layCreditPoints: this.laycreditpoints,
            partialPaymentAmount: this.secondInstalment,
            payNowAmount: this.getPayNowAmount(),
            firstInstalment: this.firstInstalment
        });
        this.calculateInstalment();
    };
    /**
     *
     * @param type [increase,decrease]
     */
    /* setCustomAmount(type){
  
      if(this.customMethod=='amount'){
  
        if(type=='increase'){
          this.customAmount+=1;
          this.calculateInstalment();
        }
        else{
  
          if(this.defaultInstalment<this.customAmount){
  
            this.customAmount-=1;
            this.calculateInstalment();
          }
        }
        this.getInstalmentData.emit({
          additionalAmount:this.additionalAmount ,
          instalmentType:this.durationType,
          customAmount: this.customAmount,
          customInstalment : null,
          layCreditPoints : this.laycreditpoints,
          partialPaymentAmount : this.secondInstalment,
          payNowAmount:this.getPayNowAmount()
        })
      }
    } */
    /**
     *
     * @param type [increase,decrease]
     */
    PaymentModeComponent.prototype.setCustomInstalmentNo = function (type) {
        if (this.customMethod == 'instalment') {
            if (type == 'increase') {
                if (this.defaultInstalmentNo > this.customInstalment) {
                    this.customInstalment += 1;
                    this.calculateInstalment();
                }
            }
            else {
                if (this.customInstalment > 2) {
                    this.customInstalment -= 1;
                    this.calculateInstalment();
                }
            }
        }
        this.getInstalmentData.emit({
            additionalAmount: this.additionalAmount,
            instalmentType: this.durationType,
            customAmount: null,
            customInstalment: this.customInstalment,
            layCreditPoints: this.laycreditpoints,
            partialPaymentAmount: this.secondInstalment,
            payNowAmount: this.getPayNowAmount(),
            firstInstalment: this.firstInstalment
        });
    };
    /**
     *
     * @param type [amount,instalment]
     */
    PaymentModeComponent.prototype.selectCustomMethod = function (event) {
        if (event.target.value == 'amount') {
            this.instalmentRequest.custom_amount = this.customAmount;
            this.instalmentRequest.custom_instalment_no = null;
        }
        else if (event.target.value == 'instalment') {
            this.instalmentRequest.custom_amount = null;
            this.instalmentRequest.custom_instalment_no = this.customInstalment;
        }
        this.getInstalmentData.emit({
            additionalAmount: this.additionalAmount,
            instalmentType: this.durationType,
            customAmount: this.instalmentRequest.custom_amount,
            customInstalment: this.instalmentRequest.custom_instalment_no,
            layCreditPoints: this.laycreditpoints,
            partialPaymentAmount: this.secondInstalment,
            payNowAmount: this.getPayNowAmount(),
            firstInstalment: this.firstInstalment
        });
        if (this.durationType == 'weekly') {
            this.customAmount = this.weeklyDefaultInstalment;
        }
        else if (this.durationType == 'biweekly') {
            this.customAmount = this.biWeeklyDefaultInstalment;
        }
        else {
            this.customAmount = this.monthlyDefaultInstalment;
        }
        this.customInstalment = this.defaultInstalmentNo;
        this.customMethod = event.target.checked ? event.target.value : '';
        this.calculateInstalment();
    };
    PaymentModeComponent.prototype.calculateInstalment = function () {
        var _this = this;
        if (this.customMethod == 'amount') {
            this.instalmentRequest.custom_amount = this.customAmount;
            this.instalmentRequest.custom_instalment_no = null;
        }
        else if (this.customMethod == 'instalment') {
            this.instalmentRequest.custom_amount = null;
            this.instalmentRequest.custom_instalment_no = this.customInstalment;
        }
        this.instalmentRequest.instalment_type = this.durationType;
        this.instalmentRequest.additional_amount = (this.upFrontPayment - this.defaultInstalment) + Number(this.laycreditpoints);
        this.genericService.getInstalemnts(this.instalmentRequest).subscribe(function (res) {
            _this.instalments = res;
            if (_this.instalments.instalment_available == true) {
                _this.firstInstalment = _this.instalments.instalment_date[0].instalment_amount;
                _this.remainingAmount = _this.instalmentRequest.amount - parseFloat(_this.instalments.instalment_date[0].instalment_amount);
                _this.secondInstalment = _this.instalments.instalment_date[1].instalment_amount;
                _this.getInstalemntsWeekly('weekly');
                _this.getInstalemntsBiweekly('biweekly');
                _this.getInstalemntsMonthly('monthly');
                _this.remainingInstalment = _this.instalments.instalment_date.length - 1;
                _this.getInstalmentData.emit({
                    additionalAmount: _this.additionalAmount,
                    instalmentType: _this.durationType,
                    customAmount: _this.instalmentRequest.custom_amount,
                    customInstalment: _this.instalmentRequest.custom_instalment_no,
                    layCreditPoints: _this.laycreditpoints,
                    partialPaymentAmount: _this.secondInstalment,
                    payNowAmount: _this.getPayNowAmount(),
                    firstInstalment: _this.firstInstalment
                });
            }
        }, function (err) {
        });
    };
    PaymentModeComponent.prototype.ngOnChanges = function (changes) {
        if (changes['laycreditpoints']) {
            this.laycreditpoints = changes['laycreditpoints'].currentValue;
            this.getInstalmentData.emit({
                additionalAmount: this.additionalAmount,
                instalmentType: this.durationType,
                customAmount: this.instalmentRequest.custom_amount,
                customInstalment: this.instalmentRequest.custom_instalment_no,
                layCreditPoints: this.laycreditpoints,
                partialPaymentAmount: this.secondInstalment,
                payNowAmount: this.getPayNowAmount(),
                firstInstalment: this.firstInstalment
            });
            if ((Number(this.laycreditpoints) + Number(this.upFrontPayment)) >= this.priceData[0].selling_price) {
                this.toggleFullPayment();
                this.disablePartialPayment = true;
            }
            else {
                this.disablePartialPayment = false;
            }
            this.calculateInstalment();
        }
        if (changes['priceData']) {
            this.discountedPrice = changes['priceData'].currentValue[0].secondary_selling_price;
            this.instalmentRequest.amount = changes['priceData'].currentValue[0].selling_price;
        }
    };
    PaymentModeComponent.prototype.toggleFullPayment = function () {
        this.isInstalemtMode = false;
        this.selectInstalmentMode.emit('no-instalment');
        this.firstInstalment = this.defaultInstalment;
        this.getInstalmentData.emit({
            additionalAmount: 0,
            instalmentType: '',
            customAmount: null,
            customInstalment: null,
            layCreditPoints: this.laycreditpoints,
            partialPaymentAmount: this.secondInstalment,
            payNowAmount: this.getPayNowAmount(),
            firstInstalment: this.firstInstalment
        });
        this.redeemableLayCredit.emit(this.getTotalPrice());
        this.upFrontPayment = this.defaultInstalment;
        this.firstInstalment = this.defaultInstalment;
        this.additionalAmount = 0;
        this.customAmount = this.defaultInstalment;
        this.customInstalment = this.defaultInstalmentNo;
        this.instalmentRequest.custom_amount = null;
        this.instalmentRequest.custom_instalment_no = null;
        this.instalmentRequest.additional_amount = 0;
        this.calculateInstalment();
    };
    PaymentModeComponent.prototype.getPayNowAmount = function () {
        if (this.isInstalemtMode) {
            this.payNowPrice = this.upFrontPayment;
        }
        else {
            this.sellingPrice = this.getTotalPrice();
            this.payNowPrice = Number(this.sellingPrice) - Number(this.laycreditpoints);
        }
        return this.payNowPrice;
    };
    PaymentModeComponent.prototype.getTotalPrice = function () {
        this.sellingPrice = this.priceData[0].selling_price;
        if (this.priceData[0].secondary_selling_price) {
            this.sellingPrice = this.priceData[0].secondary_selling_price;
        }
        return this.sellingPrice;
    };
    PaymentModeComponent.prototype.getPredictionDate = function () {
        var _this = this;
        var routeInfo = sessionStorage.getItem("__route");
        var _itinerary = sessionStorage.getItem("_itinerary");
        try {
            routeInfo = JSON.parse(routeInfo);
            _itinerary = JSON.parse(_itinerary);
            var searchParams = {
                source_location: routeInfo.departure_code,
                destination_location: routeInfo.arrival_code,
                departure_date: moment(routeInfo.departure_date, "DD/MM/YYYY").format("YYYY-MM-DD"),
                flight_class: routeInfo.routes[0].stops[0].cabin_class,
                adult_count: Number(_itinerary.adult),
                child_count: Number(_itinerary.child),
                infant_count: Number(_itinerary.infant),
                unique_token: routeInfo.unique_code
            };
            this.pridictionLoading = true;
            this.flightService.getPredictionDate(searchParams).subscribe(function (res) {
                _this.pridictionLoading = false;
                if (res.length) {
                    var pridictedData = res.find(function (date) { return date.is_booking_avaible == true; });
                    if (Object.keys(pridictedData).length) {
                        _this.predictionDate = _this.commonFunction.convertDateFormat(pridictedData.date, "DD/MM/YYYY");
                    }
                }
            }, function (error) {
                _this.pridictionLoading = false;
            });
        }
        catch (e) {
        }
    };
    PaymentModeComponent.prototype.convertToNumber = function (number) {
        return Number(number);
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
    ], PaymentModeComponent.prototype, "flightSummary");
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
