"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.GoogleLoginProvider = void 0;
var angularx_social_login_1 = require("angularx-social-login");
var GoogleLoginProvider = /** @class */ (function (_super) {
    __extends(GoogleLoginProvider, _super);
    function GoogleLoginProvider(clientId, initOptions) {
        if (initOptions === void 0) { initOptions = { scope: 'email' }; }
        var _this = _super.call(this) || this;
        _this.clientId = clientId;
        _this.initOptions = initOptions;
        return _this;
    }
    GoogleLoginProvider.prototype.initialize = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.loadScript(GoogleLoginProvider.PROVIDER_ID, 'https://apis.google.com/js/platform.js', function () {
                    gapi.load('auth2', function () {
                        _this.auth2 = gapi.auth2.init(__assign(__assign({}, _this.initOptions), { client_id: _this.clientId }));
                        _this.auth2
                            .then(function () {
                            resolve();
                        })["catch"](function (err) {
                            reject(err);
                        });
                    });
                });
            }
            catch (err) {
                reject(err);
            }
        });
    };
    GoogleLoginProvider.prototype.getLoginStatus = function (loginStatusOptions) {
        var _this = this;
        var options = __assign(__assign({}, this.initOptions), loginStatusOptions);
        return new Promise(function (resolve, reject) {
            if (_this.auth2.isSignedIn.get()) {
                var user_1 = new angularx_social_login_1.SocialUser();
                var profile = _this.auth2.currentUser.get().getBasicProfile();
                user_1.id = profile.getId();
                user_1.name = profile.getName();
                user_1.email = profile.getEmail();
                user_1.photoUrl = profile.getImageUrl();
                user_1.firstName = profile.getGivenName();
                user_1.lastName = profile.getFamilyName();
                user_1.response = profile;
                var resolveUser = function (authResponse) {
                    user_1.authToken = authResponse.access_token;
                    user_1.idToken = authResponse.id_token;
                    resolve(user_1);
                };
                if (options.refreshToken) {
                    _this.auth2.currentUser.get().reloadAuthResponse().then(resolveUser);
                }
                else {
                    var authResponse = _this.auth2.currentUser.get().getAuthResponse(true);
                    resolveUser(authResponse);
                }
            }
            else {
                reject("No user is currently logged in with " + GoogleLoginProvider.PROVIDER_ID);
            }
        });
    };
    GoogleLoginProvider.prototype.signIn = function (signInOptions) {
        var _this = this;
        var options = __assign(__assign({}, this.initOptions), signInOptions);
        return new Promise(function (resolve, reject) {
            var offlineAccess = options && options.offline_access;
            var promise = !offlineAccess
                ? _this.auth2.signIn(signInOptions)
                : _this.auth2.grantOfflineAccess(signInOptions);
            promise
                .then(function (response) {
                var user = new angularx_social_login_1.SocialUser();
                if (response && response.code) {
                    user.authorizationCode = response.code;
                }
                else {
                    var profile = _this.auth2.currentUser.get().getBasicProfile();
                    var token = _this.auth2.currentUser.get().getAuthResponse(true)
                        .access_token;
                    var backendToken = _this.auth2.currentUser
                        .get()
                        .getAuthResponse(true).id_token;
                    user.id = profile.getId();
                    user.name = profile.getName();
                    user.email = profile.getEmail();
                    user.photoUrl = profile.getImageUrl();
                    user.firstName = profile.getGivenName();
                    user.lastName = profile.getFamilyName();
                    user.authToken = token;
                    user.idToken = backendToken;
                    user.response = profile;
                }
                resolve(user);
            }, function (closed) {
                reject(closed);
            })["catch"](function (err) {
                reject(err);
            });
        });
    };
    GoogleLoginProvider.prototype.signOut = function (revoke) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var signOutPromise;
            if (revoke) {
                signOutPromise = _this.auth2.disconnect();
            }
            else {
                signOutPromise = _this.auth2.signOut();
            }
            signOutPromise
                .then(function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    // resolve();
                }
            })["catch"](function (err) {
                reject(err);
            });
        });
    };
    GoogleLoginProvider.PROVIDER_ID = 'GOOGLE';
    return GoogleLoginProvider;
}(angularx_social_login_1.BaseLoginProvider));
exports.GoogleLoginProvider = GoogleLoginProvider;
