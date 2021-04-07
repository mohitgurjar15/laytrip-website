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
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var environment_1 = require("../../../../../../environments/environment");
var traveller_helper_1 = require("src/app/_helpers/traveller.helper");
var BookingTravelerComponent = /** @class */ (function () {
    function BookingTravelerComponent(commonFunction, checkOutService, modalService, accountService) {
        this.commonFunction = commonFunction;
        this.checkOutService = checkOutService;
        this.modalService = modalService;
        this.accountService = accountService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.travelers = {};
        this.cartItem = {};
        this.isPassportRequired = false;
        this.baggageDescription = '';
        this.moduleInfo = {};
        this.countries = [];
        this.laytrip_cart_id = '';
        this.closeResult = '';
        this.bookingId = '';
        this.laytripCartId = new core_1.EventEmitter();
    }
    BookingTravelerComponent.prototype.ngOnInit = function () {
    };
    BookingTravelerComponent.prototype.ngOnChanges = function (changes) {
        if (typeof changes['cartItem'].currentValue != 'undefined') {
            this.travelers = changes['cartItem'].currentValue.travelers;
            this.moduleInfo = changes['cartItem'].currentValue.moduleInfo;
            this.cartItem = changes['cartItem'].currentValue;
            this.bookingStatus = changes['cartItem'].currentValue.bookingStatus;
            this.moduleId = changes['cartItem'].currentValue.moduleId;
            if (this.travelers.length > 0) {
                this.travelers[0].is_passport_required = this.moduleInfo[0].is_passport_required ? this.moduleInfo[0].is_passport_required : false;
            }
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
    BookingTravelerComponent.prototype.getPhoneNoInMaskFormat = function (phNum, countryCode) {
        return countryCode + ' ' + phNum.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    };
    BookingTravelerComponent.prototype.getContryName = function (id) {
        var _this = this;
        this.checkOutService.getCountries.subscribe(function (res) {
            _this.countries = res;
        });
        var countryObj = this.countries.filter(function (item) { return item.id == id; });
        return countryObj[0].name ? countryObj[0].name : '';
    };
    BookingTravelerComponent.prototype.open = function (content, bookingId) {
        var _this = this;
        this.bookingId = bookingId;
        this.modalService.open(content, {
            windowClass: 'delete_account_window', centered: true, backdrop: 'static',
            keyboard: false
        }).result.then(function (result) {
            _this.closeResult = "Closed with: " + result;
        }, function (reason) {
            _this.closeResult = "Dismissed " + _this.getDismissReason(reason);
        });
    };
    BookingTravelerComponent.prototype.getDismissReason = function (reason) {
        if (reason === ng_bootstrap_1.ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        }
        else if (reason === ng_bootstrap_1.ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        }
        else {
            return "with: " + reason;
        }
    };
    BookingTravelerComponent.prototype.cancelBooking = function () {
        var _this = this;
        // this.upCommingloadingValue.emit(true);
        this.accountService.cancelBooking(this.bookingId).subscribe(function (data) {
            _this.laytripCartId.emit(_this.bookingId);
            // this.upCommingloadingValue.emit(false);
            _this.modalService.dismissAll();
        }, function (error) {
            // this.upCommingloadingValue.emit(false);
            _this.modalService.dismissAll();
        });
    };
    BookingTravelerComponent.prototype.openChat = function () {
        window.fcWidget.open();
        this.modalService.dismissAll();
    };
    BookingTravelerComponent.prototype.getUserType = function (traveler) {
        if (typeof traveler.travelerInfo.user_type != 'undefined') {
            return traveller_helper_1.travlerLabels.en[traveler.travelerInfo.user_type];
        }
        else {
            var user_type = '';
            var ageDiff = moment(new Date()).diff(moment(traveler.travelerInfo.dob, 'MM/DD/YYYY').format('YYYY-MM-DD'), "years");
            if (ageDiff > 0 && ageDiff <= 2) {
                user_type = 'infant';
            }
            if (ageDiff > 2 && ageDiff <= 12) {
                user_type = 'child';
            }
            if (ageDiff > 12) {
                user_type = 'adult';
            }
            return traveller_helper_1.travlerLabels.en[user_type];
        }
    };
    __decorate([
        core_1.Input()
    ], BookingTravelerComponent.prototype, "travelers");
    __decorate([
        core_1.Input()
    ], BookingTravelerComponent.prototype, "cartItem");
    __decorate([
        core_1.Input()
    ], BookingTravelerComponent.prototype, "isPassportRequired");
    __decorate([
        core_1.Input()
    ], BookingTravelerComponent.prototype, "laytrip_cart_id");
    __decorate([
        core_1.Output()
    ], BookingTravelerComponent.prototype, "laytripCartId");
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
