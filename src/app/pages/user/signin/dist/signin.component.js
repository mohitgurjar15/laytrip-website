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
var SigninComponent = /** @class */ (function () {
    function SigninComponent(modalService, formBuilder, userService, router, commonFunction) {
        this.modalService = modalService;
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.signUpModal = false;
        this.signInModal = true;
        this.submitted = false;
        this.apiError = '';
        this.loading = false;
        this.valueChange = new core_1.EventEmitter();
    }
    SigninComponent.prototype.ngOnInit = function () {
        this.loginForm = this.formBuilder.group({
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
            password: ['', [forms_1.Validators.required]]
        });
    };
    SigninComponent.prototype.closeModal = function () {
        this.valueChange.emit({ key: 'signIn', value: true });
        $('#sign_in_modal').modal('hide');
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
                if (error.status == 406) {
                    _this.userService.resendOtp(_this.loginForm.value.email).subscribe(function (data) {
                        $('.modal_container').addClass('right-panel-active');
                        _this.valueChange.emit({ key: 'otpModal', value: true, emailForVerifyOtp: _this.loginForm.value.email });
                    }, function (error) {
                        _this.submitted = _this.loading = false;
                        _this.apiError = error.message;
                    });
                }
                else {
                    _this.submitted = _this.loading = false;
                    _this.apiError = error.message;
                }
            });
        }
    };
    SigninComponent.prototype.openPage = function (event) {
        if (event && event.value === 'forgotPassword') {
            $('.modal_container').addClass('right-panel-active');
            $('.forgotpassword-container').addClass('show_forgotpass');
            this.pageData = true;
            this.valueChange.emit({ key: 'forgotPassword', value: this.pageData });
        }
        else if (event && event.value === 'signUp') {
            $('.modal_container').addClass('right-panel-active');
            this.pageData = true;
            this.valueChange.emit({ key: 'signUp', value: this.pageData });
        }
    };
    SigninComponent.prototype.toggleFieldTextType = function () {
        this.fieldTextType = !this.fieldTextType;
    };
    SigninComponent.prototype.socialError = function (error) {
        this.apiError = error;
    };
    SigninComponent.prototype.btnSignUpClick = function () {
        $('#sign_in_modal').modal('hide');
        $('#sign_up_modal').modal('show');
        $("body").addClass("modal-open");
    };
    __decorate([
        core_1.Input()
    ], SigninComponent.prototype, "pageData");
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
