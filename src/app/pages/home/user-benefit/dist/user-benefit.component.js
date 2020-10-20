"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserBenefitComponent = void 0;
var core_1 = require("@angular/core");
var jwt_helper_1 = require("src/app/_helpers/jwt.helper");
var environment_1 = require("../../../../environments/environment");
var UserBenefitComponent = /** @class */ (function () {
    function UserBenefitComponent(router) {
        this.router = router;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
    }
    UserBenefitComponent.prototype.ngOnInit = function () {
        this.userDetails = jwt_helper_1.getLoginUserInfo();
    };
    UserBenefitComponent.prototype.ngAfterContentChecked = function () {
        this.userDetails = jwt_helper_1.getLoginUserInfo();
    };
    UserBenefitComponent.prototype.subscribeNow = function () {
        this.loading = true;
        if (this.userDetails.roleId == 6) {
            this.loading = false;
            this.router.navigate(['account/subscription']);
        }
        else if (this.userDetails.roleId == 7 || !this.userDetails.roleId) {
            this.loading = false;
            localStorage.setItem("_isSubscribeNow", "Yes");
            $('#sign_in_modal').modal('show');
        }
    };
    UserBenefitComponent = __decorate([
        core_1.Component({
            selector: 'app-user-benefit',
            templateUrl: './user-benefit.component.html',
            styleUrls: ['./user-benefit.component.scss']
        })
    ], UserBenefitComponent);
    return UserBenefitComponent;
}());
exports.UserBenefitComponent = UserBenefitComponent;
