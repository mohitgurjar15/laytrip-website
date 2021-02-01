import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonFunction } from '../../../../_helpers/common-function';
import { validateImageFile,fileSizeValidator, phoneAndPhoneCodeValidation,WhiteSpaceValidator } from '../../../../_helpers/custom.validators';
import { GenericService } from '../../../../services/generic.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie';
import { redirectToLogin } from '../../../../_helpers/jwt.helper';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  profileForm: FormGroup;
  submitted = false;
  loading = true;
  @Output() loadingValue = new EventEmitter<boolean>();
  countries: any = [];
  languages: any = [];
  currencies: any = [];
  countries_code: any = [];
  stateList: any = [];  
  minDate: any = {};
  maxDate: any = {};
  data = [];
  public startDate: Date;
  is_gender: boolean = true;
  is_type: string = 'M';
  public imageFile:any  = '';
  public imageFileError = false;
  public imageErrorMsg: string = 'Image is required';
  image: any = '';
  public defaultImage = this.s3BucketUrl+'assets/images/profile_laytrip.svg';
  public file:any  = '';
  public isFile  = true;
  public profile_pic = false;
  public fileError      = false;
  public fileErrorMsg: string = 'File is required';
  selectResponse: any = {};
  seletedDob :any;
  dobMinDate = new Date(moment().subtract(16, 'years').format("MM/DD/YYYY"))
  location;
  dobMaxDate: moment.Moment = moment();
  locale = {
    format: 'DD/MM/YYYY',
    displayFormat: 'DD/MM/YYYY'
  };
  isFormControlEnable: boolean = false; 
  loadingDeparture = false;


  constructor(
    private formBuilder: FormBuilder,
    private userService : UserService,
    private genericService : GenericService,
    public router: Router,  
    public commonFunctoin: CommonFunction,  
    private toastr: ToastrService,
    private cookieService: CookieService,
    private flightService: FlightService

    ) {}
 
  ngOnInit() {
    this.loadingValue.emit(true);
    window.scroll(0,0);
    this.getCountry();
    this.getLanguages();
    this.getCurrencies();    
   
    let location:any = this.cookieService.get('__loc');
    try{
      this.location = JSON.parse(location);
    }catch(e){}
    

    this.profileForm = this.formBuilder.group({
        title: ['mr'],
        first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
        last_name: ['', [Validators.required,Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
        country_id: [typeof this.location != 'undefined' && this.location.country.name ? this.location.country.name : ''],
        dob: ['', Validators.required],
        username: [''],
        password: [''],
        country_code: [''],
        phone_no: [''],
        address: [''],
        email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
        zip_code: [''],
        state_id: [''],
        city_name: [''],
        gender: ['M'],
        profile_pic: [''],      
        currency_id: [''],      
        address2: [''],      
        language_id: [''],      
        passport_expiry: [''],      
        passport_number: [''],      
        home_airport: [''],      
      }, { validator: phoneAndPhoneCodeValidation('adult') });

      if(!this.isFormControlEnable){
        this.profileForm.controls['country_code'].disable() 
      }
      
      this.getProfileInfo(); 
  }




  getCountry() {
    this.genericService.getCountry().subscribe((data: any) => {
      this.countries = data.map(country=>{
          return {
              id:country.id,
              name:country.name,
              flag: this.s3BucketUrl+'assets/images/icon/flag/'+ country.iso3.toLowerCase()+'.jpg'
          } 
      }),
      this.countries_code = data.map(country=>{
        return {
          id: country.id,
          name: country.phonecode+' ('+country.iso2+')',
          code:country.phonecode,
          country_name:country.name+ ' ' +country.phonecode,
          flag: this.s3BucketUrl+'assets/images/icon/flag/'+ country.iso3.toLowerCase()+'.jpg'
        }
      });
      if(this.location){
        const countryCode = this.countries_code.filter(item => item.id == this.location.country.id)[0];
        this.profileForm.controls.country_code.setValue(countryCode.country_name);
      }      
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  getStates(countryId) {
    this.profileForm.controls.state_id.setValue([]);
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

  selectGender(event,type){
    this.is_gender = true; 
    if(type =='M'){
      this.is_type = 'M';        
    }else if(type =='F'){
      this.is_type = 'F';        
    } else if(type =='O'){
      this.is_type = 'O';        
    } 
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
        this.toastr.error(this.imageErrorMsg, 'Profile Error');
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
      console.log(res)
      this.loadingValue.emit(false);   
      this.image = res.profilePic;
      this.selectResponse = res;
      
      this.is_type = res.gender ? res.gender :'M';
      if(typeof this.location != 'undefined' || typeof res.country.id != 'undefined'){
        const country = res.country.id ? res.country : this.location.country;
        if(typeof country != 'undefined')              
        this.getStates(country);
      }
      let  countryCode  = '';
      if(typeof res.countryCode != 'undefined' && typeof res.countryCode == 'string' && res.countryCode){
        countryCode = this.countries_code.filter(item => item.id == res.countryCode)[0];
      } else {
         countryCode = typeof this.location != 'undefined' ? this.countries_code.filter(item => item.id == this.location.country.id)[0] : '';      
      }
      let countryName = '';
      if(typeof this.location != 'undefined'){
        countryName = this.location.country.name;
      }
      // console.log(res.dob)
      // console.log(moment(res.dob).format('MMM d, yy'))

      this.profileForm.patchValue({      
          first_name: res.firstName,
          last_name: res.lastName,
          email: res.email,
          gender  : res.gender ? res.gender : 'M',        
          zip_code  : res.zipCode,        
          title  : res.title ? res.title : 'mr',        
          dob  : (res.dob !='undefined' && res.dob != '' && res.dob)   ? moment(res.dob).format('MMM d, yy') : '',        
          country_code : countryCode,        
          phone_no  : res.phoneNo,        
          country_id: res.country.name ? res.country.name :countryName,
          state_id: res.state.name,       
          city_name  : res.cityName,        
          address  : res.address,  
          language_id : res.preferredLanguage.name,     
          currency_id : res.preferredCurrency.code,     
          profile_pic: res.profilePic, 
          passport_expiry:  res.passportExpiry ? moment(res.passportExpiry).format('MMM d, yy') : '', 
          passport_number: res.passportNumber  
      });
      
    }, (error: HttpErrorResponse) => {
      this.loadingValue.emit(false);   
      if (error.status === 401) {
         redirectToLogin();
      } else {
        this.toastr.error(error.message, 'Profile Error');
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.loadingValue.emit(true);   
    if(this.profileForm.controls.gender.errors && this.is_gender){
      this.profileForm.controls.gender.setValue(this.is_type);
    }
    if (this.profileForm.invalid) {
      this.submitted = true;      
      this.loadingValue.emit(false);   
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
      
      formdata.append("title",'mr');
      formdata.append("first_name",this.profileForm.value.first_name);
      formdata.append("last_name",this.profileForm.value.last_name);
      formdata.append("email",this.profileForm.value.email);      
      formdata.append("home_airport",this.profileForm.value.home_airport);
      formdata.append("address",this.profileForm.value.address);
      formdata.append("phone_no",this.profileForm.value.phone_no);
      formdata.append("gender",this.is_type);
      formdata.append("dob", typeof this.profileForm.value.dob === 'object' ? moment(this.profileForm.value.dob).format('YYYY-MM-DD') : moment(this.profileForm.value.dob).format('YYYY-MM-DD'));
      
      if(typeof(this.profileForm.value.country_code) === 'object'){     
        formdata.append("country_code",this.profileForm.value.country_code ? this.profileForm.value.country_code.id : '' );
      } else {
        formdata.append("country_code", this.selectResponse.countryCode);
      } 
            
      this.isFormControlEnable = false;
      this.profileForm.controls['country_code'].disable()     

      this.userService.updateProfile(formdata).subscribe((data: any) => {
        this.submitted = false; 
        this.loadingValue.emit(false);   
        localStorage.setItem("_lay_sess", data.token);
        this.toastr.success("Profile has been updated successfully!", 'Profile Updated');
      }, (error: HttpErrorResponse) => {
        this.loadingValue.emit(false);  
        this.submitted = false;
        this.toastr.error(error.error.message, 'Profile Error');
      });
    }
  }

  enableFormControlInputs(event){
    this.isFormControlEnable = true;
    this.profileForm.controls['country_code'].enable()     
  }

  changeSearchDeparture(event) {
    if (event.term.length > 2) {
      this.searchAirportDeparture(event.term);
    }
  }

  searchAirportDeparture(searchItem) {
    this.loadingDeparture = true;
    this.flightService.searchAirport(searchItem).subscribe((response: any) => {
      this.data = response.map(res => {
        this.loadingDeparture = false;
        return {
          id: res.id,
          name: res.name,
          code: res.code,
          city: res.city,
          country: res.country,
          display_name: `${res.city},${res.country},(${res.code}),${res.name}`,
          parentId:res.parentId
        };
      });
    },
      error => {
        this.loadingDeparture = false;
      }
    );
  }


  selectEvent(event, item) {
    console.log(item.key)
    
    if (event && event.code && item.key === 'fromSearch') {
      // this.searchFlightInfo.departure = event.code;
      // this.departureAirport=event;
      // this.searchedValue.push({ key: 'fromSearch', value: event });
    } 
  }
}
