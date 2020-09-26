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
var HistoryListComponent = /** @class */ (function () {
    function HistoryListComponent(commonFunction, flightCommonFunction) {
        this.commonFunction = commonFunction;
        this.flightCommonFunction = flightCommonFunction;
        this.bookingData = new core_1.EventEmitter();
    }
    HistoryListComponent.prototype.ngOnInit = function () {
    };
    HistoryListComponent.prototype.ngOnChanges = function (changes) {
        this.list = changes.historyResult.currentValue;
        console.log("length", this.list.length);
        if (this.list && this.list != 'undefined') {
        }
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
