"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PlanSubscriptionComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var jwt_helper_1 = require("../../../../_helpers/jwt.helper");
var PlanSubscriptionComponent = /** @class */ (function () {
    function PlanSubscriptionComponent(router, route, userService, toastr, commonFunction) {
        this.router = router;
        this.route = route;
        this.userService = userService;
        this.toastr = toastr;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.cardToken = '';
        this.isDisableBookBtn = true;
        this.isTandCaccepeted = false;
        this.laycreditpoints = 0;
        this.showAddCardForm = false;
        this.isShowCardOption = true;
        this.instalmentMode = 'instalment';
        this.instalmentType = 'weekly';
        this.showPartialPayemntOption = false;
        this.loading = false;
    }
    PlanSubscriptionComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scroll(0, 0);
        var _currency = localStorage.getItem('_curr');
        this.currency = JSON.parse(_currency);
        this.planId = this.route.snapshot.paramMap.get('id');
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        if (typeof this.userInfo.roleId == 'undefined') {
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
                this.router.navigate(['/'], { queryParams: queryParams });
            }
            else {
                this.router.navigate(['/']);
            }
        }
        var payload = { id: this.planId, currency: this.currency.id };
        this.userService.getSubscriptionPlanDetail(payload).subscribe(function (res) {
            if (res) {
                _this.planSummaryData = res;
            }
        });
    };
    PlanSubscriptionComponent.prototype.emitNewCard = function (event) {
        this.newCard = event;
    };
    PlanSubscriptionComponent.prototype.selectCreditCard = function (cardToken) {
        this.cardToken = cardToken;
    };
    PlanSubscriptionComponent.prototype.toggleAddcardForm = function () {
        this.showAddCardForm = !this.showAddCardForm;
    };
    PlanSubscriptionComponent.prototype.totalNumberOfcard = function (count) {
        if (count == 0) {
            this.showAddCardForm = true;
        }
    };
    PlanSubscriptionComponent.prototype.onPayNow = function () {
        var _this = this;
        this.loading = true;
        var data = { plan_id: this.planId, currency_id: this.currency.id, card_token: this.cardToken };
        this.userService.payNowSubscription(data).subscribe(function (res) {
            _this.loading = true;
            // this.toastr.success(res.message, 'Plan Subscription');
            _this.toastr.show(res.message, 'Plan Subscription', {
                toastClass: 'custom_toastr',
                titleClass: 'custom_toastr_title',
                messageClass: 'custom_toastr_message'
            });
            if (_this.commonFunction.isRefferal()) {
                var parms = _this.commonFunction.getRefferalParms();
                var queryParams = {};
                queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
                if (parms.utm_medium) {
                    queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
                }
                if (parms.utm_campaign) {
                    queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
                }
                _this.router.navigate(['/'], { queryParams: queryParams });
            }
            else {
                _this.router.navigate(['/']);
            }
        }, function (error) {
            _this.loading = false;
            // this.toastr.error(error.error.message);
            _this.toastr.show(error.error.message, '', {
                toastClass: 'custom_toastr',
                titleClass: 'custom_toastr_title',
                messageClass: 'custom_toastr_message'
            });
        });
    };
    PlanSubscriptionComponent = __decorate([
        core_1.Component({
            selector: 'app-plan-subscription',
            templateUrl: './plan-subscription.component.html',
            styleUrls: ['./plan-subscription.component.scss']
        })
    ], PlanSubscriptionComponent);
    return PlanSubscriptionComponent;
}());
exports.PlanSubscriptionComponent = PlanSubscriptionComponent;
