"use strict";
exports.__esModule = true;
exports.phoneCodeAndPhoneValidation = exports.fileSizeValidator = exports.validateImageFile = void 0;
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
