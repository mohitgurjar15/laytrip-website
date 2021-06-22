"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LaytripLoaderComponent = void 0;
var core_1 = require("@angular/core");
var LaytripLoaderComponent = /** @class */ (function () {
    function LaytripLoaderComponent(spinner) {
        this.spinner = spinner;
    }
    LaytripLoaderComponent.prototype.ngOnInit = function () {
        var lottie_path = '';
        /*
        this.lottieConfig = {
          path: lottie_path,
          autoplay: true,
          loop: true
        }; */
    };
    __decorate([
        core_1.Input()
    ], LaytripLoaderComponent.prototype, "loading");
    __decorate([
        core_1.Input()
    ], LaytripLoaderComponent.prototype, "module");
    LaytripLoaderComponent = __decorate([
        core_1.Component({
            selector: 'app-laytrip-loader',
            templateUrl: './laytrip-loader.component.html',
            styleUrls: ['./laytrip-loader.component.scss']
        })
    ], LaytripLoaderComponent);
    return LaytripLoaderComponent;
}());
exports.LaytripLoaderComponent = LaytripLoaderComponent;
