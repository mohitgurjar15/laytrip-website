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
            is_duplictae_email: false,
            phone_no: '',
            dob: '',
            dobMinDate: new Date(moment().subtract(100, 'years').format("YYYY-MM-DD")),
            dobMaxDate: new Date(moment().subtract(12, 'years').format("YYYY-MM-DD")),
            is_valid_date: true,
            country_id: '',
            gender: '',
            is_passport_required: false,
            passport_number: '',
            passport_expiry: '',
            checkout_date: new Date()
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
            passport_number: '',
            passport_expiry: '',
            checkout_date: new Date()
        },
        infant: {
            userId: '',
            type: 'infant',
            first_name: '',
            last_name: '',
            dobMinDate: new Date(moment().subtract(2, 'years').format("YYYY-MM-DD")),
            dobMaxDate: new Date(),
            is_valid_date: true,
            dob: '',
            country_id: '',
            gender: ''
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