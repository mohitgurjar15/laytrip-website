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
    function MyWalletComponent(travelerService) {
        this.travelerService = travelerService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.pageSize = 10;
        this.perPageLimitConfig = [10, 25, 50, 100];
        this.showPaginationBar = false;
        this.isNotFound = false;
        this.loading = true;
        this.totalItems = 0;
    }
    MyWalletComponent.prototype.ngOnInit = function () {
        this.page = 1;
        this.isNotFound = false;
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
            _this.earnedPoints = result.data;
        }, function (error) {
            _this.loading = false;
            // this.apiError = error.message;
        });
    };
    MyWalletComponent.prototype.getTotalAvailabePoints = function () {
        var _this = this;
        this.travelerService.getTotalAvailablePoints(this.page, this.limit).subscribe(function (result) {
            _this.loading = false;
            _this.travellerPoints = result;
        }, function (error) {
            _this.loading = false;
            // this.apiError = error.message;
        });
    };
    MyWalletComponent.prototype.pageChange = function (event) {
        this.page = event;
        this.showPaginationBar = false;
    };
    MyWalletComponent.prototype.getRedeemedPoint = function () {
        var _this = this;
        this.travelerService.getRedeemedPoint(this.page, this.limit).subscribe(function (result) {
            _this.redeemedPoints = result.data;
            _this.loading = false;
        }, function (error) {
            _this.loading = false;
            // this.apiError = error.message;
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
