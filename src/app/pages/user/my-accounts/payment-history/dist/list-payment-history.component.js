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
var ListPaymentHistoryComponent = /** @class */ (function () {
    function ListPaymentHistoryComponent(userService, commonFunction, formBuilder) {
        this.userService = userService;
        this.commonFunction = commonFunction;
        this.formBuilder = formBuilder;
        this.loading = true;
        this.isNotFound = false;
        this.perPageLimitConfig = [10, 25, 50, 100];
    }
    ListPaymentHistoryComponent.prototype.ngOnInit = function () {
        this.loading = true;
        this.pageNumber = 1;
        this.limit = this.perPageLimitConfig[0];
        this.getPaymentHistory();
        this.filterForm = this.formBuilder.group({
            bookingId: [''],
            start_date: [''],
            end_date: [''],
            module: ['']
        });
    };
    ListPaymentHistoryComponent.prototype.getPaymentHistory = function () {
        var _this = this;
        this.userService.getPaymentHistory(this.pageNumber, this.limit).subscribe(function (res) {
            _this.historyResult = res.data;
            _this.isNotFound = false;
            _this.loading = false;
        }, function (err) {
            _this.isNotFound = true;
            if (err && err.status === 404) {
                _this.loading = false;
            }
        });
    };
    ListPaymentHistoryComponent.prototype.onSubmit = function () {
        if (this.filterForm.invalid) {
            this.loading = false;
            return;
        }
        else {
            console.log(this.filterForm.value);
        }
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
