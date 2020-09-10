"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ResetPasswordComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var forms_1 = require("@angular/forms");
var ResetPasswordComponent = /** @class */ (function () {
    function ResetPasswordComponent(formBuilder, userService, commonFunctoin) {
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.commonFunctoin = commonFunctoin;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.valueChange = new core_1.EventEmitter();
        this.submitted = false;
        this.loading = false;
        this.apiMessage = '';
        this.resetPasswordSuccess = false;
    }
    ResetPasswordComponent.prototype.ngOnInit = function () {
        this.forgotForm = this.formBuilder.group({
            new_password: ['', [forms_1.Validators.required]],
            confirm_password: ['', [forms_1.Validators.required]],
            otp1: ['', forms_1.Validators.required],
            otp2: ['', forms_1.Validators.required],
            otp3: ['', forms_1.Validators.required],
            otp4: ['', forms_1.Validators.required],
            otp5: ['', forms_1.Validators.required],
            otp6: ['', forms_1.Validators.required]
        });
    };
    ResetPasswordComponent.prototype.openPage = function (event) {
        this.pageData = true;
        this.valueChange.emit({ key: 'reset-password', value: this.pageData });
    };
    ResetPasswordComponent.prototype.openSignInPage = function () {
        this.pageData = true;
        this.valueChange.emit({ key: 'signIn', value: this.pageData });
        $('.modal_container').removeClass('right-panel-active');
        $('.forgotpassword-container').removeClass('show_forgotpass');
    };
    ResetPasswordComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = this.loading = true;
        if (this.forgotForm.invalid) {
            this.submitted = true;
            this.loading = false;
            return;
        }
        else {
            this.loading = true;
            this.userService.forgotPassword(this.forgotForm.value).subscribe(function (data) {
                _this.submitted = false;
                _this.valueChange.emit({ key: 'signIn', value: true });
            }, function (error) {
                _this.submitted = _this.loading = false;
                _this.apiMessage = error.message;
            });
        }
    };
    __decorate([
        core_1.Input()
    ], ResetPasswordComponent.prototype, "pageData");
    __decorate([
        core_1.Output()
    ], ResetPasswordComponent.prototype, "valueChange");
    ResetPasswordComponent = __decorate([
        core_1.Component({
            selector: 'app-reset-password',
            templateUrl: './reset-password.component.html',
            styleUrls: ['./reset-password.component.scss']
        })
    ], ResetPasswordComponent);
    return ResetPasswordComponent;
}());
exports.ResetPasswordComponent = ResetPasswordComponent;
