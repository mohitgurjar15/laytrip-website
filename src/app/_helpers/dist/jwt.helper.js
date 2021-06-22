"use strict";
exports.__esModule = true;
exports.getLoginUserInfo = exports.redirectToLogin = exports.getUserDetails = void 0;
var jwt_decode = require("jwt-decode");
exports.getUserDetails = function (token) {
    try {
        return jwt_decode(token);
    }
    catch (error) {
        exports.redirectToLogin();
    }
};
exports.redirectToLogin = function () {
    localStorage.removeItem('_lay_sess');
    localStorage.removeItem('$crt');
    window.location.href = '/';
};
exports.getLoginUserInfo = function () {
    var token = localStorage.getItem('_lay_sess');
    try {
        return jwt_decode(token);
    }
    catch (error) {
        return {};
    }
};
