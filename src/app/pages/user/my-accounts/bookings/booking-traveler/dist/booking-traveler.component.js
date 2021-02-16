"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BookingTravelerComponent = void 0;
var core_1 = require("@angular/core");
var moment = require("moment");
var BookingTravelerComponent = /** @class */ (function () {
    function BookingTravelerComponent(commonFunction) {
        this.commonFunction = commonFunction;
        this.travelers = {};
        this.isPassportRequired = false;
        this.baggageDescription = '';
        this.moduleInfo = {};
    }
    BookingTravelerComponent.prototype.ngOnInit = function () {
    };
    BookingTravelerComponent.prototype.ngOnChanges = function (changes) {
        if (typeof changes['travelers'].currentValue != 'undefined') {
            this.travelers = changes['travelers'].currentValue.travelers;
            this.moduleInfo = changes['travelers'].currentValue.moduleInfo;
        }
    };
    BookingTravelerComponent.prototype.formatBaggageDescription = function (cabbinBaggage, checkInBaggage) {
        var cabbinBaggageWight;
        var checkInBaggageWight;
        var description = '';
        if (typeof (cabbinBaggage) != 'undefined' && cabbinBaggage != "" && cabbinBaggage.includes("KG") == true) {
            cabbinBaggageWight = this.convertKgToLB(cabbinBaggage.replace("KG", ""));
            description = "Cabin bag upto " + cabbinBaggageWight + " lbs (" + cabbinBaggage + ")";
        }
        else if (typeof (cabbinBaggage) != 'undefined' && cabbinBaggage != '') {
            description = "Cabin bag upto " + cabbinBaggage;
        }
        if (typeof (checkInBaggage) != 'undefined' && checkInBaggage != "" && checkInBaggage.includes("KG") == true) {
            checkInBaggageWight = this.convertKgToLB(checkInBaggage.replace("KG", ""));
            if (description != '') {
                description += " and checkin bag upto " + checkInBaggageWight + " lbs (" + checkInBaggage + ")";
            }
            else {
                description += "checkin bag upto " + checkInBaggageWight + " lbs (" + checkInBaggage + ")";
            }
        }
        else if (typeof (checkInBaggage) != 'undefined' && checkInBaggage != '') {
            if (description != '') {
                description += " and checkin bag upto " + checkInBaggage;
            }
            else {
                description += "checkin bag upto " + checkInBaggage;
            }
        }
        return description;
    };
    BookingTravelerComponent.prototype.convertKgToLB = function (weight) {
        return (2.20462 * Number(weight)).toFixed(2);
    };
    BookingTravelerComponent.prototype.getGender = function (type) {
        if (type == 'M')
            return 'Male';
        else if (type == 'F')
            return 'Female';
        else
            return 'Other';
    };
    BookingTravelerComponent.prototype.checkIsChild = function (dob) {
        // console.log(dob);
        var adult12YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
        var child2YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
        var travellerDob = moment(dob).format('YYYY-MM-DD');
        if (travellerDob < adult12YrPastDate) {
            return true;
        }
        else if (travellerDob < child2YrPastDate) {
            return false;
        }
        else {
            return false;
        }
    };
    __decorate([
        core_1.Input()
    ], BookingTravelerComponent.prototype, "travelers");
    __decorate([
        core_1.Input()
    ], BookingTravelerComponent.prototype, "isPassportRequired");
    BookingTravelerComponent = __decorate([
        core_1.Component({
            selector: 'app-booking-traveler',
            templateUrl: './booking-traveler.component.html',
            styleUrls: ['./booking-traveler.component.scss']
        })
    ], BookingTravelerComponent);
    return BookingTravelerComponent;
}());
exports.BookingTravelerComponent = BookingTravelerComponent;
