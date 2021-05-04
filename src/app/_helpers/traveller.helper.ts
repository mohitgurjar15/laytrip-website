import * as moment from 'moment';
export const travelersFileds = {

    flight: {
        adult: {
            module : 'flight',
            module_id : 1,
            userId: '',
            type: 'adult',
            first_name: '',
            last_name: '',
            is_email_required:true,
            email: '',
            country_code: '+1',
            is_phone_required:true,
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
            module : 'flight',
            module_id : 1,
            userId: '',
            type: 'child',
            first_name: '',
            is_email_required:false,
            is_phone_required:false,
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
            module : 'flight',
            module_id : 1,
            userId: '',
            type: 'infant',
            is_email_required:false,
            is_phone_required:false,
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
    },
    hotel:{
        adult: {
            module : 'hotel',
            module_id : 3,
            userId: '',
            type: 'adult',
            is_email_required:true,
            is_phone_required:true,
            first_name: '',
            last_name: '',
            email: '',
            gender:'',
            dob:'',
            country_id:'',
            country_code: '+1',
            phone_no: '',
            phone_no_format: '(000) 000-0000',
            phone_no_length: '10',
            is_valid_date: true,
            is_submitted:false,
            passport_number: '',
            passport_expiry: '',
            is_passport_required:false
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