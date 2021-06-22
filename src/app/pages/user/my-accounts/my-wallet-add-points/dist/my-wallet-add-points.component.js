"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MyWalletAddPointsComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var jwt_helper_1 = require("../../../../_helpers/jwt.helper");
var MyWalletAddPointsComponent = /** @class */ (function () {
    function MyWalletAddPointsComponent(router, userService, toastr, genericService, commonFunction) {
        this.router = router;
        this.userService = userService;
        this.toastr = toastr;
        this.genericService = genericService;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.cardToken = '';
        this.showAddCardForm = false;
        this.loading = false;
        this.laycreditpoints = 0;
        this.isDisableAddButton = true;
    }
    MyWalletAddPointsComponent.prototype.ngOnInit = function () {
        var _currency = localStorage.getItem('_curr');
        this.currency = JSON.parse(_currency);
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        if (typeof this.userInfo.roleId === 'undefined') {
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
        this.getLayCreditInfo();
    };
    MyWalletAddPointsComponent.prototype.emitNewCard = function (event) {
        this.newCard = event;
    };
    MyWalletAddPointsComponent.prototype.selectCreditCard = function (cardToken) {
        this.cardToken = cardToken;
    };
    MyWalletAddPointsComponent.prototype.toggleAddcardForm = function () {
        this.showAddCardForm = !this.showAddCardForm;
    };
    MyWalletAddPointsComponent.prototype.totalNumberOfcard = function (count) {
        if (count === 0) {
            this.showAddCardForm = true;
        }
    };
    MyWalletAddPointsComponent.prototype.addNewPoints = function (event) {
        this.addedPoints = event;
        if (event && event < 10) {
            this.isDisableAddButton = true;
        }
        else if (event === 0) {
            this.isDisableAddButton = true;
        }
        else if (event === null) {
            this.isDisableAddButton = true;
        }
        else {
            this.isDisableAddButton = false;
        }
    };
    MyWalletAddPointsComponent.prototype.toggleCancellationPolicy = function () {
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
    MyWalletAddPointsComponent.prototype.addPoints = function () {
        var _this = this;
        this.loading = true;
        var data = { points: this.addedPoints, card_token: this.cardToken };
        this.userService.addNewPoints(data).subscribe(function (res) {
            _this.loading = false;
            _this.getLayCreditInfo();
            // this.toastr.success(res.message, 'Points');
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
                _this.router.navigate(['/account/lay-credit-points'], { queryParams: queryParams });
            }
            else {
                _this.router.navigate(['/account/lay-credit-points']);
            }
        }, function (error) {
            _this.loading = false;
            // this.toastr.error(error.error.message);
        });
    };
    MyWalletAddPointsComponent.prototype.getLayCreditInfo = function () {
        this.genericService.getAvailableLaycredit().subscribe(function (res) {
            document.getElementById("layPoints").innerHTML = res.total_available_points;
        }, (function (error) {
        }));
    };
    MyWalletAddPointsComponent = __decorate([
        core_1.Component({
            selector: 'app-my-wallet-add-points',
            templateUrl: './my-wallet-add-points.component.html',
            styleUrls: ['./my-wallet-add-points.component.scss']
        })
    ], MyWalletAddPointsComponent);
    return MyWalletAddPointsComponent;
}());
exports.MyWalletAddPointsComponent = MyWalletAddPointsComponent;
