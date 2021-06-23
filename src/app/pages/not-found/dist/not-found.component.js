"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NotFoundComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var NotFoundComponent = /** @class */ (function () {
    function NotFoundComponent(router) {
        this.router = router;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
    }
    NotFoundComponent.prototype.ngOnInit = function () {
        window.scroll(0, 0);
        document.getElementById('loader_full_page').style.display = 'block' ? 'none' : 'block';
    };
    NotFoundComponent.prototype.closeModal = function () {
        $('#not_found_modal').modal('hide');
        this.router.navigate(['/']);
    };
    NotFoundComponent = __decorate([
        core_1.Component({
            selector: 'app-not-found',
            templateUrl: './not-found.component.html',
            styleUrls: ['./not-found.component.scss']
        })
    ], NotFoundComponent);
    return NotFoundComponent;
}());
exports.NotFoundComponent = NotFoundComponent;
