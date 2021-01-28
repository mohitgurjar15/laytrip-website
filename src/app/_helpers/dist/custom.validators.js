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
        return (form.value.phone_no) ||
            (!form.value.phone_no)
            ? { phoneCodeAndPhoneError: true }
            : { phoneCodeAndPhoneError: false };
    };
}
exports.phoneCodeAndPhoneValidation = phoneCodeAndPhoneValidation;
function optValidation() {
    console.log('here');
    return function (form) {
        console.log(form.value.otp.length);
        return (!form.value.otp || form.value.otp.length != 6)
            ? { otpsError: true }
            : null;
    };
}
exports.optValidation = optValidation;
function phoneAndPhoneCodeValidation(type) {
    if (type === void 0) { type = ''; }
    return function (form) {
        if (type == 'adult') {
            if (!form.value.phone_no) {
                return { phoneAndPhoneCodeError: true };
            }
            if (!form.value.phone_no) {
                return { phoneAndPhoneCodeError: true };
            }
            else if (!form.value.phone_no || !form.value.country_code) {
                return { phoneAndPhoneCodeError: true };
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
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
