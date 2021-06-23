"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PriceSummaryComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var generic_helper_1 = require("../../_helpers/generic.helper");
var PriceSummaryComponent = /** @class */ (function () {
    function PriceSummaryComponent(commonFunction) {
        this.commonFunction = commonFunction;
        this.cartPrices = [];
        this.insatllmentAmount = 0;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.installmentVartion = 0;
        this.cartAlerts = [];
        this.flightCount = 0;
        this.installmentType = generic_helper_1.installmentType.en;
    }
    PriceSummaryComponent.prototype.ngOnInit = function () {
    };
    PriceSummaryComponent.prototype.closeModal = function () {
        $('#tax_fee_modal').modal('hide');
    };
    PriceSummaryComponent.prototype.ngOnChanges = function (changes) {
        /* console.log("======>",changes['cartPrices'])
        if (typeof changes['cartPrices']!='undefined') {
          let isFlight = this.cartPrices.find(x=>{return x.type==='flight'});
          if(isFlight){
            this.flightCount=1;
          }
          console.log("===================",isFlight,this.flightCount)
        } */
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
        this.insatllmentAmount = 0;
        if (typeof changes['priceSummary'].currentValue != 'undefined') {
            if ($('#flight_list_wrper').text() == "") {
                $('#flight_list_wrper').remove();
            }
            this.priceSummary = changes['priceSummary'].currentValue;
            if (typeof this.priceSummary.instalments !== 'undefined' && this.priceSummary.paymentType == 'instalment') {
                for (var i = 1; i < this.priceSummary.instalments.instalment_date.length; i++) {
                    this.insatllmentAmount += this.priceSummary.instalments.instalment_date[i].instalment_amount;
                }
                if (this.priceSummary.instalments.instalment_date.length > 2) {
                    if (this.priceSummary.instalments.instalment_date[1].instalment_amount != this.priceSummary.instalments.instalment_date[this.priceSummary.instalments.instalment_date.length - 1].instalment_amount) {
                        this.installmentVartion = this.priceSummary.instalments.instalment_date[this.priceSummary.instalments.instalment_date.length - 1].instalment_amount - this.priceSummary.instalments.instalment_date[1].instalment_amount;
                        /* if(this.installmentVartion>0){
                          let indexExist = this.cartAlerts.findIndex(x=>x.type=="installment_vartion");
                          if(indexExist==-1){
                            this.cartAlerts.push({
                              type : 'installment_vartion',
                              id : -1
                            })
                          }
                          localStorage.setItem('__alrt',JSON.stringify(this.cartAlerts))
                        } */
                    }
                }
            }
        }
    };
    PriceSummaryComponent.prototype.typeOf = function (value) {
        return typeof value;
    };
    PriceSummaryComponent.prototype.closeInstallmentVartion = function (id) {
        /* try{
          let cartAlerts = localStorage.getItem("__alrt")
          if(cartAlerts){
            this.cartAlerts= JSON.parse(cartAlerts)
            let index = this.cartAlerts.findIndex(x=>x.id==id)
            this.cartAlerts.splice(index,1)
          }
          else{
            this.cartAlerts=[]
          }
        }
        catch(e){
          this.cartAlerts=[];
        }
        
        localStorage.setItem('__alrt',JSON.stringify(this.cartAlerts)) */
        this.installmentVartion = 0;
    };
    __decorate([
        core_1.Input()
    ], PriceSummaryComponent.prototype, "priceSummary");
    __decorate([
        core_1.Input()
    ], PriceSummaryComponent.prototype, "cartPrices");
    PriceSummaryComponent = __decorate([
        core_1.Component({
            selector: 'app-price-summary',
            templateUrl: './price-summary.component.html',
            styleUrls: ['./price-summary.component.scss']
        })
    ], PriceSummaryComponent);
    return PriceSummaryComponent;
}());
exports.PriceSummaryComponent = PriceSummaryComponent;
