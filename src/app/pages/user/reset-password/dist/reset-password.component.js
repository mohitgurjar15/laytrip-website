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
var must_match_validators_1 = require("../../../_helpers/must-match.validators");
var custom_validators_1 = require("../../../_helpers/custom.validators");
var ResetPasswordComponent = /** @class */ (function () {
    function ResetPasswordComponent(formBuilder, userService, commonFunctoin, activeModal) {
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.commonFunctoin = commonFunctoin;
        this.activeModal = activeModal;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.valueChange = new core_1.EventEmitter();
        this.submitted = false;
        this.spinner = false;
        this.loading = false;
        this.resetSuccess = false;
        this.apiMessage = '';
        this.resetPasswordSuccess = false;
        this.errorMessage = '';
        this.isResend = false;
        this.otp = 0;
        this.config = {
            allowNumbersOnly: true,
            length: 6,
            isPasswordInput: false,
            disableAutoFocus: false,
            placeholder: '0',
            inputStyles: {
                'width': '64px',
                'height': '64px'
            }
        };
        this.configCountDown = { leftTime: 60, demand: false };
    }
    ResetPasswordComponent.prototype.ngOnInit = function () {
        this.resetForm = this.formBuilder.group({
            new_password: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$')]],
            confirm_password: ['', [forms_1.Validators.required]],
            otp: ['']
        }, {
            validator: [must_match_validators_1.MustMatch('new_password', 'confirm_password'), custom_validators_1.optValidation()]
        });
    };
    ResetPasswordComponent.prototype.openSignInPage = function () {
        this.activeModal.close();
        $('#sign_in_modal').modal('show');
    };
    ResetPasswordComponent.prototype.toggleFieldTextType = function (event) {
        if (event.target.id == 'passEye') {
            this.passFieldTextType = !this.passFieldTextType;
        }
        else if (event.target.id == 'cnfEye') {
            this.cnfPassFieldTextType = !this.cnfPassFieldTextType;
        }
    };
    ResetPasswordComponent.prototype.onSubmit = function () {
        var _this = this;
        console.log(this.otp);
        console.log(this.ngOtpInputRef);
        this.submitted = this.loading = true;
        if (this.resetForm.invalid && this.resetForm.hasError('otpsError')) {
            this.loading = false;
            return;
        }
        else {
            this.loading = true;
            var request_param = {
                "email": this.emailForVerifyOtp,
                "new_password": this.resetForm.value.new_password,
                "confirm_password": this.resetForm.value.confirm_password,
                "otp": this.otp
            };
            this.userService.resetPassword(request_param).subscribe(function (data) {
                _this.submitted = false;
                _this.resetSuccess = true;
            }, function (error) {
                console.log(error);
                _this.resetSuccess = _this.submitted = _this.loading = false;
                _this.apiMessage = error.error.message;
            });
        }
    };
    ResetPasswordComponent.prototype.timerComplete = function () {
        this.isResend = true;
        this.configCountDown = { leftTime: 60, demand: true };
    };
    ResetPasswordComponent.prototype.resendOtp = function () {
        var _this = this;
        this.ngOtpInputRef.setValue('');
        this.resetForm.controls.new_password.setValue(null);
        this.resetForm.controls.confirm_password.setValue(null);
        this.spinner = true;
        this.userService.forgotPassword(this.emailForVerifyOtp).subscribe(function (data) {
            _this.spinner = _this.isResend = false;
            _this.counter.begin();
        }, function (error) {
            _this.submitted = _this.spinner = false;
            _this.errorMessage = error.message;
        });
    };
    ResetPasswordComponent.prototype.onOtpChange = function (event) {
        console.log(event);
        if (event.length == 6) {
            this.otp = event;
            console.log(event.length);
            console.log(this.otp);
            this.resetForm.controls.otp.setValue(event);
            this.ngOtpInputRef.setValue(event);
        }
    };
    __decorate([
        core_1.Input()
    ], ResetPasswordComponent.prototype, "pageData");
    __decorate([
        core_1.Input()
    ], ResetPasswordComponent.prototype, "emailForVerifyOtp");
    __decorate([
        core_1.Output()
    ], ResetPasswordComponent.prototype, "valueChange");
    __decorate([
        core_1.ViewChild('ngOtpInput', { static: false })
    ], ResetPasswordComponent.prototype, "ngOtpInputRef");
    __decorate([
        core_1.ViewChild('countdown', { static: false })
    ], ResetPasswordComponent.prototype, "counter");
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
