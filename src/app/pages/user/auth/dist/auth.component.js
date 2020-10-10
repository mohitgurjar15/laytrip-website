"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var AuthComponent = /** @class */ (function () {
    function AuthComponent(modalService) {
        this.modalService = modalService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.signInModal = false;
        this.signUpModal = false;
        this.forgotPasswordModal = false;
        this.resetPasswordModal = false;
        this.otpModal = false;
        this.emailForVerifyOtp = '';
        this.is_signUpModal = false;
        this.valueChange = new core_1.EventEmitter();
    }
    AuthComponent.prototype.ngOnInit = function () {
        this.signInModal = true;
    };
    /*  ngAfterContentChecked(){
       if(this.is_signUpModal){
         this.openSignUp();
       } else {
         this.signInModal = false;
       }
     } */
    AuthComponent.prototype.openSignUp = function () {
        this.signInModal = false;
        this.signUpModal = true;
        // $('#sign_in_modal').modal('show');
        // $('.modal_container').addClass('right-panel-active');
        console.log("sds", this);
    };
    AuthComponent.prototype.pageChange = function (event) {
        if (event && event.key === 'signUp' && event.value) {
            this.signUpModal = true;
            this.signInModal = false;
            this.forgotPasswordModal = false;
            this.otpModal = this.resetPasswordModal = false;
        }
        else if (event && event.key === 'forgotPassword' && event.value) {
            this.signInModal = false;
            this.signUpModal = false;
            this.otpModal = this.resetPasswordModal = false;
            this.forgotPasswordModal = true;
        }
        else if (event && event.key === 'signIn' && event.value) {
            this.signInModal = true;
            this.signUpModal = false;
            this.forgotPasswordModal = this.resetPasswordModal = false;
            this.otpModal = false;
        }
        else if (event && event.key === 'otpModal' && event.value) {
            this.otpModal = true;
            this.signInModal = false;
            this.signUpModal = false;
            this.forgotPasswordModal = this.resetPasswordModal = false;
            this.emailForVerifyOtp = event.emailForVerifyOtp;
        }
        else if (event && event.key === 'reset-password') {
            this.resetPasswordModal = true;
            this.otpModal = false;
            this.signInModal = false;
            this.signUpModal = false;
            this.forgotPasswordModal = false;
            this.emailForVerifyOtp = event.emailForVerifyOtp;
        }
    };
    AuthComponent.prototype.clickedOut = function (event) {
        if (event.target.id === "sign_in_modal") {
            this.signInModal = true;
            this.signUpModal = false;
            this.forgotPasswordModal = false;
            this.otpModal = false;
        }
    };
    AuthComponent.prototype.closeModal = function () {
        this.signInModal = true;
        this.signUpModal = false;
        this.forgotPasswordModal = false;
        this.otpModal = false;
        $('.modal_container').removeClass('right-panel-active');
        this.valueChange.emit({ key: 'signIn', value: true });
    };
    __decorate([
        core_1.Input()
    ], AuthComponent.prototype, "is_signUpModal");
    __decorate([
        core_1.Input()
    ], AuthComponent.prototype, "pageData");
    __decorate([
        core_1.Output()
    ], AuthComponent.prototype, "valueChange");
    AuthComponent = __decorate([
        core_1.Component({
            selector: 'app-auth',
            templateUrl: './auth.component.html',
            styleUrls: ['./auth.component.scss']
        })
    ], AuthComponent);
    return AuthComponent;
}());
exports.AuthComponent = AuthComponent;
