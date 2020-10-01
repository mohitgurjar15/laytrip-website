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
    function HistoryListComponent(commonFunction, flightCommonFunction) {
        this.commonFunction = commonFunction;
        this.flightCommonFunction = flightCommonFunction;
        this.bookingData = new core_1.EventEmitter();
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.listLength = 0;
        this.pageSize = 10;
        this.perPageLimitConfig = [10, 25, 50, 100];
        this.showPaginationBar = false;
        this.loading = true;
        this.notFound = false;
    }
    HistoryListComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.page = 1;
        this.loading = true;
        this.notFound = false;
        this.limit = this.perPageLimitConfig[0];
        setTimeout(function () {
            if (!this.list || this.list === 'undefined') {
                this.loading = this.showPaginationBar = false;
            }
        }, 1000);
    };
    HistoryListComponent.prototype.ngOnChanges = function (changes) {
        this.showPaginationBar = false;
        this.list = changes.historyResult.currentValue;
        if (this.list && this.list != 'undefined') {
            this.listLength = this.list.length;
        }
        if (this.listLength === 0) {
            this.notFound = true;
            this.showPaginationBar = this.loading = false;
        }
        else {
            this.loading = false;
        }
    };
    HistoryListComponent.prototype.ngAfterContentChecked = function () { };
    HistoryListComponent.prototype.pageChange = function (event) {
        this.loading = true;
        this.page = event;
    };
    HistoryListComponent.prototype.viewDetailClick = function (item) {
        this.item = item;
    };
    HistoryListComponent.prototype.ngDoCheck = function () {
        setTimeout(function () {
            if (this.listLength === 'undefined' || this.listLength < 0) {
                this.notFound = true;
                this.showPaginationBar = false;
            }
            else {
                this.loading = false;
            }
            if (this.listLength > 0) {
                this.notFound = false;
            }
        }, 1000);
        console.log(this.loading, this.listLength);
    };
    __decorate([
        core_1.Output()
    ], HistoryListComponent.prototype, "bookingData");
    __decorate([
        core_1.Input()
    ], HistoryListComponent.prototype, "historyResult");
    __decorate([
        core_1.Input()
    ], HistoryListComponent.prototype, "list");
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
