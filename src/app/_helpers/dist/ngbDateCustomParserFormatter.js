"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NgbDateCustomParserFormatter = exports.padNumber = exports.isNumber = exports.toInteger = void 0;
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var core_1 = require("@angular/core");
function toInteger(value) {
    return parseInt("" + value, 10);
}
exports.toInteger = toInteger;
function isNumber(value) {
    return !isNaN(toInteger(value));
}
exports.isNumber = isNumber;
function padNumber(value) {
    if (isNumber(value)) {
        return ("0" + value).slice(-2);
    }
    else {
        return '';
    }
}
exports.padNumber = padNumber;
var NgbDateCustomParserFormatter = /** @class */ (function (_super) {
    __extends(NgbDateCustomParserFormatter, _super);
    function NgbDateCustomParserFormatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NgbDateCustomParserFormatter.prototype.parse = function (value) {
        if (value) {
            var dateParts = value.trim().split('/');
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return { day: toInteger(dateParts[0]), month: null, year: null };
            }
            else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
                return { day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: null };
            }
            else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return { day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: toInteger(dateParts[2]) };
            }
        }
        return null;
    };
    NgbDateCustomParserFormatter.prototype.format = function (date) {
        return date ?
            (isNumber(date.month) ? padNumber(date.month) : '') + "/" + (isNumber(date.day) ? padNumber(date.day) : '') + "/" + date.year :
            '';
    };
    NgbDateCustomParserFormatter = __decorate([
        core_1.Injectable()
    ], NgbDateCustomParserFormatter);
    return NgbDateCustomParserFormatter;
}(ng_bootstrap_1.NgbDateParserFormatter));
exports.NgbDateCustomParserFormatter = NgbDateCustomParserFormatter;
