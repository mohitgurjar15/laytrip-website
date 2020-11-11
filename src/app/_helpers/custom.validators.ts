import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export function validateImageFile(name: String) {

  let allowed_extensions = ['jpg', 'jpeg', 'png'];
  var ext = name.substring(name.lastIndexOf('.') + 1);
  if (allowed_extensions.lastIndexOf(ext.toLowerCase()) !== -1) {
    return true;
  }
  else {
    return false;
  }
}

export function fileSizeValidator(file) {

  var size = Math.floor(file.size / 1000);
  if (size <= 2000) {
    return true;
  }
  else {
    return false;
  }
}

export function phoneCodeAndPhoneValidation() {
  return (form: FormGroup): { [key: string]: any } => {
    return (form.value.phone_no) ||
      (!form.value.phone_no)
      ? { phoneCodeAndPhoneError: true }
      : { phoneCodeAndPhoneError: false };
  };
}

export function optValidation() {

  return (form: FormGroup): { [key: string]: any } => {
    return (!form.value.otp1 || !form.value.otp2 || !form.value.otp3 || !form.value.otp4 || !form.value.otp5 || !form.value.otp6)
      ? { otpsError: true }
      : null;
  };
}

export function phoneAndPhoneCodeValidation(type='') {
  return (form: FormGroup): { [key: string]: any } => {
    if(type == 'adult'){
      if(!form.value.phone_no){
        return {phoneAndPhoneCodeError: true};
      } if(!form.value.phone_no){      
        return {phoneAndPhoneCodeError: true};
      } else if(!form.value.phone_no || !form.value.country_code){
        return {phoneAndPhoneCodeError: true};      
      } else {
        return null;
      }
    } else {
      return null;
    }
   
  };
}

export class WhiteSpaceValidator {

  static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {

      if((control.value as string).indexOf(' ') >= 0){

          return {cannotContainSpace: true}

      }
      return null;

  }

} 