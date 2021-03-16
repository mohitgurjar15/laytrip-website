"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightClassComponent = void 0;
var core_1 = require("@angular/core");
var FlightClassComponent = /** @class */ (function () {
    function FlightClassComponent(eRef) {
        this.eRef = eRef;
        this.changeValue = new core_1.EventEmitter();
        this.showClass = false;
    }
    FlightClassComponent.prototype.ngOnInit = function () {
        this.loadJquery();
    };
    FlightClassComponent.prototype.loadJquery = function () {
        $("body").click(function () {
            $(".add_class_sec_open_").hide();
        });
        $(".class_sec_info").click(function (e) {
            e.stopPropagation();
            if (e.target.nextSibling.classList[2] == 'panel_show') {
                $(".add_class_sec_open_").show();
            }
            else {
                $(".add_class_sec_open_").hide();
            }
            $(".add_traveler__open").hide();
        });
        $('.add_class_sec_open_').click(function (e) {
            e.stopPropagation();
        });
    };
    FlightClassComponent.prototype.toggleTraveller = function () {
        this.showClass = !this.showClass;
    };
    FlightClassComponent.prototype.btnClickForChange = function (item) {
        this.changeValue.emit(item.value);
        this.flightClass = item.value;
        $(".add_class_sec_open_").hide();
    };
    __decorate([
        core_1.Output()
    ], FlightClassComponent.prototype, "changeValue");
    __decorate([
        core_1.Input()
    ], FlightClassComponent.prototype, "flightClass");
    FlightClassComponent = __decorate([
        core_1.Component({
            selector: 'app-flight-class',
            templateUrl: './flight-class.component.html',
            styleUrls: ['./flight-class.component.scss']
        })
    ], FlightClassComponent);
    return FlightClassComponent;
}());
exports.FlightClassComponent = FlightClassComponent;
