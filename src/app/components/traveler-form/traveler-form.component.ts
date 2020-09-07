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
declare var $: any;

@Component({
  selector: 'app-traveler-form',
  templateUrl: './traveler-form.component.html',
  styleUrls: ['./traveler-form.component.scss']
})


export class TravelerFormComponent implements OnInit {
  @Input('var') usersType: any = '';
  @Input() traveler: any = [];
  @Output() valueChange = new EventEmitter();
  @Output() auditFormStatus = new EventEmitter();
  @Input() type:string;

  adultForm: FormGroup;
  submitted = false;
  loading = false;
  isLoggedIn = false;
  countries: any = [];
  countries_code: any = [];
  defaultDate = moment().add(1, 'months').format("DD MMM'YY dddd");
  editMode = false;
  minDate: any = {};
  maxDate: any = {};
  formStatus: boolean = false;
  departureDate;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private flightService: FlightService,
    private genericService: GenericService,
    public router: Router,
    public commonFunction: CommonFunction,
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
    this.loadJquery();
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

  setUserTypeValidation(){
    const emailControl = this.adultForm.get('email');  
    const phoneControl = this.adultForm.get('phone_no');  
    const countryControl = this.adultForm.get('country_code');   

    if(this.type == 'adult'){
      emailControl.setValidators([Validators.required])
      phoneControl.setValidators([Validators.required])
      countryControl.setValidators([Validators.required])
    } else {
      emailControl.setValidators(null)
      phoneControl.setValidators(null)
      countryControl.setValidators(null)
    }
    emailControl.updateValueAndValidity();   
  }

  
  dateFormator(date) {
    let aNewDate = date.year + '-' + date.month + '-' + date.day;
    return this.datePipe.transform(aNewDate, 'yyyy-MM-dd');
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



  getCountry() {
    this.genericService.getCountry().subscribe((data: any) => {
      this.countries = data.map(country => {
        return { 
          id: country.id,
          name: country.name
        }
      }),
        this.countries_code = data.map(country => {
          return {
            id: country.id,
            name: country.phonecode + ' (' + country.iso2 + ')',
            code: country.phonecode
          }
        })
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  loadJquery() {
    $(document).ready(function(){ 
      $('.dob1').each(function(){
        $(this).dateRangePicker({
          autoClose: true,
          singleDate: true,
          showhortcuts: false,
          singleMonth: true,
          format: "MM/YYYY",
          monthSelect: true,
          yearSelect: true,
          startDate: moment().add(0, 'days').format("MM/YYYY"),
          // extraClass: 'laytrip-datepicker'
        });
      });
      $('.dob2').each(function(){
        $(this).dateRangePicker({
          autoClose: true,
          singleDate: true,
          showhortcuts: false,
          singleMonth: true,
          format: "MM/YYYY",
          monthSelect: true,
          yearSelect: true,
          startDate: moment().add(0, 'days').format("MM/YYYY"),
          // extraClass: 'laytrip-datepicker'
        });

      });
    });
  
    $(document).ready(function () {
     
    })
  }

  getDateWithFormat(date) {
    console.log("date", date)
    this.adultForm.controls.dob.setValue(moment(date.date1).format("MM/YYYY"));
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
        dob: this.dateFormator(this.adultForm.value.dob),
        gender: this.adultForm.value.gender,
        country_code: this.adultForm.value.country_code.code,
        country_id: country_id,
        phone_no: this.adultForm.value.phone_no,
        // email : this.adultForm.value.email,
        passport_number: this.adultForm.value.passport_number,
        passport_expiry: this.dateFormator(this.adultForm.value.passport_expiry)
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
          console.log(data.data)
          this.valueChange.emit(data.data);
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

  
}
