export const PHONE_NUMBER_MASK = {
    '+1':  {format: "(000) 000-0000", length: 10},
    '+27': {format: "000 000 0000", length: 10},
    '+30': {format: "00 0000 0000", length: 10},
    '+31': {format: "000 000 0000", length: 10},
    '+32': {format: "00 000 00 00", length: 9},
    '+33': {format: "00 00 00 00 00", length: 10},
    '+34': {format: "000 00 00 00", length: 9},
    '+36': {format: "(0) 000 0000", length: 8},
    '+39': {format: "00 0000 0000", length: 10},
    '+40': {format: "000 000 0000", length: 10},
    '+41': {format: "000 000 00 00", length: 10},
    '+43': {format: "0000 000000", length: 10},
    '+44': {format: "000 0000 0000", length: 11},
    '+45': {format: "00 00 00 00", length: 8},
    '+46': {format: "00-000 000 00", length: 10},
    '+47': {format: "00 00 00 00", length: 8},
    '+48': {format: "00 000 00 00", length: 9},
    '+49': {format: "000 00000000", length: 11},
    '+51': {format: "(00) 0000000", length: 9},
    '+52': {format: "00 00 0000 0000", length: 12},
    '+54': {format: "000 0000-0000", length: 11},
    '+55': {format: "(00) 0000-0000", length: 10},
    '+57': {format: "(0) 0000000", length: 8},
    '+60': {format: "00-0000 0000", length: 10},
    '+61': {format: "(00) 0000 0000", length: 10},
    '+65': {format: "0000 0000", length: 8},
    '+81': {format: "00-0000-0000", length: 10},
    '+82': {format: "00-0000-0000", length: 10},
   '+351': {format: "000 000 000", length: 9},
   '+352': {format: "00 00 00 00", length: 8},
   '+354': {format: "(00) 000 0000", length: 9},
   '+356': {format: "0000 0000", length: 8},
   '+357': {format: "00 000000", length: 8},
   '+358': {format: "00 00000000", length: 10},
   '+359': {format: "00 000 0000", length: 9},
   '+370': {format: "(0-0) 000 0000", length: 9},
   '+371': {format: "00 000 000", length: 8},
   '+372': {format: "000 0000", length: 7},
   '+385': {format: "00 0000 000", length: 9},
   '+386': {format: "(00) 000 00 00", length: 9},
   '+420': {format: "000 000 000", length: 9},
   '+421': {format: "00/000 000 00", length: 10},
   '+503': {format: "0000 0000", length: 8},
   '+507': {format: "000-0000", length: 7},
   '+687': {format: "00-000 0000", length: 9},
   '+852': {format: "0000 0000", length: 8},
   '+886': {format: "00 0000 0000", length: 10},
   '+972': {format: "000-000-0000", length: 10},
   '+91' : {format: "00000-00000", length: 10}
}

export const getPhoneFormat=(countruCode:string)=>{

    let data = PHONE_NUMBER_MASK[countruCode];
    if(typeof data!='undefined' && Object.keys(data).length){
        return data;
    }
    else{
        return PHONE_NUMBER_MASK['+1'];
    }
}