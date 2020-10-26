"use strict";
exports.__esModule = true;
exports.WhiteSpaceValidator = exports.phoneAndPhoneCodeValidation = exports.optValidation = exports.phoneCodeAndPhoneValidation = exports.fileSizeValidator = exports.validateImageFile = void 0;
function validateImageFile(name) {
    var allowed_extensions = ['jpg', 'jpeg', 'png'];
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (allowed_extensions.lastIndexOf(ext.toLowerCase()) !== -1) {
        return true;
    }
    else {
        return false;
    }
}
exports.validateImageFile = validateImageFile;
function fileSizeValidator(file) {
    var size = Math.floor(file.size / 1000);
    if (size <= 2000) {
        return true;
    }
    else {
        return false;
    }
}
exports.fileSizeValidator = fileSizeValidator;
function phoneCodeAndPhoneValidation() {
    return function (form) {
        console.log(form.value.country_code);
        return (form.value.phone_no) ||
            (!form.value.phone_no)
            ? { phoneCodeAndPhoneError: true }
            : { phoneCodeAndPhoneError: false };
    };
}
exports.phoneCodeAndPhoneValidation = phoneCodeAndPhoneValidation;
function optValidation() {
    return function (form) {
        return (!form.value.otp1 || !form.value.otp2 || !form.value.otp3 || !form.value.otp4 || !form.value.otp5 || !form.value.otp6)
            ? { otpsError: true }
            : null;
    };
}
exports.optValidation = optValidation;
function phoneAndPhoneCodeValidation() {
    return function (form) {
        console.log(form.value.phone_no, form.value.country_code);
        return (!form.value.phone_no || !form.value.country_code)
            ? { phoneAndPhoneCodeError: true }
            : null;
    };
}
exports.phoneAndPhoneCodeValidation = phoneAndPhoneCodeValidation;
var WhiteSpaceValidator = /** @class */ (function () {
    function WhiteSpaceValidator() {
    }
    WhiteSpaceValidator.cannotContainSpace = function (control) {
        if (control.value.indexOf(' ') >= 0) {
            return { cannotContainSpace: true };
        }
        return null;
    };
    return WhiteSpaceValidator;
}());
exports.WhiteSpaceValidator = WhiteSpaceValidator;
