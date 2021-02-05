"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var user_routing_module_1 = require("./user-routing.module");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
// import { GoogleLoginProvider } from './social-login/google.login-provider';
var angularx_social_login_1 = require("angularx-social-login");
var UserModule = /** @class */ (function () {
    function UserModule() {
    }
    UserModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.ReactiveFormsModule,
                forms_1.FormsModule,
                user_routing_module_1.UserRoutingModule,
                ng_bootstrap_1.NgbModule
            ],
            providers: [
                {
                    provide: 'SocialAuthServiceConfig',
                    useValue: {
                        autoLogin: false,
                        providers: [
                            {
                                id: angularx_social_login_1.GoogleLoginProvider.PROVIDER_ID,
                                provider: new angularx_social_login_1.GoogleLoginProvider('154754991565-9lo2g91remkuefocr7q2sb92g24jntba.apps.googleusercontent.com')
                            }
                        ]
                    }
                }
            ],
            declarations: []
        })
    ], UserModule);
    return UserModule;
}());
exports.UserModule = UserModule;
