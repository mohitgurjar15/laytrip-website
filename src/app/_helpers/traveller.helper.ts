import * as moment from 'moment';
export const travelersFileds = {

    flight: {
        adult: {
            userId: '',
            type: 'adult',
            first_name: '',
            last_name: '',
            email: '',
            country_code: '+1',
            phone_no: '',
            phone_no_format: '(000) 000-0000',
            phone_no_length: '10',
            dob: '',
            dobMinDate: new Date(moment().subtract(100, 'years').format("YYYY-MM-DD")),
            dobMaxDate: new Date(moment().subtract(12, 'years').format("YYYY-MM-DD")),
            is_valid_date: true,
            country_id: '',
            gender: '',
            is_passport_required: false,
            passport_number: '',
            passport_expiry: '',
            checkout_date: new Date(),
            is_submitted:false
        },
        child: {
            userId: '',
            type: 'child',
            first_name: '',
            last_name: '',
            dob: '',
            dobMinDate: new Date(moment().subtract(12, 'years').format("YYYY-MM-DD")),
            dobMaxDate: new Date(moment().subtract(2, 'years').format("YYYY-MM-DD")),
            is_valid_date: true,
            country_id: '',
            gender: '',
            is_passport_required: false,
            passport_number: '',
            passport_expiry: '',
            checkout_date: new Date(),
            is_submitted:false
        },
        infant: {
            userId: '',
            type: 'infant',
            first_name: '',
            last_name: '',
            dobMinDate: new Date(moment().subtract(2, 'years').format("YYYY-MM-DD")),
            dobMaxDate: new Date(),
            is_passport_required: false,
            is_valid_date: true,
            dob: '',
            country_id: '',
            gender: '',
            is_submitted:false
        }
    }
}

export const travlerLabels = {
    en: {
        adult: 'Adult',
        child: 'Child',
        infant: 'Infant'
    }
}