"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ForgotPasswordComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var forms_1 = require("@angular/forms");
var reset_password_component_1 = require("../reset-password/reset-password.component");
var ForgotPasswordComponent = /** @class */ (function () {
    function ForgotPasswordComponent(modalService, formBuilder, userService, activeModal) {
        this.modalService = modalService;
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.activeModal = activeModal;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.valueChange = new core_1.EventEmitter();
        this.submitted = false;
        this.forgotModal = false;
        this.loading = false;
        this.apiMessage = '';
        this.forgotEmail = '';
        this.forgotPasswordSuccess = false;
    }
    ForgotPasswordComponent.prototype.ngOnInit = function () {
        this.forgotForm = this.formBuilder.group({
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]]
        });
    };
    ForgotPasswordComponent.prototype.closeModal = function () {
        this.valueChange.emit({ key: 'signIn', value: true });
        $('#sign_in_modal').modal('hide');
    };
    ForgotPasswordComponent.prototype.openPage = function (event) {
        this.pageData = true;
        this.valueChange.emit({ key: 'forgotPassword', value: this.pageData });
    };
    ForgotPasswordComponent.prototype.ngOnDestroy = function () { };
    ForgotPasswordComponent.prototype.openSignInPage = function () {
        this.pageData = true;
        this.valueChange.emit({ key: 'signIn', value: this.pageData });
        $('.modal_container').removeClass('right-panel-active');
        $('.forgotpassword-container').removeClass('show_forgotpass');
    };
    ForgotPasswordComponent.prototype.onSubmit = function () {
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
                _this.forgotPasswordSuccess = true;
                // this.valueChange.emit({ key: 'reset-password', value: true,emailForVerifyOtp:this.forgotForm.value.email,isReset:true });  
                _this.forgotEmail = _this.forgotForm.value.email;
            }, function (error) {
                _this.submitted = _this.loading = false;
                _this.apiMessage = error.message;
            });
        }
    };
    ForgotPasswordComponent.prototype.openResetModal = function () {
        var modalRef = this.modalService.open(reset_password_component_1.ResetPasswordComponent, { windowClass: 'forgot_window', centered: true });
        modalRef.componentInstance.emailForVerifyOtp = this.forgotEmail;
    };
    __decorate([
        core_1.Input()
    ], ForgotPasswordComponent.prototype, "pageData");
    __decorate([
        core_1.Output()
    ], ForgotPasswordComponent.prototype, "valueChange");
    ForgotPasswordComponent = __decorate([
        core_1.Component({
            selector: 'app-forgot-password',
            templateUrl: './forgot-password.component.html',
            styleUrls: ['./forgot-password.component.scss']
        })
    ], ForgotPasswordComponent);
    return ForgotPasswordComponent;
}());
exports.ForgotPasswordComponent = ForgotPasswordComponent;
