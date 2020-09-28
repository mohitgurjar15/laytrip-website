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
    }
    HistoryListComponent.prototype.ngOnInit = function () {
        this.page = 1;
        this.limit = this.perPageLimitConfig[0];
    };
    HistoryListComponent.prototype.ngOnChanges = function (changes) {
        this.showPaginationBar = true;
        this.list = changes.historyResult.currentValue;
        if (this.list && this.list != 'undefined') {
            this.listLength = this.list.length;
        }
    };
    HistoryListComponent.prototype.pageChange = function (event) {
        // this.showPaginationBar = false;
        this.page = event;
    };
    HistoryListComponent.prototype.viewDetailClick = function (item) {
        this.item = item;
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
