import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonFunction } from '../../../../_helpers/common-function';
import { validateImageFile,fileSizeValidator } from '../../../../_helpers/custom.validators';
import { GenericService } from '../../../../services/generic.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  profileForm: FormGroup;
  submitted = false;
  loading = false;
  countries: any = [];
  languages: any = [];
  currencies: any = [];
  countries_code: any = [];
  stateList: any = [];  
  minDate: any = {};
  maxDate: any = {};
  public startDate: Date;
  is_gender: boolean = true;
  is_type: string = '';
  public imageFile:any  = '';
  public imageFileError = false;
  public imageErrorMsg: string = 'Image is required';
  image: any = '';
  public defaultImage = this.s3BucketUrl+'assets/images/profile_im.svg';
  public file:any  = '';
  public isFile  = true;
  public profile_pic = false;
  public fileError      = false;
  public fileErrorMsg: string = 'File is required';
  selectResponse: any = {};
  seletedDob :any;

  dobMinDate= new Date();
  dobMaxDate: moment.Moment = moment();
  locale = {
    format: 'DD/MM/YYYY',
    displayFormat: 'DD/MM/YYYY'
  };


  constructor(
    private formBuilder: FormBuilder,
    private userService : UserService,
    private genericService : GenericService,
    public router: Router,  
    public commonFunctoin: CommonFunction,  
    private toastr: ToastrService
    ) {}
 
  ngOnInit() {
    this.getCountry();
    this.getLanguages();
    this.getCurrencies();
    this.getProfileInfo();

    this.profileForm = this.formBuilder.group({
      title: ['mr'],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      country_code: ['', [Validators.required]],
      dob: ['', Validators.required],
      phone_no: ['', [Validators.required]],
      address: [''],
      email: [''],
      zip_code: [''],
      country_id: [''],
      state_id: [''],
      city_name: [''],
      gender: ['M'],
      profile_pic: [''],      
      address2: [''],      
      language_id: [''],      
      currency_id: [''],      
      passport_expiry: [''],      
      passport_number: [''],      
    });
  }

  getCountry() {
    this.genericService.getCountry().subscribe((data: any) => {
      this.countries = data.map(country=>{
          return {
              id:country.id,
              name:country.name
          } 
      }),
      this.countries_code = data.map(country=>{
        return {
          id: country.id,
          name: country.phonecode+' ('+country.iso2+')',
          code:country.phonecode,
          country_name:country.name+ ' ' +country.phonecode,
          flag: this.s3BucketUrl+'assets/images/icon/flag/'+ country.iso3.toLowerCase()+'.svg'
        }
      })
      console.log( this.countries_code )
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  getStates(countryId) {
    this.genericService.getStates(countryId.id).subscribe((data: any) => {
      this.stateList = data;
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  getLanguages() {
    this.genericService.getAllLangunage().subscribe((data: any) => {
      this.languages = data.data;
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  getCurrencies() {
    this.genericService.getCurrencies().subscribe((data: any) => {
      this.currencies = data.data;
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  clickGender(event,type){
    this.is_type = '';
    this.is_gender = false;       
      if(type =='M'){
        this.is_type = 'M';
      } else if(type =='F'){
        this.is_type = 'F';        
      } else if(type =='N') {
        this.is_type = 'N';
      } else {
        this.is_gender = false;
        this.is_type = '';
      }
      this.is_gender = true;
  }


  onFileSelect(event) {    
    this.imageFile = event.target.files[0];
    //file type validation check
    if (!validateImageFile(this.imageFile.name)) {
        this.imageFileError = true;
        this.imageErrorMsg = 'Only image are allowed';
        return;
    }
    
    //file size validation max=10
    if(!fileSizeValidator(event.target.files[0])){
        this.imageFileError = true;
        this.imageErrorMsg = 'Please select file up to 2mb size';
        return;
    }
    //file render
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); 
    reader.onload = (_event) => {
      this.image = reader.result; 
    }
    this.imageFileError = false;
  }

  getProfileInfo() {
    this.userService.getProfile().subscribe((res:any)=> {   
    this.image = res.profilePic;
    this.selectResponse = res;

    this.is_type = res.gender;
    this.seletedDob = moment(res.dobm).format("DD/MM/YYYY");

    this.profileForm.patchValue({      
        first_name: res.firstName,
        last_name: res.lastName,
        email: res.email,
        gender  : res.gender ? res.gender : 'M',        
        zip_code  : res.zipCode,        
        title  : res.title ? res.title : 'mr',        
        dob  : res.dob ? moment(res.dob).format('MM/DD/YYYY'):'',        
        country_code:res.countryCode,        
        phone_no  : res.phoneNo,        
        country_id: res.country.name,
        state_id: res.state.name,       
        city_name  : res.cityName,        
        address  : res.address,  
        language_id : res.preferredLanguage.name,     
        currency_id : res.preferredCurrency.code,     
        profile_pic: res.profilePic, 
        passport_expiry:  res.passportExpiry ? moment(res.passportExpiry).format('MM/DD/YYYY') : '', 
        passport_number: res.passportNumber  
    });

    }, (error: HttpErrorResponse) => {
      if (error.status === 404) {
        this.router.navigate(['/']);
      } else {
        console.log('error')
      }
    });
  }

  onSubmit() {
    this.submitted = this.loading = true;
    if(this.profileForm.controls.gender.errors && this.is_gender){
      this.profileForm.controls.gender.setValue(this.is_type);
    }
    if (this.profileForm.invalid) {
      this.submitted = true;      
      this.loading = false;
      //scroll top if any error 
      let scrollToTop = window.setInterval(() => {
        let pos = window.pageYOffset;
        if (pos > 0) {
            window.scrollTo(0, pos - 20); // how far to scroll on each step
        } else {
            window.clearInterval(scrollToTop);
        }
      }, 16);
      return;
    } else {
      let formdata = new FormData();

      let imgfile = '';
      if(this.imageFile){
        imgfile = this.imageFile;
        formdata.append("profile_pic",imgfile);
      }
      formdata.append("title",this.profileForm.value.title);
      formdata.append("first_name",this.profileForm.value.first_name);
      formdata.append("last_name",this.profileForm.value.last_name);
      formdata.append("email",this.profileForm.value.email);      
      formdata.append("city_name",this.profileForm.value.city_name);
      formdata.append("zip_code",this.profileForm.value.zip_code);
      formdata.append("address",this.profileForm.value.address);
      formdata.append("address1",this.profileForm.value.address);
      formdata.append("phone_no",this.profileForm.value.phone_no);
      formdata.append("gender",this.is_type);
      formdata.append("passportNumber",this.profileForm.value.passport_number);
      formdata.append("dob", typeof this.profileForm.value.dob === 'object' ? moment(this.profileForm.value.dob).format('YYYY-MM-DD') : moment(this.profileForm.value.dob).format('YYYY-MM-DD'));
      formdata.append("passportExpiry", typeof this.profileForm.value.passport_expiry === 'object' ? moment(this.profileForm.value.passport_expiry).format('YYYY-MM-DD') : moment(this.profileForm.value.passport_expiry).format('YYYY-MM-DD'));
      // console.log(typeof this.profileForm.value.country_id )
      if(typeof this.profileForm.value.country_id === 'string'){
        formdata.append("country_id", this.selectResponse.country.id);
      } else {
        formdata.append("country_id", this.profileForm.value.country_id ? this.profileForm.value.country_id.id : '');
      }

      if(typeof this.profileForm.value.state_id === 'string' && isNaN(this.profileForm.value.state_id)) {
        formdata.append("state_id", this.selectResponse.state.id);
      } else{
        formdata.append("state_id", this.profileForm.value.state_id);
      }

      if(typeof(this.profileForm.value.country_code) != 'object'){        
        formdata.append("country_code", this.selectResponse.countryCode);
      } else {
        formdata.append("country_code",this.profileForm.value.country_code ? this.profileForm.value.country_code.name : '' );
      } 
      if(!Number.isInteger(Number(this.profileForm.value.language_id))) {
        formdata.append("language_id", this.selectResponse.preferredLanguage.id);        
      } else {
        formdata.append("language_id", this.profileForm.value.language_id ? this.profileForm.value.language_id : 1);
      }
      if(!Number.isInteger(Number(this.profileForm.value.currency_id))){
        formdata.append("currency_id", this.selectResponse.preferredCurrency.id ?this.selectResponse.preferredCurrency.id : '');
      } else {
        formdata.append("currency_id", this.profileForm.value.currency_id ? this.profileForm.value.currency_id : 1);
      }         
      
      this.userService.updateProfile(formdata).subscribe((data: any) => {
        this.submitted = this.loading = false; 
        localStorage.setItem("_lay_sess", data.token);
        this.toastr.success("Profile has been updated successfully!", 'Profile Updated');
        // this.router.navigate(['/']);      
      }, (error: HttpErrorResponse) => {
        console.log(error)       
        this.submitted = this.loading = false;
        this.toastr.error(error.error.message, 'Profile Error');
      });
    }
  }
}
