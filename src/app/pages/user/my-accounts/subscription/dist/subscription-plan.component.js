"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SubscriptionPlanComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var SubscriptionPlanComponent = /** @class */ (function () {
    function SubscriptionPlanComponent(userService, router, commonFunction) {
        this.userService = userService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
    }
    SubscriptionPlanComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scroll(0, 0);
        this.loading = true;
        var _currency = localStorage.getItem('_curr');
        this.currency = JSON.parse(_currency);
        this.userService.getSubscriptionList().subscribe(function (res) {
            // console.log(res.data);
            if (res && res.data) {
                _this.subscriptionList = res.data;
                _this.loading = false;
            }
        });
    };
    SubscriptionPlanComponent.prototype.subscribeNow = function (planId) {
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
            this.router.navigate(['/account/subscription', planId], { queryParams: queryParams });
        }
        else {
            this.router.navigate(['/account/subscription', planId]);
        }
    };
    SubscriptionPlanComponent = __decorate([
        core_1.Component({
            selector: 'app-subscription-plan',
            templateUrl: './subscription-plan.component.html',
            styleUrls: ['./subscription-plan.component.scss']
        })
    ], SubscriptionPlanComponent);
    return SubscriptionPlanComponent;
}());
exports.SubscriptionPlanComponent = SubscriptionPlanComponent;
