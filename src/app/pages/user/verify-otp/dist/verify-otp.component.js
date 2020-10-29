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
var forms_1 = require("@angular/forms");
var jwt_helper_1 = require("../../../_helpers/jwt.helper");
var custom_validators_1 = require("../../../_helpers/custom.validators");
var VerifyOtpComponent = /** @class */ (function () {
    function VerifyOtpComponent(modalService, formBuilder, userService, router, commonFunctoin) {
        this.modalService = modalService;
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.router = router;
        this.commonFunctoin = commonFunctoin;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.valueChange = new core_1.EventEmitter();
        this.submitted = false;
        this.otpVerified = false;
        this.loading = false;
        this.errorMessage = '';
        this.spinner = false;
        this.apiError = '';
    }
    VerifyOtpComponent.prototype.ngOnInit = function () {
        this.otpForm = this.formBuilder.group({
            otp1: ['', forms_1.Validators.required],
            otp2: ['', forms_1.Validators.required],
            otp3: ['', forms_1.Validators.required],
            otp4: ['', forms_1.Validators.required],
            otp5: ['', forms_1.Validators.required],
            otp6: ['', forms_1.Validators.required]
        }, { validator: custom_validators_1.optValidation() });
    };
    VerifyOtpComponent.prototype.closeModal = function () {
        this.valueChange.emit({ key: 'signIn', value: true });
        $('#sign_in_modal').modal('hide');
    };
    VerifyOtpComponent.prototype.validateNumber = function (e) {
        var input = String.fromCharCode(e.charCode);
        var reg = /^[0-9]*$/;
        if (!reg.test(input)) {
            e.preventDefault();
        }
    };
    VerifyOtpComponent.prototype.openSignInPage = function () {
        $('.modal_container').removeClass('right-panel-active');
        $('.forgotpassword-container').removeClass('show_forgotpass');
        this.pageData = true;
        this.valueChange.emit({ key: 'signIn', value: this.pageData });
    };
    VerifyOtpComponent.prototype.resendOtp = function () {
        var _this = this;
        this.otpForm.reset();
        this.spinner = true;
        this.userService.resendOtp(this.emailForVerifyOtp).subscribe(function (data) {
            _this.spinner = false;
        }, function (error) {
            _this.submitted = _this.spinner = false;
            _this.apiError = error.message;
        });
    };
    VerifyOtpComponent.prototype.onInputEntry = function (event, nextInput) {
        var input = event.target;
        var length = input.value.length;
        var maxLength = input.attributes.maxlength.value;
        if (length >= maxLength) {
            nextInput.focus();
        }
    };
    VerifyOtpComponent.prototype.onSubmit = function () {
        var _this = this;
        var inputDataOtp = '';
        Object.keys(this.otpForm.controls).forEach(function (key) {
            inputDataOtp += _this.otpForm.get(key).value;
        });
        this.submitted = this.loading = true;
        if (this.otpForm.invalid) {
            if (inputDataOtp.length != 6) {
                this.errorMessage = "Please enter OTP.";
            }
            this.submitted = true;
            this.loading = false;
            return;
        }
        else {
            var data = {
                "email": this.emailForVerifyOtp,
                "otp": inputDataOtp
            };
            this.userService.verifyOtp(data).subscribe(function (data) {
                _this.otpVerified = true;
                _this.submitted = _this.loading = false;
                $('.modal_container').removeClass('right-panel-active');
                $('#sign_in_modal').modal('hide');
                localStorage.setItem("_lay_sess", data.userDetails.access_token);
                var userDetails = jwt_helper_1.getLoginUserInfo();
                var _isSubscribeNow = localStorage.getItem("_isSubscribeNow");
                if (_isSubscribeNow == "Yes" && userDetails.roleId == 6) {
                    _this.router.navigate(['account/subscription']);
                }
                else {
                    _this.valueChange.emit({ key: 'signIn', value: true });
                }
            }, function (error) {
                _this.apiError = error.message;
                _this.submitted = _this.loading = false;
            });
        }
    };
    VerifyOtpComponent.prototype.onKeydown = function (event) {
        var tabIndex = event.target.tabIndex ? '.tab' + (event.target.tabIndex - 1) : 1;
        if (event.key == 'Backspace') {
            $(tabIndex).focus();
            $('.tab' + event.target.tabIndex).val('');
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
