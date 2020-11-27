"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ListPaymentHistoryComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var ListPaymentHistoryComponent = /** @class */ (function () {
    function ListPaymentHistoryComponent(userService, commonFunction, formBuilder) {
        this.userService = userService;
        this.commonFunction = commonFunction;
        this.formBuilder = formBuilder;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = true;
        this.perPageLimitConfig = [10, 25, 50, 100];
        this.startMinDate = new Date();
        this.notFound = false;
    }
    ListPaymentHistoryComponent.prototype.ngOnInit = function () {
        window.scroll(0, 0);
        this.loading = true;
        this.pageNumber = 1;
        this.limit = this.perPageLimitConfig[0];
        this.getModule();
        this.filterForm = this.formBuilder.group({
            bookingId: [''],
            start_date: [''],
            end_date: [''],
            module: ['']
        });
    };
    ListPaymentHistoryComponent.prototype.tabClick = function () {
        this.filterForm.reset();
        this.historyResult = {};
    };
    ListPaymentHistoryComponent.prototype.getPaymentHistory = function () {
        this.historyResult = this.filterForm.value;
        this.loading = true;
        /* this.userService.getPaymentHistory(this.pageNumber, this.limit,this.filterForm.value,1).subscribe((res: any) => {
            this.historyResult = res.data;
            this.loading = this.notFound  = false;
        }, err => {
          this.notFound = true;
          this.loading = false;
  
          if (err && err.status === 404) {
          }
        });  */
    };
    ListPaymentHistoryComponent.prototype.getBookingHistory = function (event) {
        this.itemDetail = event;
    };
    ListPaymentHistoryComponent.prototype.getModule = function () {
        var _this = this;
        this.userService.getModules(this.pageNumber, this.limit).subscribe(function (res) {
            _this.modules = res.data.map(function (module) {
                if (module.status) {
                    return {
                        id: module.id,
                        name: module.name.toUpperCase()
                    };
                }
            });
        }, function (err) {
        });
    };
    ListPaymentHistoryComponent.prototype.startDateUpdate = function (date) {
        this.endDate = new Date(date);
    };
    ListPaymentHistoryComponent.prototype.reset = function () {
        this.ngOnInit();
        this.getPaymentHistory();
    };
    ListPaymentHistoryComponent = __decorate([
        core_1.Component({
            selector: 'app-list-payment-history',
            templateUrl: './list-payment-history.component.html',
            styleUrls: ['./list-payment-history.component.scss']
        })
    ], ListPaymentHistoryComponent);
    return ListPaymentHistoryComponent;
}());
exports.ListPaymentHistoryComponent = ListPaymentHistoryComponent;
