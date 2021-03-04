"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MyTravelerComponent = void 0;
var core_1 = require("@angular/core");
var MyTravelerComponent = /** @class */ (function () {
    function MyTravelerComponent(checkOutService, cd) {
        this.checkOutService = checkOutService;
        this.cd = cd;
        this.traveler = {};
    }
    MyTravelerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.checkOutService.getTravelers.subscribe(function (travelers) { return _this.travelers = travelers; });
    };
    MyTravelerComponent.prototype.selectTraveler = function (traveler) {
        traveler.traveler_number = this.traveler_number;
        this.travelerId = traveler.userId;
        this.checkOutService.selectTraveler(traveler);
        this.cd.detectChanges();
    };
    __decorate([
        core_1.Input()
    ], MyTravelerComponent.prototype, "traveler_number");
    __decorate([
        core_1.Input()
    ], MyTravelerComponent.prototype, "travelerId");
    __decorate([
        core_1.Input()
    ], MyTravelerComponent.prototype, "traveler_type");
    MyTravelerComponent = __decorate([
        core_1.Component({
            selector: 'app-my-traveler',
            templateUrl: './my-traveler.component.html',
            styleUrls: ['./my-traveler.component.scss']
        })
    ], MyTravelerComponent);
    return MyTravelerComponent;
}());
exports.MyTravelerComponent = MyTravelerComponent;
