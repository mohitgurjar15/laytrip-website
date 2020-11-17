"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AddGuestCardComponent = void 0;
var core_1 = require("@angular/core");
var moment = require("moment");
var AddGuestCardComponent = /** @class */ (function () {
    function AddGuestCardComponent() {
        this.emitGuestCardDetails = new core_1.EventEmitter();
        this.cardDetails = {};
        this.locale = {
            format: 'MM/YYYY',
            displayFormat: 'MM/YYYY'
        };
        this.isValidFirstName = true;
        this.isValidLastName = true;
        this.isValidCardNumber = true;
        this.isValidCvv = true;
        this.isValidExpiry = true;
        this.expiryMinDate = new Date();
        this.mask = {
            guide: false,
            showMask: false,
            mask: [
                /\d/, /\d/, /\d/, /\d/, ' ',
                /\d/, /\d/, /\d/, /\d/, ' ',
                /\d/, /\d/, /\d/, /\d/, ' ',
                /\d/, /\d/, /\d/, /\d/, ' ',
                /\d/, /\d/, /\d/, /\d/
            ]
        };
        this.cvvNoMask = {
            guide: false,
            showMask: false,
            mask: [
                /\d/, /\d/, /\d/, /\d/
            ]
        };
    }
    AddGuestCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.validateCardDetails.subscribe(function (event) {
            _this.validateCard(event);
        });
    };
    AddGuestCardComponent.prototype.handleCardDetails = function (event) {
        this.cardDetails[event.target.name] = event.target.value.replace(/\s/g, "");
        this.emitGuestCardDetails.emit(this.cardDetails);
    };
    AddGuestCardComponent.prototype.expiryDateUpdate = function (event) {
        //console.log("event",this.expiryDate)
        this.cardDetails.expiry = moment(this.expiryDate).format('MM/YYYY');
        this.emitGuestCardDetails.emit(this.cardDetails);
    };
    AddGuestCardComponent.prototype.validateCard = function (event) {
        if (typeof event.first_name == 'undefined' || event.first_name == '')
            this.isValidFirstName = false;
        else
            this.isValidFirstName = true;
        if (typeof event.last_name == 'undefined' || event.last_name == '')
            this.isValidLastName = false;
        else
            this.isValidLastName = true;
        if (typeof event.card_number == 'undefined' || event.card_number == '')
            this.isValidCardNumber = false;
        else
            this.isValidCardNumber = true;
        if (typeof event.expiry == 'undefined' || event.expiry == '')
            this.isValidExpiry = false;
        else
            this.isValidExpiry = true;
        if (typeof event.card_cvv == 'undefined' || event.card_cvv == '')
            this.isValidCvv = false;
        else
            this.isValidCvv = true;
    };
    __decorate([
        core_1.Output()
    ], AddGuestCardComponent.prototype, "emitGuestCardDetails");
    __decorate([
        core_1.Input()
    ], AddGuestCardComponent.prototype, "validateCardDetails");
    AddGuestCardComponent = __decorate([
        core_1.Component({
            selector: 'app-add-guest-card',
            templateUrl: './add-guest-card.component.html',
            styleUrls: ['./add-guest-card.component.scss']
        })
    ], AddGuestCardComponent);
    return AddGuestCardComponent;
}());
exports.AddGuestCardComponent = AddGuestCardComponent;
