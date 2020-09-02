import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FlightService } from 'src/app/services/flight.service';
import * as moment from 'moment';
import { CommonFunction } from 'src/app/_helpers/common-function';
import { DatePipe } from '@angular/common';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-traveler-form',
  templateUrl: './traveler-form.component.html',
  styleUrls: ['./traveler-form.component.scss']
})


export class TravelerFormComponent implements OnInit {

  @Input() traveler:any=[];
  adultForm : FormGroup;
  submitted = false;
  loading = false;
  countries: any = [];
  defaultDate = moment().add(1, 'months').format("DD MMM'YY dddd");
  searchFlightInfo =
    {
      trip: 'oneway',
      departure: '',
      arrival: '',
      birth_date: moment().add(1, 'months').format("YYYY-MM-DD"),
      // arrival_date: '',
      class: '',
      adult: 1,
      child: null,
      infant: null
    };

  departureDate;


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private flightService: FlightService,
    public router: Router,  
    public commonFunction: CommonFunction,
    private config: NgbDatepickerConfig, 
    private datePipe: DatePipe

    ) { 
      this.getCountry();
      
    console.log("traveler array",this.traveler)
  }

  ngOnInit() {
    this.adultForm = this.formBuilder.group({
      title: [''],
      firstName: ['' ],
      lastName: [''],
      gender: [''],
      dob: [''],
      frequently_no: [''],
      country_code:['']
    })
    let dob_selected = new Date(this.traveler.dob)

    this.adultForm.patchValue({      
      title: this.traveler.title,
      firstName: this.traveler.firstName,
      lastName: this.traveler.lastName,
      email: this.traveler.email,
      gender: 'F',//this.traveler.gender,
      dob: {year:dob_selected.getFullYear(),month:dob_selected.getMonth(),day:dob_selected.getDate()},
      frequently_no: this.traveler.frequently_no,
      country_code: this.traveler.country_code,
    });
  }

  dateFormator(date) {
    let aNewDate = date.year + '-' + date.month + '-' + date.day;
    return this.datePipe.transform(aNewDate, 'yyyy-MM-dd');
  }
  

  ngOnChanges(changes) {
    if (changes['traveler']) {
      console.log("this.on change",this.traveler)
    }
  }

  
  getDateWithFormat(date) {
    alert('here');
    this.searchFlightInfo.birth_date = this.commonFunction.parseDateWithFormat(date).departuredate;
    console.log(this.searchFlightInfo.birth_date)  
  }
  
  getCountry() {
    this.userService.getCountry().subscribe((data: any) => {
      this.countries = data.map(country=>{
          return {
              id:country.id,
              name:country.name
          } 
      })
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit(){
    this.submitted = this.loading = true;
    if (this.adultForm.invalid) {
      console.log(this.adultForm.controls)
      this.submitted = true;      
      this.loading = false;
      return;
    } else {
      let jsonData = {
        title : this.adultForm.value.title,
        first_name : this.adultForm.value.firstName,
        last_name : this.adultForm.value.lastName,
        frequently_no : this.adultForm.value.frequently_no,
        dob : this.dateFormator(this.adultForm.value.dob),
        gender : this.adultForm.value.gender,
        country_code : this.adultForm.value.country_code.id,
        "passport_number": "S1234X7896",
        "passport_expiry": "2030-07-20"
      };

      this.flightService.updateAdult(jsonData,this.traveler.userId).subscribe((data: any) => {
        this.submitted = this.loading = false; 
        console.log(data)

      }, (error: HttpErrorResponse) => {
        console.log('errror')
        this.submitted = this.loading = false;
        if (error.status === 401) {
          // this.router.navigate(['/']);
        }
      });

    }
  }
}
