import * as moment from 'moment';
export const travelersFileds={

    flight : {
        adult : {
            type : 'adult',
            first_name: '',
            last_name: '',
            email: '',
            country_code:'',
            phone_number:'',
            dob:'',
            dobMinDate:new Date(moment().subtract(50,'years').format("YYYY-MM-DD") ),
            dobMaxDate:new Date(moment().subtract(12, 'years').format("YYYY-MM-DD")),
            country_id:'',
            gender:'',
            passport_number:'',
            passport_expiry:''
        },
        child : {
            type : 'child',
            first_name: '',
            last_name: '',
            dob:'',
            dobMinDate:new Date(moment().subtract(12,'years').format("YYYY-MM-DD") ),
            dobMaxDate:new Date(moment().subtract(2,'years').format("YYYY-MM-DD") ),
            country_id:'',
            gender:'',
            passport_number:'',
            passport_expiry:''
        },
        infant : {
            type : 'infant',
            first_name: '',
            last_name: '',
            dobMinDate:new Date(moment().subtract(2,'years').format("YYYY-MM-DD") ),
            dobMaxDate:new Date(),
            dob:'',
            country_id:'',
            gender:''
        }
    }
}