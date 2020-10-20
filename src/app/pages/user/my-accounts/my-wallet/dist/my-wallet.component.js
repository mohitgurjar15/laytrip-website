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
        this.showReedemPaginationBar = true;
        this.isEarningPointNotFound = false;
        this.isRedeedemPointNotFound = false;
        this.loading = true;
        this.reedemloading = true;
        this.pointsLoading = true;
        this.totalItems = 0;
        this.totalReedemItems = 0;
    }
    MyWalletComponent.prototype.ngOnInit = function () {
        this.page = 1;
        this.page2 = 1;
        this.isEarningPointNotFound = false;
        this.isRedeedemPointNotFound = false;
        this.loading = true;
        this.reedemloading = true;
        this.limit = this.perPageLimitConfig[0];
        this.getEarnedPoint();
        this.getRedeemedPoint();
        this.getTotalAvailabePoints();
    };
    MyWalletComponent.prototype.getEarnedPoint = function () {
        var _this = this;
        this.loading = true;
        this.travelerService.getEarnedPoint(this.page, this.limit).subscribe(function (result) {
            _this.loading = false;
            _this.totalItems = result.TotalResult;
            _this.isEarningPointNotFound = false;
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
        this.page = event;
        this.loading = true;
        this.showPaginationBar = true;
        this.getEarnedPoint();
    };
    MyWalletComponent.prototype.reedemPageChange = function (event) {
        console.log('reedem');
        this.reedemloading = true;
        this.showReedemPaginationBar = true;
        this.getRedeemedPoint();
    };
    MyWalletComponent.prototype.getRedeemedPoint = function () {
        var _this = this;
        console.log(this.page, this.limit);
        this.travelerService.getRedeemedPoint(this.page2, this.limit).subscribe(function (result) {
            _this.showReedemPaginationBar = true;
            _this.redeemedPoints = result.data;
            _this.totalReedemItems = result.TotalResult;
            _this.reedemloading = _this.isRedeedemPointNotFound = false;
        }, function (error) {
            _this.isRedeedemPointNotFound = true;
            _this.reedemloading = _this.showReedemPaginationBar = false;
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
