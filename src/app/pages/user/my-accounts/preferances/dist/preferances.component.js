"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PreferancesComponent = void 0;
var core_1 = require("@angular/core");
var PreferancesComponent = /** @class */ (function () {
    function PreferancesComponent(userService, toastr) {
        this.userService = userService;
        this.toastr = toastr;
        this.loading = false;
        this.isEmailOn = false;
        this.isSmsNotifiationOn = false;
        this.loadingValue = new core_1.EventEmitter();
    }
    PreferancesComponent.prototype.ngOnInit = function () {
    };
    PreferancesComponent.prototype.notificationChnaged = function (event, type) {
        var _this = this;
        this.loadingValue.emit(true);
        var jsonBody = {
            "type": type,
            "value": event.target.checked
        };
        this.userService.changePreference(jsonBody).subscribe(function (data) {
            _this.toastr.success(data.message, 'Preference Updated');
            _this.loadingValue.emit(false);
        }, function (error) {
            _this.loadingValue.emit(false);
            _this.toastr.error(error.error.message, 'Preference Error');
        });
    };
    __decorate([
        core_1.Output()
    ], PreferancesComponent.prototype, "loadingValue");
    PreferancesComponent = __decorate([
        core_1.Component({
            selector: 'app-preferances',
            templateUrl: './preferances.component.html',
            styleUrls: ['./preferances.component.scss']
        })
    ], PreferancesComponent);
    return PreferancesComponent;
}());
exports.PreferancesComponent = PreferancesComponent;
