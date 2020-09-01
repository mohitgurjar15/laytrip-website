import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonFunction } from '../../../../_helpers/common-function';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { validateImageFile,fileSizeValidator } from '../../../../_helpers/custom.validators';

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

  constructor(
    private formBuilder: FormBuilder,
    private userService : UserService,
    public router: Router,  
    public commonFunctoin: CommonFunction,  
    private config: NgbDatepickerConfig, 
    private datePipe: DatePipe
    ) { 
      config.minDate = { year: 2000, month: 1, day: 1 };
      config.maxDate = { year: 2099, month: 12, day: 31 };
      let current = new Date();
      this.minDate = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      this.maxDate = this.minDate;
    }
 
  ngOnInit() {
    this.getCountry();
    this.getLanguages();
    this.getCurrencies();
    this.getProfileInfo();

    this.profileForm = this.formBuilder.group({
      title: [''],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      country_code: ['', [Validators.required]],
      email: [''],
      phone_no: ['', [Validators.required]],
      address: ['', [Validators.required]],
      zip_code: ['', [Validators.required]],
      country_id: ['', [Validators.required]],
      state_id: ['', [Validators.required]],
      city_name: ['', [Validators.required]],
      gender: [''],
      dob: ['', [Validators.required]],
      profile_pic: [''],      
      address2: [''],      
      language_id: [''],      
      currency_id: [''],      
    });
  }

  getCountry() {
    this.userService.getCountry().subscribe((data: any) => {
      this.countries = data.map(country=>{
          return {
              id:country.id,
              name:country.name
          } 
      }),
      this.countries_code = data.map(country=>{
        return {
            id:country.id,
            name:country.phonecode+' ('+country.iso2+')'
        }
      })
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  getStates(countryId) {
    // this.ngSelectComponent.handleClearClick();
    this.userService.getStates(countryId.id).subscribe((data: any) => {
      this.stateList = data;
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  getLanguages() {
    this.userService.getLanguages().subscribe((data: any) => {
      this.languages = data.data;
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }
  getCurrencies() {
    this.userService.getCurrencies().subscribe((data: any) => {
      this.currencies = data.data;
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  dateFormator(date) {
    console.log(date)
    let aNewDate = date.year + '-' + date.month + '-' + date.day;
    return this.datePipe.transform(aNewDate, 'yyyy-MM-dd');
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
    let dob_selected = new Date(res.dob)
    this.is_type = res.gender;
console.log(res)
    this.profileForm.patchValue({      
        first_name: res.firstName,
        last_name: res.lastName,
        email: res.email,
        gender  : res.gender,        
        zip_code  : res.zipCode,        
        title  : res.title,        
        dob: {year:dob_selected.getFullYear(),month:dob_selected.getMonth(),day:dob_selected.getDate()},
        country_code:res.countryCode,        
        phone_no  : res.phoneNo,        
        country_id: res.country.name,
        state_id: res.state.name,       
        city_name  : res.cityName,        
        address  : res.address,   
        language_id : res.preferredLanguage.name,     
        currency_id : res.preferredCurrency.code,     
        profile_pic: res.profilePic  
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
      console.log(this.profileForm.controls)
      this.submitted = true;      
      this.loading = false;
      return;
    } else {
      let formdata = new FormData();

      let imgfile = '';
      if(this.imageFile){
        imgfile = this.imageFile;
        formdata.append("profile_pic",imgfile);
      }
      formdata.append("title",'mr');
      // formdata.append("title",this.profileForm.value.title);
      formdata.append("first_name",this.profileForm.value.first_name);
      formdata.append("last_name",this.profileForm.value.last_name);
      formdata.append("email",this.profileForm.value.email);      
      formdata.append("city_name",this.profileForm.value.city_name);
      formdata.append("zip_code",this.profileForm.value.zip_code);
      formdata.append("address",this.profileForm.value.address);
      formdata.append("address1",this.profileForm.value.address);
      formdata.append("phone_no",this.profileForm.value.phone_no);
      formdata.append("gender",this.is_type);
      formdata.append("dob", this.dateFormator(this.profileForm.value.dob));
      if(typeof(this.profileForm.value.country_id) != 'object'){        
        formdata.append("country_id", this.selectResponse.country.id);
      } else {
        formdata.append("country_id", this.profileForm.value.country_id.id);
      }
      if(typeof(this.profileForm.value.state_id) != 'object'){        
        formdata.append("state_id", this.selectResponse.state.id);
      } else{
        formdata.append("state_id", this.profileForm.value.state.id);
      }
      if(typeof(this.profileForm.value.country_code) != 'object'){        
        formdata.append("country_code", this.selectResponse.country.id);
      } else {
        formdata.append("country_code",this.profileForm.value.country_code.id);
      } 
      if(Number.isInteger(this.profileForm.value.language_id)){
        formdata.append("language_id", this.profileForm.value.language_id);
      } else {
        formdata.append("language_id", this.selectResponse.preferredLanguage.id);        
      }
      if(Number.isInteger(this.profileForm.value.currency_id)){
        formdata.append("currency_id", this.profileForm.value.currency_id);
      } else {
        formdata.append("currency_id", this.selectResponse.preferredCurrency.id);
      }
         
      formdata.append("passport_expiry",'2020-08-06');
      console.log(this.profileForm.value)
      this.userService.updateProfile(formdata).subscribe((data: any) => {
        this.submitted = this.loading = false; 
        localStorage.setItem("_lay_sess", data.token);
        this.router.navigate(['/']);      
      }, (error: HttpErrorResponse) => {       
        this.submitted = this.loading = false;
      });
    }
  }
}
