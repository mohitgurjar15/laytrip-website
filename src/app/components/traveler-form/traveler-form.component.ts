import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import * as moment from 'moment';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { phoneAndPhoneCodeValidation, WhiteSpaceValidator } from '../../_helpers/custom.validators';
import { NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../_helpers/ngbDateCustomParserFormatter';
import { CheckOutService } from '../../services/checkout.service';
declare var $: any;
@Component({
  selector: 'app-traveler-form',
  templateUrl: './traveler-form.component.html',
  styleUrls: ['./traveler-form.component.scss'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ]
})

export class TravelerFormComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() travelerType:string;
  @Input() traveler;
  travelerForm: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private flightService: FlightService,
    public router: Router,
    public commonFunction: CommonFunction,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    config: NgbDatepickerConfig,
    private checkOutService:CheckOutService
  ) { }

  ngOnInit() {
      
    this.travelerForm = this.formBuilder.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        phone_number: ['', [Validators.required, Validators.maxLength(4)]],
        gender: ['', [Validators.required, Validators.maxLength(20)]],
        email: ['', Validators.required]
    });
    //this.travelerForm.controls.first_name.setValue(this.traveler.firstName)

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes",changes)
    if (changes['traveler']) {
      this.traveler= changes['traveler'].currentValue;
      this.travelerForm.controls.first_name.setValue(this.traveler.firstName)
      this.travelerForm.controls.last_name.setValue(this.traveler.lastName)
      this.travelerForm.controls.email.setValue(this.traveler.email)
    }
  }
}
