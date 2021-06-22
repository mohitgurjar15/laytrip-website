"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VerifyOtpComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var jwt_helper_1 = require("../../../_helpers/jwt.helper");
var custom_validators_1 = require("../../../_helpers/custom.validators");
var VerifyOtpComponent = /** @class */ (function () {
    function VerifyOtpComponent(modalService, formBuilder, userService, router, commonFunction, activeModal) {
        this.modalService = modalService;
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.activeModal = activeModal;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.valueChange = new core_1.EventEmitter();
        this.submitted = false;
        this.otpVerified = false;
        this.otpLengthError = false;
        this.loading = false;
        this.errorMessage = '';
        this.spinner = false;
        this.isUserNotVerify = false;
        this.isSignup = false;
        this.apiError = '';
        this.config = {
            allowNumbersOnly: true,
            length: 6,
            isPasswordInput: false,
            disableAutoFocus: false,
            placeholder: '',
            inputStyles: {
                'width': '64px',
                'height': '64px'
            }
        };
        this.isResend = false;
        this.otp = 0;
        this.configCountDown = { leftTime: 60, demand: false };
        this.isTimerEnable = true;
        this.guestUserId = '';
    }
    VerifyOtpComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.otpForm = this.formBuilder.group({
            otp: ['']
        }, { validator: custom_validators_1.optValidation() });
        setTimeout(function () {
            _this.isResend = true;
        }, 60000);
        this.guestUserId = localStorage.getItem('__gst') || '';
    };
    VerifyOtpComponent.prototype.timerComplete = function () {
        this.isResend = true;
        this.isTimerEnable = false;
        this.configCountDown = { leftTime: 60, demand: true };
    };
    VerifyOtpComponent.prototype.onOtpChange = function (event) {
        this.otp = event;
        if (event.length == 6) {
            this.otpForm.controls.otp.setValue(event);
            this.ngOtpInputRef.setValue(event);
        }
    };
    VerifyOtpComponent.prototype.resendOtp = function () {
        var _this = this;
        if (this.isResend) {
            this.configCountDown = { leftTime: 60, demand: true };
            this.ngOtpInputRef.setValue('');
            this.spinner = true;
            this.userService.resendOtp(this.emailForVerifyOtp).subscribe(function (data) {
                _this.spinner = _this.isResend = _this.otpLengthError = false;
                _this.isTimerEnable = true;
                _this.apiError = '';
                setTimeout(function () {
                    _this.counter.begin();
                }, 1000);
            }, function (error) {
                _this.submitted = _this.spinner = _this.otpLengthError = false;
                _this.apiError = error.message;
            });
        }
    };
    VerifyOtpComponent.prototype.onInputEntry = function (event, nextInput) {
        var input = event.event;
        var length = input.value.length;
        var maxLength = input.attributes.maxlength.value;
        if (length >= maxLength) {
            nextInput.focus();
        }
    };
    VerifyOtpComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = this.loading = true;
        var otpValue = '';
        var otps = this.ngOtpInputRef.otpForm.value;
        Object.values(otps).forEach(function (v) {
            otpValue += v;
        });
        this.otpLengthError = false;
        if (otpValue.length != 6) {
            this.otpLengthError = true;
        }
        if (this.otpForm.hasError('otpsError') || otpValue.length != 6) {
            this.submitted = true;
            this.loading = false;
            return;
        }
        else {
            var data = {
                "email": this.emailForVerifyOtp,
                "otp": otpValue
            };
            this.userService.verifyOtp(data).subscribe(function (data) {
                _this.otpVerified = true;
                _this.submitted = _this.loading = false;
                localStorage.setItem("_lay_sess", data.userDetails.access_token);
                var userDetails = jwt_helper_1.getLoginUserInfo();
                if (_this.guestUserId) {
                    _this.userService.mapGuestUser(_this.guestUserId).subscribe(function (res) {
                        localStorage.setItem('$cartOver', res.cartOverLimit);
                        var urlData = _this.commonFunction.decodeUrl(_this.router.url);
                        _this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
                            _this.router.navigate(["" + urlData.url], { queryParams: urlData.params });
                        });
                    });
                }
                else {
                    var urlData_1 = _this.commonFunction.decodeUrl(_this.router.url);
                    _this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
                        _this.router.navigate(["" + urlData_1.url], { queryParams: urlData_1.params });
                    });
                }
                var _isSubscribeNow = localStorage.getItem("_isSubscribeNow");
                if (_isSubscribeNow == "Yes" && userDetails.roleId == 6) {
                    _this.router.navigate(['account/subscription']);
                }
            }, function (error) {
                _this.apiError = error.message;
                _this.submitted = _this.loading = false;
            });
        }
    };
    __decorate([
        core_1.Input()
    ], VerifyOtpComponent.prototype, "pageData");
    __decorate([
        core_1.Output()
    ], VerifyOtpComponent.prototype, "valueChange");
    __decorate([
        core_1.Input()
    ], VerifyOtpComponent.prototype, "emailForVerifyOtp");
    __decorate([
        core_1.Input()
    ], VerifyOtpComponent.prototype, "isUserNotVerify");
    __decorate([
        core_1.Input()
    ], VerifyOtpComponent.prototype, "isSignup");
    __decorate([
        core_1.ViewChild('ngOtpInput', { static: false })
    ], VerifyOtpComponent.prototype, "ngOtpInputRef");
    __decorate([
        core_1.ViewChild('countdown', { static: false })
    ], VerifyOtpComponent.prototype, "counter");
    VerifyOtpComponent = __decorate([
        core_1.Component({
            selector: 'app-verify-otp',
            templateUrl: './verify-otp.component.html',
            styleUrls: ['./verify-otp.component.scss']
        })
    ], VerifyOtpComponent);
    return VerifyOtpComponent;
}());
exports.VerifyOtpComponent = VerifyOtpComponent;
