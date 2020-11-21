"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HistoryListComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../../environments/environment");
var HistoryListComponent = /** @class */ (function () {
    function HistoryListComponent(commonFunction, flightCommonFunction, userService, router) {
        this.commonFunction = commonFunction;
        this.flightCommonFunction = flightCommonFunction;
        this.userService = userService;
        this.router = router;
        this.bookingData = new core_1.EventEmitter();
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.list = [];
        this.filterData = {};
        this.filterInfo = {};
        this.listLength = 0;
        this.pageSize = 10;
        this.loading = true;
        this.perPageLimitConfig = [10, 25, 50, 100];
        this.showPaginationBar = false;
        this.notFound = false;
        this.activeBookings = [];
        this.failedBookings = [];
    }
    HistoryListComponent.prototype.ngOnInit = function () {
        this.page = 1;
        this.limit = this.perPageLimitConfig[0];
        this.getPaymentHistory();
    };
    HistoryListComponent.prototype.ngOnChanges = function (changes) {
        this.filterData = changes.historyResult.currentValue;
        if (this.filterData) {
            this.showPaginationBar = false;
            this.getPaymentHistory();
        }
    };
    HistoryListComponent.prototype.getPaymentHistory = function () {
        var _this = this;
        this.loading = true;
        this.filterInfo = null;
        if (this.filterData != 'undefined') {
            this.filterInfo = this.filterData;
        }
        this.userService.getPaymentHistory(this.page, this.limit, this.filterInfo, this.payment_status).subscribe(function (res) {
            // this.activeBooking = res.map 
            _this.list = res.data;
            _this.showPaginationBar = true;
            _this.listLength = res.total_result;
            _this.loading = _this.notFound = false;
        }, function (err) {
            _this.notFound = true;
            _this.loading = _this.showPaginationBar = false;
        });
    };
    HistoryListComponent.prototype.pageChange = function (event) {
        window.scroll(0, 0);
        this.showPaginationBar = false;
        this.page = event;
        this.getPaymentHistory();
    };
    HistoryListComponent.prototype.viewDetailClick = function (item) {
        this.item = item;
        this.router.navigate(['/account/payment/detail/' + item.laytripBookingId]);
    };
    HistoryListComponent.prototype.dateConvert = function (date) {
        return this.commonFunction.convertDateFormat(new Date(date), "MM/DD/YYYY");
    };
    HistoryListComponent.prototype.getPercentage1 = function (value, totalValue, type) {
        var configValue = document.querySelector('.progress-bar');
        // configValue.style.left = setLeft();
        configValue.style.width = 24;
        /* if(type ==1){
          return "width:"+Math.floor((value/totalValue)*100)+"%;";
        } else {
          return "left:"+Math.floor((value/totalValue)*100)+"%;";
        } */
    };
    HistoryListComponent.prototype.getPercentage = function (value, totalValue, type) {
        if (type == 1) {
            return { 'width': (Math.floor((value / totalValue) * 100) + 2) + '%' }; //"width:"+Math.floor((value/totalValue)*100)+"%;";
        }
        else {
            return { 'left': Math.floor((value / totalValue) * 100) + '%' };
        }
        var styles = { 'width': '25%' };
        return styles;
    };
    __decorate([
        core_1.Output()
    ], HistoryListComponent.prototype, "bookingData");
    __decorate([
        core_1.Input()
    ], HistoryListComponent.prototype, "historyResult");
    __decorate([
        core_1.Input()
    ], HistoryListComponent.prototype, "payment_status");
    HistoryListComponent = __decorate([
        core_1.Component({
            selector: 'app-history-list',
            templateUrl: './history-list.component.html',
            styleUrls: ['./history-list.component.scss']
        })
    ], HistoryListComponent);
    return HistoryListComponent;
}());
exports.HistoryListComponent = HistoryListComponent;
