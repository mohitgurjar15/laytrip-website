"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MyWalletComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var MyWalletComponent = /** @class */ (function () {
    function MyWalletComponent(travelerService, commonFunction) {
        this.travelerService = travelerService;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.pageSize = 10;
        this.perPageLimitConfig = [10, 25, 50, 100];
        this.showPaginationBar = true;
        this.isEarningPointNotFound = false;
        this.isRedeedemPointNotFound = false;
        this.loading = true;
        this.pointsLoading = true;
        this.totalItems = 0;
    }
    MyWalletComponent.prototype.ngOnInit = function () {
        this.page = 1;
        this.isEarningPointNotFound = false;
        this.isRedeedemPointNotFound = false;
        this.loading = true;
        this.limit = this.perPageLimitConfig[0];
        this.getEarnedPoint();
        this.getTotalAvailabePoints();
        this.getRedeemedPoint();
    };
    MyWalletComponent.prototype.getEarnedPoint = function () {
        var _this = this;
        this.loading = true;
        this.travelerService.getEarnedPoint(this.page, this.limit).subscribe(function (result) {
            _this.loading = false;
            _this.isEarningPointNotFound = false;
            console.log(result);
            _this.earnedPoints = result.data;
        }, function (error) {
            _this.isEarningPointNotFound = true;
            _this.loading = false;
            // this.apiError = error.message;
        });
    };
    MyWalletComponent.prototype.getDateFormat = function (date) {
        return this.commonFunction.convertDateFormat(new Date(date), 'DD/MM/YYYY');
    };
    MyWalletComponent.prototype.getTotalAvailabePoints = function () {
        var _this = this;
        this.pointsLoading = true;
        this.travelerService.getTotalAvailablePoints(this.page, this.limit).subscribe(function (result) {
            _this.pointsLoading = false;
            _this.travellerPoints = result;
        }, function (error) {
            _this.pointsLoading = false;
            // this.apiError = error.message;
        });
    };
    MyWalletComponent.prototype.pageChange = function (event) {
        this.showPaginationBar = false;
        this.page = event;
        this.getRedeemedPoint();
    };
    MyWalletComponent.prototype.getRedeemedPoint = function () {
        var _this = this;
        this.travelerService.getRedeemedPoint(this.page, this.limit).subscribe(function (result) {
            _this.redeemedPoints = result.data;
            _this.totalItems = result.TotalResult;
            _this.loading = false;
            _this.showPaginationBar = true;
            _this.isRedeedemPointNotFound = false;
        }, function (error) {
            _this.loading = false;
            _this.showPaginationBar = false;
            _this.isRedeedemPointNotFound = true;
        });
    };
    MyWalletComponent = __decorate([
        core_1.Component({
            selector: 'app-my-wallet',
            templateUrl: './my-wallet.component.html',
            styleUrls: ['./my-wallet.component.scss']
        })
    ], MyWalletComponent);
    return MyWalletComponent;
}());
exports.MyWalletComponent = MyWalletComponent;
