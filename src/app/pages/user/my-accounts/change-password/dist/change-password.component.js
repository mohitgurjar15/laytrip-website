"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ChangePasswordComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var must_match_validators_1 = require("../../../../_helpers/must-match.validators");
var environment_1 = require("../../../../../environments/environment");
var ChangePasswordComponent = /** @class */ (function () {
    function ChangePasswordComponent(formBuilder, toastr, userService) {
        this.formBuilder = formBuilder;
        this.toastr = toastr;
        this.userService = userService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.submitted = false;
        this.loading = false;
        this.apiError = '';
    }
    ChangePasswordComponent.prototype.ngOnInit = function () {
        this.changePasswordForm = this.formBuilder.group({
            old_password: ['', [forms_1.Validators.required]],
            password: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$')]],
            confirm_password: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$')]]
        }, {
            validator: must_match_validators_1.MustMatch('password', 'confirm_password')
        });
        console.log(this.changePasswordForm);
    };
    ChangePasswordComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = this.loading = true;
        if (this.changePasswordForm.invalid) {
            this.submitted = true;
            this.loading = false;
            return;
        }
        else {
            var jsonFromData = {
                old_password: this.changePasswordForm.value.old_password,
                password: this.changePasswordForm.value.password,
                confirm_password: this.changePasswordForm.value.confirm_password
            };
            this.userService.changePassword(jsonFromData).subscribe(function (data) {
                _this.submitted = _this.loading = false;
                _this.changePasswordForm.reset();
                _this.toastr.success("Your password has been updated successfully!", 'Password Updated');
            }, function (error) {
                _this.apiError = error.message;
                _this.submitted = _this.loading = false;
                _this.toastr.error(error.error.message, 'Error Change Password');
            });
        }
    };
    ChangePasswordComponent.prototype.toggleFieldTextType = function (event) {
        if (event.target.id == 'passEye') {
            this.passFieldTextType = !this.passFieldTextType;
        }
        else if (event.target.id == 'cnfEye') {
            this.cnfPassFieldTextType = !this.cnfPassFieldTextType;
        }
        else if (event.target.id == 'oldEye') {
            this.oldPassFieldTextType = !this.oldPassFieldTextType;
        }
    };
    ChangePasswordComponent = __decorate([
        core_1.Component({
            selector: 'app-change-password',
            templateUrl: './change-password.component.html',
            styleUrls: ['./change-password.component.scss']
        })
    ], ChangePasswordComponent);
    return ChangePasswordComponent;
}());
exports.ChangePasswordComponent = ChangePasswordComponent;
