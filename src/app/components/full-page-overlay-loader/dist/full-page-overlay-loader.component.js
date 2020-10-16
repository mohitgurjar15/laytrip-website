"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FullPageOverlayLoaderComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var FullPageOverlayLoaderComponent = /** @class */ (function () {
    function FullPageOverlayLoaderComponent() {
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.animationSpeed = 1;
    }
    FullPageOverlayLoaderComponent.prototype.ngOnInit = function () {
        this.lottieConfig = {
            path: 'https://assets3.lottiefiles.com/packages/lf20_vTKQNW.json',
            autoplay: true,
            loop: true
        };
    };
    FullPageOverlayLoaderComponent.prototype.handleAnimation = function (anim) {
        this.anim = anim;
    };
    FullPageOverlayLoaderComponent.prototype.stop = function () {
        this.anim.stop();
    };
    FullPageOverlayLoaderComponent.prototype.play = function () {
        this.anim.play();
    };
    __decorate([
        core_1.Input()
    ], FullPageOverlayLoaderComponent.prototype, "image");
    __decorate([
        core_1.Input()
    ], FullPageOverlayLoaderComponent.prototype, "module");
    __decorate([
        core_1.Input()
    ], FullPageOverlayLoaderComponent.prototype, "type");
    FullPageOverlayLoaderComponent = __decorate([
        core_1.Component({
            selector: 'app-full-page-overlay-loader',
            templateUrl: './full-page-overlay-loader.component.html',
            styleUrls: ['./full-page-overlay-loader.component.scss']
        })
    ], FullPageOverlayLoaderComponent);
    return FullPageOverlayLoaderComponent;
}());
exports.FullPageOverlayLoaderComponent = FullPageOverlayLoaderComponent;
