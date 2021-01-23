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
    function SignupComponent(modalService, formBuilder, userService, router) {
        this.modalService = modalService;
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.router = router;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.valueChange = new core_1.EventEmitter();
        this.submitted = false;
        this.closeResult = '';
        this.is_type = 'M';
        this.emailForVerifyOtp = '';
        this.loading = false;
        this.apiError = '';
    }
    SignupComponent.prototype.ngOnInit = function () {
        this.signupForm = this.formBuilder.group({
            first_name: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
            last_name: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
            password: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$')]],
            confirm_password: ['', forms_1.Validators.required],
            checked: ['', forms_1.Validators.required]
        }, {
            validators: must_match_validators_1.MustMatch('password', 'confirm_password')
        });
        this.signupForm.reset();
    };
    SignupComponent.prototype.openSignInPage = function () {
        $('.modal_container').removeClass('right-panel-active');
        $('.forgotpassword-container').removeClass('show_forgotpass');
        this.pageData = true;
        this.valueChange.emit({ key: 'signIn', value: this.pageData });
    };
    SignupComponent.prototype.openOtpPage = function () {
        $('#sign_up_modal').modal('hide');
        var modalRef = this.modalService.open(verify_otp_component_1.VerifyOtpComponent, { windowClass: 'otp_window', centered: true });
        modalRef.componentInstance.emailForVerifyOtp = this.emailForVerifyOtp;
    };
    SignupComponent.prototype.closeModal = function () {
        this.valueChange.emit({ key: 'signIn', value: true });
        $('#sign_in_modal').modal('hide');
    };
    SignupComponent.prototype.toggleFieldTextType = function (event) {
        if (event.target.id == 'passEye') {
            this.passFieldTextType = !this.passFieldTextType;
        }
        else if (event.target.id == 'cnfEye') {
            this.cnfPassFieldTextType = !this.cnfPassFieldTextType;
        }
    };
    SignupComponent.prototype.onSubmit = function () {
        var _this = this;
        // this.openOtpPage();
        // return;
        this.submitted = this.loading = true;
        console.log(this.signupForm.controls);
        if (this.signupForm.invalid) {
            this.submitted = true;
            this.loading = false;
            return;
        }
        else {
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
    __decorate([
        core_1.Input()
    ], SignupComponent.prototype, "pageData");
    __decorate([
        core_1.Output()
    ], SignupComponent.prototype, "valueChange");
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
