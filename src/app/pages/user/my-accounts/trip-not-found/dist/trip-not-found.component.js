"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TripNotFoundComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var TripNotFoundComponent = /** @class */ (function () {
    function TripNotFoundComponent(_location) {
        this._location = _location;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
    }
    TripNotFoundComponent.prototype.ngOnInit = function () {
    };
    TripNotFoundComponent.prototype.backClicked = function () {
        this._location.back();
    };
    TripNotFoundComponent = __decorate([
        core_1.Component({
            selector: 'app-trip-not-found',
            templateUrl: './trip-not-found.component.html',
            styleUrls: ['./trip-not-found.component.scss']
        })
    ], TripNotFoundComponent);
    return TripNotFoundComponent;
}());
exports.TripNotFoundComponent = TripNotFoundComponent;
