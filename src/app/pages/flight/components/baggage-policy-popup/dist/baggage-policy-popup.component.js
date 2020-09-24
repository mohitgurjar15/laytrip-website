"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BaggagePolicyPopupComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var BaggagePolicyPopupComponent = /** @class */ (function () {
    function BaggagePolicyPopupComponent(flightService, route) {
        this.flightService = flightService;
        this.route = route;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loadBaggageDetails = false;
        this.baggageDetails = [];
        this.isError = false;
    }
    BaggagePolicyPopupComponent.prototype.ngOnInit = function () {
        var routeCode = this.route.snapshot.paramMap.get('rc');
        this.getBaggageDetails(routeCode);
    };
    BaggagePolicyPopupComponent.prototype.getBaggageDetails = function (routeCode) {
        var _this = this;
        this.loadBaggageDetails = true;
        this.flightService.getBaggageDetails(routeCode).subscribe(function (data) {
            _this.baggageDetails = data;
            _this.loadBaggageDetails = false;
        }, function (error) {
            _this.isError = true;
            _this.loadBaggageDetails = false;
            _this.errorMessage = error.message;
        });
    };
    BaggagePolicyPopupComponent = __decorate([
        core_1.Component({
            selector: 'app-baggage-policy-popup',
            templateUrl: './baggage-policy-popup.component.html',
            styleUrls: ['./baggage-policy-popup.component.scss']
        })
    ], BaggagePolicyPopupComponent);
    return BaggagePolicyPopupComponent;
}());
exports.BaggagePolicyPopupComponent = BaggagePolicyPopupComponent;
