"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SignupComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var forms_1 = require("@angular/forms");
var must_match_validators_1 = require("../../../_helpers/must-match.validators");
var verify_otp_component_1 = require("../verify-otp/verify-otp.component");
var SignupComponent = /** @class */ (function () {
    function SignupComponent(modalService, formBuilder, userService, router, renderer, commonFunction, route, checkOutService) {
        this.modalService = modalService;
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.router = router;
        this.renderer = renderer;
        this.commonFunction = commonFunction;
        this.route = route;
        this.checkOutService = checkOutService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.valueChange = new core_1.EventEmitter();
        this.submitted = false;
        this.closeResult = '';
        this.is_type = 'M';
        this.emailForVerifyOtp = '';
        this.loading = false;
        this.apiError = '';
        this.is_email_available = false;
        this.emailExist = false;
        this.isCaptchaValidated = false;
        this.message = "";
        this.iAccept = false;
    }
    SignupComponent.prototype.ngOnInit = function () {
        this.signupForm = this.formBuilder.group({
            first_name: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
            last_name: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}')]],
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
            password: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$')]],
            confirm_password: ['', forms_1.Validators.required],
            checked: ['', forms_1.Validators.required],
            referral_id: ['']
        }, {
            validators: must_match_validators_1.MustMatch('password', 'confirm_password')
        });
        this.isCaptchaValidated = false;
    };
    SignupComponent.prototype.getValue = function () {
        var _this = this;
        if (this.commonFunction.isRefferal() && this.router.url.includes('/cart')) {
            this.checkOutService.getTravelers.subscribe(function (travelers) {
                var traveler = travelers;
                if (typeof traveler != 'undefined' && traveler[0]) {
                    _this.signupForm.controls.first_name.setValue(traveler[0].firstName ? traveler[0].firstName : '');
                    _this.signupForm.controls.last_name.setValue(traveler[0].lastName ? traveler[0].lastName : '');
                    _this.signupForm.controls.email.setValue(traveler[0].email ? traveler[0].email : '');
                    return;
                }
            });
        }
    };
    SignupComponent.prototype.openOtpPage = function () {
        var _this = this;
        Object.keys(this.signupForm.controls).forEach(function (key) {
            _this.signupForm.get(key).markAsUntouched();
        });
        this.signupForm.reset();
        this.submitted = false;
        this.isCaptchaValidated = false;
        $('#sign_up_modal').modal('hide');
        var modalRef = this.modalService.open(verify_otp_component_1.VerifyOtpComponent, { windowClass: 'otp_window', centered: true, backdrop: 'static', keyboard: false });
        modalRef.componentInstance.isSignup = true;
        modalRef.componentInstance.emailForVerifyOtp = this.emailForVerifyOtp;
    };
    SignupComponent.prototype.closeModal = function () {
        var _this = this;
        this.apiError = '';
        this.isCaptchaValidated = false;
        this.submitted = false;
        Object.keys(this.signupForm.controls).forEach(function (key) {
            _this.signupForm.get(key).markAsUntouched();
        });
        this.signupForm.reset();
        $('#sign_up_modal').modal('hide');
    };
    SignupComponent.prototype.toggleFieldTextType = function (event) {
        if (event.target.id == 'passEye') {
            this.passFieldTextType = !this.passFieldTextType;
        }
        else if (event.target.id == 'cnfEye') {
            this.cnfPassFieldTextType = !this.cnfPassFieldTextType;
        }
    };
    SignupComponent.prototype.captchaResponse = function (response) {
        this.isCaptchaValidated = true;
    };
    SignupComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = this.loading = true;
        if (this.signupForm.invalid || !this.isCaptchaValidated || !this.iAccept) {
            Object.keys(this.signupForm.controls).forEach(function (key) {
                _this.signupForm.get(key).markAsTouched();
            });
            // this.signupForm.reset();
            this.submitted = true;
            this.loading = false;
            return;
        }
        else {
            if (this.commonFunction.isRefferal()) {
                var parms = this.commonFunction.getRefferalParms();
                this.signupForm.controls.referral_id.setValue(parms.utm_source ? parms.utm_source : '');
            }
            this.userService.signup(this.signupForm.value).subscribe(function (data) {
                _this.emailForVerifyOtp = _this.signupForm.value.email;
                _this.submitted = _this.loading = false;
                _this.openOtpPage();
            }, function (error) {
                _this.apiError = error.message;
                _this.submitted = _this.loading = false;
            });
        }
    };
    SignupComponent.prototype.openSignInModal = function () {
        var _this = this;
        this.isCaptchaValidated = false;
        this.submitted = false;
        Object.keys(this.signupForm.controls).forEach(function (key) {
            _this.signupForm.get(key).markAsUntouched();
        });
        this.signupForm.reset();
        setTimeout(function () {
            _this.renderer.addClass(document.body, 'modal-open');
        }, 1000);
        $('#sign_up_modal').modal('hide');
        this.emailExist = false;
    };
    SignupComponent.prototype.socialError = function (error) {
        this.apiError = error;
    };
    SignupComponent.prototype.checkAccept = function (event) {
        if (event.target.checked) {
            this.iAccept = true;
        }
        else {
            this.iAccept = false;
        }
    };
    SignupComponent.prototype.checkEmailExist = function (emailString) {
        var _this = this;
        if (this.signupForm.controls.email.valid) {
            this.userService.emailVeryfiy(emailString).subscribe(function (data) {
                if (data && data.is_available) {
                    _this.is_email_available = data.is_available;
                    _this.emailExist = true;
                }
                else {
                    _this.emailExist = false;
                }
            });
        }
    };
    __decorate([
        core_1.Input()
    ], SignupComponent.prototype, "pageData");
    __decorate([
        core_1.Output()
    ], SignupComponent.prototype, "valueChange");
    __decorate([
        core_1.ViewChild('captchaElem', { static: false })
    ], SignupComponent.prototype, "captchaElem");
    SignupComponent = __decorate([
        core_1.Component({
            selector: 'app-signup',
            templateUrl: './signup.component.html',
            styleUrls: ['./signup.component.scss']
        })
    ], SignupComponent);
    return SignupComponent;
}());
exports.SignupComponent = SignupComponent;
