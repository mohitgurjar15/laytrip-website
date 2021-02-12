import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonFunction } from '../../../../_helpers/common-function';
import { validateImageFile,fileSizeValidator, phoneAndPhoneCodeValidation } from '../../../../_helpers/custom.validators';
import { GenericService } from '../../../../services/generic.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie';
import { redirectToLogin } from '../../../../_helpers/jwt.helper';
import { FlightService } from '../../../../services/flight.service';

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
  departureAirport:any={};
  arrivalAirport :any={}
  home_airport;

  constructor(
    private formBuilder: FormBuilder,
    private userService : UserService,
    private genericService : GenericService,
    public router: Router,  
    public commonFunction: CommonFunction,  
    private toastr: ToastrService,
    private cookieService: CookieService,
    private flightService: FlightService
    ) {}
 
  ngOnInit() {
    this.loadingValue.emit(true);
    window.scroll(0,0);
  
    let location:any = this.cookieService.get('__loc');
    try{
      this.location = JSON.parse(location);
    }catch(e){}
    
    this.profileForm = this.formBuilder.group({
        first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
        last_name: ['', [Validators.required,Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
        dob: ['', Validators.required],
        country_code: ['', [Validators.required]],
        phone_no: ['',[Validators.required, Validators.minLength(10)]],
        address: [''],
        email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],        
        gender: ['M'],
        profile_pic: [''],          
        passport_expiry: [''],      
        passport_number: [''],      
        home_airport: [''],      
      },{validators:phoneAndPhoneCodeValidation()});
    
      this.getProfileInfo(); 
  }

  selectGender(event,type){
    if(this.isFormControlEnable){
      this.is_gender = true; 
      if(type =='M'){
        this.is_type = 'M';        
      }else if(type =='F'){
        this.is_type = 'F';        
      } else if(type =='O'){
        this.is_type = 'O';        
      } 
    }
  } 
 
 
  uploadImageFile(event) {  
    this.imageFileError = false;  
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
        // this.toastr.error(this.imageErrorMsg, 'Profile Error');
        return;
    }
    //file render
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); 
    reader.onload = (_event) => {
      this.image = reader.result;
    }
    if(!this.imageFileError){
      this.imageFileError = false;
      this.loadingValue.emit(true);   
      let formdata = new FormData();    
      let imgfile = '';
      if(this.imageFile){
        imgfile = this.imageFile;
        formdata.append("profile_pic",imgfile);
        this.userService.updateProfileImage(formdata).subscribe((data: any) => {
          this.submitted = false; 
          this.loadingValue.emit(false);   
          localStorage.setItem("_lay_sess", data.token);
          // this.toastr.success("Profile picture updated successfully!", 'Profile Updated');
        }, (error: HttpErrorResponse) => {
          this.loadingValue.emit(false);  
          this.submitted = false;
          // this.toastr.error(error.error.message, 'Profile Error');
        });
      }
    }
  }

  getProfileInfo() {
    this.userService.getProfile().subscribe((res:any)=> {
      this.loadingValue.emit(false);   
      this.image = res.profilePic;
      this.selectResponse = res;
      this.is_type = res.gender ? res.gender :'M';      
     
      this.data = Object.keys(res.airportInfo).length > 0 ?  [res.airportInfo] : [];      
      this.profileForm.patchValue({      
          first_name: res.firstName,
          last_name: res.lastName,
          email: res.email,
          gender  : res.gender ? res.gender : 'M',        
          zip_code  : res.zipCode,        
          title  : res.title ? res.title : 'mr',        
          dob  : (res.dob !='undefined' && res.dob != '' && res.dob)   ? new Date(res.dob) : '',        
          country_code :  (res.countryCode != 'undefined' && res.countryCode != '') ? res.countryCode :'',        
          phone_no  : res.phoneNo,        
          state_id: res.state.name,       
          city_name  : res.cityName,        
          address  : res.profile_picaddress,  
          home_airport  : res.airportInfo.code ? res.airportInfo.code : null,  
          language_id : res.preferredLanguage.name,     
          currency_id : res.preferredCurrency.code,     
          passport_expiry:  res.passportExpiry ? moment(res.passportExpiry).format('MMM d, yy') : '', 
          passport_number: res.passportNumber  
      });
      this.profileForm.controls['home_airport'].disable()     

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
    if (this.profileForm.invalid) {
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
        // formdata.append("profile_pic",imgfile);
      }

      // formdata.append("title",'mr');
      formdata.append("first_name",this.profileForm.value.first_name);
      formdata.append("last_name",this.profileForm.value.last_name);
      formdata.append("email",this.profileForm.value.email);      
      formdata.append("home_airport",this.profileForm.value.home_airport ? this.profileForm.value.home_airport :'');
      formdata.append("address",this.profileForm.value.address);
      formdata.append("phone_no",this.profileForm.value.phone_no);
      formdata.append("gender",this.profileForm.value.gender);
      formdata.append("country_code",this.profileForm.value.country_code);
      formdata.append("dob", typeof this.profileForm.value.dob === 'object' ? moment(this.profileForm.value.dob).format('YYYY-MM-DD') : moment(this.profileForm.value.dob).format('YYYY-MM-DD'));
      this.isFormControlEnable = false;

      this.profileForm.controls['home_airport'].disable();     

      this.userService.updateProfile(formdata).subscribe((data: any) => {
        this.submitted = false; 
        this.loadingValue.emit(false);   
        localStorage.setItem("_lay_sess", data.token);
        // this.toastr.success("Profile has been updated successfully!", 'Profile Updated');
      }, (error: HttpErrorResponse) => {
        this.loadingValue.emit(false);  
        this.submitted = false;
        // this.toastr.error(error.error.message, 'Profile Error');
      });
    }
  }

  enableFormControlInputs(event){
    this.isFormControlEnable = true;
    this.profileForm.controls['home_airport'].enable()     
  }

  onRemove(event,item){
    if (item.key === 'fromSearch') {
      this.departureAirport=Object.create(null);
    } else if (item.key === 'toSearch') {
      this.arrivalAirport=Object.create(null);
    }
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
    
    if (event && event.code && item.key === 'fromSearch') {
      // this.home_airport = event.code;
      // this.departureAirport=event;
      // this.searchedValue.push({ key: 'fromSearch', value: event });
    } 
  }

 
}
