"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PlanSummaryComponent = void 0;
var core_1 = require("@angular/core");
var moment = require("moment");
var PlanSummaryComponent = /** @class */ (function () {
    function PlanSummaryComponent(router, commonFunction) {
        this.router = router;
        this.commonFunction = commonFunction;
        this.showCancellationPolicy = false;
    }
    PlanSummaryComponent.prototype.ngOnInit = function () {
        var _currency = localStorage.getItem('_curr');
        this.currency = JSON.parse(_currency);
    };
    PlanSummaryComponent.prototype.ngAfterContentChecked = function () {
        if (this.planSummaryData) {
            this.todayDate = moment().format("MM/DD/YYYY");
            this.validityDaysRange = this.todayDate + ' to ' + moment().add(this.planSummaryData.validityDays, 'days').format("MM/DD/YYYY");
        }
    };
    PlanSummaryComponent.prototype.toggleCancellationPolicy = function () {
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
            this.router.navigate(['cancellation-policy'], { queryParams: queryParams });
        }
        else {
            this.router.navigate(['cancellation-policy']);
        }
    };
    __decorate([
        core_1.Input()
    ], PlanSummaryComponent.prototype, "planSummaryData");
    PlanSummaryComponent = __decorate([
        core_1.Component({
            selector: 'app-plan-summary',
            templateUrl: './plan-summary.component.html',
            styleUrls: ['./plan-summary.component.scss']
        })
    ], PlanSummaryComponent);
    return PlanSummaryComponent;
}());
exports.PlanSummaryComponent = PlanSummaryComponent;
