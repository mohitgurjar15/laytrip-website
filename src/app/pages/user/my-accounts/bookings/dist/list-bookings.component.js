"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ListBookingsComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var ListBookingsComponent = /** @class */ (function () {
    function ListBookingsComponent(userService, commonFunction, formBuilder) {
        this.userService = userService;
        this.commonFunction = commonFunction;
        this.formBuilder = formBuilder;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
        this.flightLists = [];
        this.perPageLimitConfig = [10, 25, 50, 100];
        this.startMinDate = new Date();
    }
    ListBookingsComponent.prototype.ngOnInit = function () {
        // this.loading = true;
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
    ListBookingsComponent.prototype.getModule = function () {
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
    ListBookingsComponent.prototype.getFlightResult = function () {
        this.result = this.filterForm.value;
        this.loading = true;
    };
    ListBookingsComponent.prototype.startDateUpdate = function (date) {
        this.endDate = new Date(date);
    };
    ListBookingsComponent = __decorate([
        core_1.Component({
            selector: 'app-list-bookings',
            templateUrl: './list-bookings.component.html',
            styleUrls: ['./list-bookings.component.scss']
        })
    ], ListBookingsComponent);
    return ListBookingsComponent;
}());
exports.ListBookingsComponent = ListBookingsComponent;
