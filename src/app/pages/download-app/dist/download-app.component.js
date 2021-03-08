"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DownloadAppComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../environments/environment");
var DownloadAppComponent = /** @class */ (function () {
    function DownloadAppComponent(formBuilder, userService, toastr) {
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.toastr = toastr;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.submitted = false;
        this.loading = false;
        this.success = false;
    }
    DownloadAppComponent.prototype.ngOnInit = function () {
        window.scroll(0, 0);
        this.subscribeForm = this.formBuilder.group({
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]]
        });
    };
    DownloadAppComponent.prototype.subscribeNow = function () {
        var _this = this;
        this.submitted = this.loading = true;
        if (this.subscribeForm.invalid) {
            this.submitted = true;
            this.loading = false;
            return;
        }
        else {
            this.userService.subscribeNow(this.subscribeForm.value.email).subscribe(function (data) {
                _this.submitted = _this.loading = false;
                _this.success = true;
                // this.toastr.success(data.message, 'Subscribed Successful');
            }, function (error) {
                _this.submitted = _this.loading = _this.success = false;
                // this.toastr.error(error.error.message, 'Subscribed Error');
            });
        }
    };
    DownloadAppComponent = __decorate([
        core_1.Component({
            selector: 'app-download-app',
            templateUrl: './download-app.component.html',
            styleUrls: ['./download-app.component.scss']
        })
    ], DownloadAppComponent);
    return DownloadAppComponent;
}());
exports.DownloadAppComponent = DownloadAppComponent;
