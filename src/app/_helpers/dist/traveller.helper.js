"use strict";
exports.__esModule = true;
exports.travlerLabels = exports.travelersFileds = void 0;
var moment = require("moment");
exports.travelersFileds = {
    flight: {
        adult: {
            type: 'adult',
            first_name: '',
            last_name: '',
            email: '',
            country_code: '+1',
            phone_no: '',
            dob: '',
            dobMinDate: new Date(moment().subtract(100, 'years').format("YYYY-MM-DD")),
            dobMaxDate: new Date(moment().subtract(12, 'years').format("YYYY-MM-DD")),
            country_id: '',
            gender: '',
            is_passport_required: false,
            passport_number: '',
            passport_expiry: '',
            checkout_date: new Date()
        },
        child: {
            type: 'child',
            first_name: '',
            last_name: '',
            dob: '',
            dobMinDate: new Date(moment().subtract(12, 'years').format("YYYY-MM-DD")),
            dobMaxDate: new Date(moment().subtract(2, 'years').format("YYYY-MM-DD")),
            country_id: '',
            gender: '',
            passport_number: '',
            passport_expiry: '',
            checkout_date: new Date()
        },
        infant: {
            type: 'infant',
            first_name: '',
            last_name: '',
            dobMinDate: new Date(moment().subtract(2, 'years').format("YYYY-MM-DD")),
            dobMaxDate: new Date(),
            dob: '',
            country_id: '',
            gender: ''
        }
    }
};
exports.travlerLabels = {
    en: {
        adult: 'Adult',
        child: 'Child',
        infant: 'Infant'
    }
};
