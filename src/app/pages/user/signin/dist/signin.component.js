"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SigninComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var forms_1 = require("@angular/forms");
var jwt_helper_1 = require("../../../_helpers/jwt.helper");
var verify_otp_component_1 = require("../verify-otp/verify-otp.component");
var forgot_password_component_1 = require("../forgot-password/forgot-password.component");
var SigninComponent = /** @class */ (function () {
    function SigninComponent(modalService, formBuilder, userService, router, commonFunction, renderer) {
        this.modalService = modalService;
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.renderer = renderer;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.signUpModal = false;
        this.signInModal = true;
        this.submitted = false;
        this.apiError = '';
        this.loading = false;
        this.userNotVerify = false;
        this.emailForVerifyOtp = '';
        this.valueChange = new core_1.EventEmitter();
    }
    SigninComponent.prototype.ngOnInit = function () {
        this.loginForm = this.formBuilder.group({
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
            password: ['', [forms_1.Validators.required]]
        });
    };
    Object.defineProperty(SigninComponent.prototype, "f", {
        get: function () { return this.loginForm.controls; },
        enumerable: false,
        configurable: true
    });
    SigninComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = false;
        this.loading = true;
        if (this.loginForm.invalid) {
            this.submitted = true;
            this.loading = false;
            return;
        }
        else {
            this.userService.signin(this.loginForm.value).subscribe(function (data) {
                if (data.token) {
                    localStorage.setItem("_lay_sess", data.token);
                    var userDetails = jwt_helper_1.getLoginUserInfo();
                    $('#sign_in_modal').modal('hide');
                    _this.loading = _this.submitted = false;
                    var _isSubscribeNow = localStorage.getItem("_isSubscribeNow");
                    if (_isSubscribeNow == "Yes" && userDetails.roleId == 6) {
                        _this.router.navigate(['account/subscription']);
                    }
                    else {
                        var urlData_1 = _this.commonFunction.decodeUrl(_this.router.url);
                        _this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
                            _this.router.navigate(["" + urlData_1.url], { queryParams: urlData_1.params });
                        });
                    }
                }
            }, function (error) {
                _this.submitted = _this.loading = false;
                if (error.status == 406) {
                    _this.emailForVerifyOtp = _this.loginForm.value.email;
                    _this.userNotVerify = true;
                    _this.apiError = '';
                }
                else {
                    _this.apiError = error.message;
                }
            });
        }
    };
    SigninComponent.prototype.emailVerify = function () {
        var _this = this;
        this.userService.resendOtp(this.emailForVerifyOtp).subscribe(function (data) {
            _this.openOtpPage();
        }, function (error) {
            _this.userNotVerify = false;
            _this.apiError = error.message;
        });
    };
    SigninComponent.prototype.toggleFieldTextType = function () {
        this.fieldTextType = !this.fieldTextType;
    };
    SigninComponent.prototype.socialError = function (error) {
        this.apiError = error;
    };
    SigninComponent.prototype.closeModal = function () {
        this.apiError = '';
        $('#sign_in_modal').modal('hide');
    };
    SigninComponent.prototype.btnSignUpClick = function () {
        var _this = this;
        $('#sign_in_modal').modal('hide');
        $('#sign_up_modal').modal('show');
        $("#signup-form").trigger("reset");
        setTimeout(function () {
            _this.renderer.addClass(document.body, 'modal-open');
        }, 1500);
    };
    SigninComponent.prototype.openOtpPage = function () {
        $('#sign_in_modal').modal('hide');
        var modalRef = this.modalService.open(verify_otp_component_1.VerifyOtpComponent, {
            windowClass: 'otp_window',
            centered: true,
            backdrop: 'static',
            keyboard: false
        });
        modalRef.componentInstance.emailForVerifyOtp = this.emailForVerifyOtp;
        modalRef.componentInstance.isUserNotVerify = true;
    };
    SigninComponent.prototype.openForgotPassModal = function () {
        $('#sign_in_modal').modal('hide');
        this.modalService.open(forgot_password_component_1.ForgotPasswordComponent, { windowClass: 'forgot_window', centered: true, backdrop: 'static',
            keyboard: false
        });
    };
    __decorate([
        core_1.Input()
    ], SigninComponent.prototype, "pageData");
    __decorate([
        core_1.Input()
    ], SigninComponent.prototype, "resetRecaptcha");
    __decorate([
        core_1.Output()
    ], SigninComponent.prototype, "valueChange");
    SigninComponent = __decorate([
        core_1.Component({
            selector: 'app-signin',
            templateUrl: './signin.component.html',
            styleUrls: ['./signin.component.scss']
        })
    ], SigninComponent);
    return SigninComponent;
}());
exports.SigninComponent = SigninComponent;
