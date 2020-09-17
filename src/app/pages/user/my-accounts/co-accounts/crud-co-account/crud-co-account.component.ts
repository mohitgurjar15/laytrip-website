import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { GenericService } from '../../../../../services/generic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { FlightService } from '../../../../../services/flight.service';
declare var $: any;

@Component({
  selector: 'app-crud-co-account',
  templateUrl: './crud-co-account.component.html',
  styleUrls: ['./crud-co-account.component.scss']
})
export class CrudCoAccountComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  coAccountForm: FormGroup;
  countries: any = [];
  countries_code: any = [];
  isLoggedIn: boolean = false;
  submitted = false;
  loading = false;
  travellerId = '';
  dobMinDate: any;
  dobMaxDate: moment.Moment = moment();
  expiryMinDate: moment.Moment = moment().add(2, 'days');
  subscriptions: Subscription[] = [];
  
  locale = {
    format: 'DD/MM/YYYY',
    displayFormat: 'DD/MM/YYYY'
  };

  constructor(
      private formBuilder: FormBuilder,
      private genericService: GenericService,
      public router: Router,
      public commonFunction: CommonFunction,
      private flightService: FlightService  
  ) { }

  ngOnInit() {
    this.checkUser();
    this.getCountry();

    this.coAccountForm = this.formBuilder.group({
      title: [''],
      gender: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      country_code: ['', [Validators.required]],
      phone_no: ['', [Validators.required]],
      country_id: ['', Validators.required],
      passport_expiry:['', Validators.required],
      dob: [{
        startDate: this.dobMaxDate
      }, Validators.required],
      passport_number: [''],
      frequently_no: [''],
      user_type: ['']
    });
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
          name: country.name,
          code: country.phonecode
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

  onSubmit() {
    this.submitted = this.loading = true;
    if (this.coAccountForm.invalid) {
      console.log(this.coAccountForm.value)
      this.submitted = true;
      this.loading = false;
      return;
    } else {
      let country_id = this.coAccountForm.value.country_id.id;
      if (!Number(country_id)) {
        country_id = this.coAccountForm.value.country.id;
      }
      let jsonData = {
        title: this.coAccountForm.value.title,
        first_name: this.coAccountForm.value.firstName,
        last_name: this.coAccountForm.value.lastName,
        frequently_no: this.coAccountForm.value.frequently_no,
        passport_number: this.coAccountForm.value.passport_number,
        dob: typeof this.coAccountForm.value.dob.startDate === 'object' ? moment(this.coAccountForm.value.dob.startDate).format('YYYY-MM-DD') : moment(this.commonFunction.stringToDate(this.coAccountForm.value.dob.startDate, '/')).format('YYYY-MM-DD'),
        gender: this.coAccountForm.value.gender,
        country_id: country_id ? country_id : '',
        passport_expiry: typeof this.coAccountForm.value.passport_expiry.startDate === 'object' ? moment(this.coAccountForm.value.dob.passport_expiry).format('YYYY-MM-DD') : moment(this.commonFunction.stringToDate(this.coAccountForm.value.passport_expiry.startDate, '/')).format('YYYY-MM-DD'),
      };

      if (this.travellerId) {

      } else {
        this.flightService.addAdult(jsonData).subscribe((data: any) => {
          console.log(jsonData);

          $('.cmn_add_edit_modal').modal('hide');
        }, (error: HttpErrorResponse) => {
            console.log('error')
            this.submitted = this.loading = false;
            if (error.status === 401) {
              this.router.navigate(['/']);
            }
          });  

      }
    }
  }
  ngOnChanges(changes: SimpleChanges)  {
    console.log('sdadddd',changes)
  }

}
