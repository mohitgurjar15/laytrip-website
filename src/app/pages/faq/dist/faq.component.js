"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FaqComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var FaqComponent = /** @class */ (function () {
    function FaqComponent(genericService, userService, router) {
        this.genericService = genericService;
        this.userService = userService;
        this.router = router;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
        this.google_loading = false;
    }
    FaqComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scroll(0, 0);
        this.loadJquery();
        this.loading = true;
        this.genericService.getFaqData().subscribe(function (res) {
            _this.faqDetail = res.data;
            _this.loading = false;
        });
        this.loadGoogleSdk();
    };
    FaqComponent.prototype.loadGoogleSdk = function () {
        var _this = this;
        console.log('hee');
        window['googleSDKLoaded'] = function () {
            window['gapi'].load('auth2', function () {
                _this.auth2 = window['gapi'].auth2.init({
                    client_id: '188637199174-dnm6dm1r7k652d8ddqd122kgas9kho3e.apps.googleusercontent.com',
                    cookiepolicy: 'single_host_origin',
                    scope: 'profile email'
                });
                _this.googleLogin();
            });
        };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-jssdk'));
    };
    FaqComponent.prototype.loadJquery = function () {
        $(document).ready(function () {
            $('.faq_callapse').on('shown.bs.collapse', function () {
                $(this).parent().addClass('active');
            });
            $('.faq_callapse').on('hidden.bs.collapse', function () {
                $(this).parent().removeClass('active');
            });
        });
    };
    FaqComponent.prototype.googleLogin = function () {
        var _this = this;
        console.log('googleLogin');
        this.auth2.attachClickHandler(this.loginElement.nativeElement, {}, function (googleUser) {
            var profile = googleUser.getBasicProfile();
            console.log('Token || ' + googleUser.getAuthResponse().id_token);
            console.log('ID: ' + profile.getId());
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail());
            //YOUR CODE HERE
        }, function (error) {
            alert(JSON.stringify(error, undefined, 2));
        });
        return;
        // this.loadGoogleSdk();
        console.log(this.auth2);
        console.log(this.auth2);
        this.auth2.attachClickHandler(this.loginElement.nativeElement, {}, function (googleUser) {
            _this.google_loading = true;
            var profile = googleUser.getBasicProfile();
            // YOUR CODE HERE
            var jsonData = {
                "account_type": 1,
                "name": profile.getName(),
                "email": profile.getEmail(),
                "social_account_id": profile.getId(),
                "device_type": 1,
                "device_model": "RNE-L22",
                "device_token": "123abc#$%456",
                "app_version": "1.0",
                "os_version": "7.0"
            };
            _this.userService.socialLogin(jsonData).subscribe(function (data) {
                if (data.user_details) {
                    _this.google_loading = false;
                    localStorage.setItem("_lay_sess", data.user_details.access_token);
                    $('#sign_in_modal').modal('hide');
                    _this.router.url;
                    document.getElementById('navbarNav').click();
                }
            }, function (error) {
                _this.google_loading = false;
                // this.socialError.emit(error.message);
            });
        }, function (error) {
            _this.google_loading = false;
            // this.socialError.emit('Authentication failed.');
            // this.toastr.error("Something went wrong!", 'SignIn Error');
        });
    };
    __decorate([
        core_1.ViewChild('loginRef', { static: true })
    ], FaqComponent.prototype, "loginElement");
    FaqComponent = __decorate([
        core_1.Component({
            selector: 'app-faq',
            templateUrl: './faq.component.html',
            styleUrls: ['./faq.component.scss']
        })
    ], FaqComponent);
    return FaqComponent;
}());
exports.FaqComponent = FaqComponent;
