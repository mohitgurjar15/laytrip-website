import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import * as moment from 'moment';
import { CommonFunction } from '../../_helpers/common-function';
import { DatePipe } from '@angular/common';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { GenericService } from '../../services/generic.service';
import { environment } from '../../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-traveler-form',
  templateUrl: './traveler-form.component.html',
  styleUrls: ['./traveler-form.component.scss']
})


export class TravelerFormComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;

  @Input('var') usersType: any = '';
  @Input() traveler: any = [];
  @Output() valueChange = new EventEmitter();
  @Output() auditFormStatus = new EventEmitter();
  @Input() type:string;
  @Input() countries:[];
  @Input() countries_code:[];

  adultForm: FormGroup;
  submitted = false;
  loading = false;
  isLoggedIn = false;
  defaultDate = moment().add(1, 'months').format("DD MMM'YY dddd");
  editMode = false;  
  formStatus: boolean = false;

  dobMinDate: any; 
  dobMaxDate: moment.Moment = moment(); 
  expiryMinDate: moment.Moment = moment().add(2, 'days'); 

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private flightService: FlightService,
    private genericService: GenericService,
    public router: Router,
    public commonFunction: CommonFunction,

  ) {

  }

  ngOnInit() {
    this.adultForm = this.formBuilder.group({
      title: [''],
      gender: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      dob: ['', Validators.required],
      country_code: ['', Validators.required],
      phone_no: ['', Validators.required],
      country_id: ['', Validators.required],
      frequently_no: [''],
      passport_expiry: [''],
      passport_number: [''],
      user_type:['']
    })
    this.setUserTypeValidation();

    let dob_selected = new Date(this.traveler.dob)
    let pass_exp__selected = new Date(this.traveler.passportExpiry)
    if(this.traveler.userId){
        this.adultForm.patchValue({
          title: this.traveler.title,
          firstName: this.traveler.firstName,
          lastName: this.traveler.lastName,
          email: this.traveler.email,
          gender: this.traveler.gender,
          dob: {year:dob_selected.getFullYear(),month:dob_selected.getMonth(),day:dob_selected.getDate()},
          passport_expiry: { year: pass_exp__selected.getFullYear(), month: pass_exp__selected.getMonth(), day: pass_exp__selected.getDate() },
          country_code: this.traveler.countryCode,
          phone_no: this.traveler.phoneNo,
          country_id: this.traveler.country.name != 'null' ? this.traveler.country.name : '',
          passport_number: this.traveler.passportNumber,
          frequently_no:'f'
        })
    }
    this.formStatus = this.adultForm.status === 'VALID' ?  true : false;
    this.auditFormStatus.emit(this.formStatus);

  }

  ngDoCheck(){
    this.countries = this.countries;
    this.countries_code = this.countries_code;

  }

  setUserTypeValidation(){
    const emailControl = this.adultForm.get('email');  
    const phoneControl = this.adultForm.get('phone_no');  
    const countryControl = this.adultForm.get('country_code');   

    if(this.type == 'adult'){
      emailControl.setValidators([Validators.required]);
      phoneControl.setValidators([Validators.required]);
      countryControl.setValidators([Validators.required]);
      this.dobMaxDate =  moment().add(-12, 'year'); 
      
    } else if(this.type === 'child') {
      emailControl.setValidators(null)
      phoneControl.setValidators(null)
      countryControl.setValidators(null);
      this.dobMinDate =  moment().add(-12, 'year'); 
      this.dobMaxDate =  moment().add(-2, 'year'); 
    
    } else if(this.type === 'infant'){

      this.dobMinDate =  moment().add(-2, 'year'); 
      this.dobMaxDate =  moment(); 
      emailControl.setValidators(null)
      phoneControl.setValidators(null)
      countryControl.setValidators(null)

    }
    emailControl.updateValueAndValidity();   
  }

  
 


  ngOnChanges(changes) {
    if (changes['traveler']) {
    }
  }

  checkUser() {
    let userToken = localStorage.getItem('_lay_sess');

    if (userToken) {
      this.isLoggedIn = true;
    }
  }

 

  onSubmit() {
    this.submitted = this.loading = true;
    if (this.adultForm.invalid) {
      this.submitted = true;
      this.loading = false;
      return;
    } else {
      let country_id = this.adultForm.value.country_id.id;
      if (!Number(country_id)) {
        country_id = this.traveler.country.id;
      }
      let jsonData = {
        title: this.adultForm.value.title,
        first_name: this.adultForm.value.firstName,
        last_name: this.adultForm.value.lastName,
        frequently_no: this.adultForm.value.frequently_no,
        dob: moment(this.adultForm.value.dob.startDate).format('YYYY-MM-DD'),
        gender: this.adultForm.value.gender,
        country_code: this.adultForm.value.country_code.code,
        country_id: country_id,
        phone_no: this.adultForm.value.phone_no,
        passport_expiry: moment(this.adultForm.value.passport_expiry.startDate).format('YYYY-MM-DD'),
      };

      if (this.traveler && this.traveler.userId) {
        this.flightService.updateAdult(jsonData, this.traveler.userId).subscribe((data: any) => {
          this.submitted = this.loading = false;
          this.valueChange.emit(data);
          $('.collapse').collapse('hide');

        }, (error: HttpErrorResponse) => {
          console.log('error')
          this.submitted = this.loading = false;
          if (error.status === 401) {
            // this.router.navigate(['/']);
          }
        });
      } else {
        let emailObj = { email: this.adultForm.value.email };
        let addJsons = Object.assign(jsonData, emailObj);
        
        this.flightService.addAdult(addJsons).subscribe((data: any) => {
          this.adultForm.reset();
          this.submitted = this.loading = false;
          if(!this.isLoggedIn){
            localStorage.setItem("_lay_sess", data.token);
          }
          this.valueChange.emit(data);
          $('.collapse').collapse('hide');
        }, (error: HttpErrorResponse) => {
          console.log('error')
          this.submitted = this.loading = false;
          if (error.status === 401) {
            // this.router.navigate(['/']);
          }
        });
      }
    }
  }

  dobDateUpdate(date){
    this.expiryMinDate = moment(this.adultForm.value.passport_expiry.startDate)
    // console.log(this.expiryMinDate)
  }

  expiryDateUpdate(date){
    this.expiryMinDate = moment(this.adultForm.value.passport_expiry.startDate)

  }

  
}
