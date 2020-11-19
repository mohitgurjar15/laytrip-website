"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ViewHistoryComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../../environments/environment");
var ViewHistoryComponent = /** @class */ (function () {
    function ViewHistoryComponent(commonFunction, flightCommonFunction, userService, route) {
        this.commonFunction = commonFunction;
        this.flightCommonFunction = flightCommonFunction;
        this.userService = userService;
        this.route = route;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.currencySymbol = '';
    }
    ViewHistoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) { return _this.id = params['id']; });
        this.getPaytmentDetailView();
    };
    /*   ngOnChanges(changes:SimpleChanges){
        this.list = changes.item.currentValue;
        if(this.list){
          this.currencySymbol =  this.list.currency2.symbol ? this.list.currency2.symbol : '$';
        }
        if(this.list &&  this.list != 'undefined' ){
        }
      }
     */
    ViewHistoryComponent.prototype.getPaytmentDetailView = function () {
        var _this = this;
        var filterData = { bookingId: this.id };
        this.userService.getPaymentHistory(1, 1, filterData, '').subscribe(function (res) {
            // this.activeBooking = res.map 
            _this.list = res.data;
            _this.currencySymbol = _this.list[0].currency2.symbol ? _this.list[0].currency2.symbol : '$';
            /* this.showPaginationBar = true;
            this.listLength =res.total_result;
            this.loading = this.notFound  = false; */
        }, function (err) {
            /*  this.notFound = true;
             this.loading = this.showPaginationBar = false; */
        });
    };
    ViewHistoryComponent.prototype.dateConvert = function (date) {
        return this.commonFunction.convertDateFormat(new Date(date), "MM/DD/YYYY");
    };
    __decorate([
        core_1.Input()
    ], ViewHistoryComponent.prototype, "item");
    ViewHistoryComponent = __decorate([
        core_1.Component({
            selector: 'app-view-history',
            templateUrl: './view-history.component.html',
            styleUrls: ['./view-history.component.scss']
        })
    ], ViewHistoryComponent);
    return ViewHistoryComponent;
}());
exports.ViewHistoryComponent = ViewHistoryComponent;
