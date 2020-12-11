import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FlightService } from '../../../../../services/flight.service';
import { environment } from '../../../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {  NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-send-email-popup',
  templateUrl: './send-email-popup.component.html',
  styleUrls: ['./send-email-popup.component.scss']
})
export class SendEmailPopupComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  emailForm: FormGroup;
  submitted = false;
  loading: boolean = false;
  apiError = '';
  @Input() bookingId;

  constructor(
    private flightService: FlightService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router:Router,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.validate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bookingId']) {
      this.bookingId = changes['bookingId'].currentValue;
    }
  }


  public validate(): void {
    this.emailForm = new FormGroup({
      'formArray1': new FormArray([
        this.initX()
      ])
    });
    // console.log(this.emailForm)
  }

  get f() { return this.emailForm.controls; }

  public initX(): FormGroup {
    return new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]),
    });
  }

  public addX(): void {
    const control = <FormArray>this.f.formArray1;
    control.push(this.initX());
  }

  removeEmail(ix) {
    const control = <FormArray>this.f.formArray1;
    control.removeAt(ix);
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    let payload = {
      emails:[]
    }
    if (this.emailForm.invalid) {
      this.submitted = true;
      this.loading = false;
      return;
    } else {
       
       this.emailForm.controls.formArray1.value.forEach(element => {
          payload.emails.push(element);
       });

      this.flightService.sendEmail(payload, this.bookingId).subscribe((data: any) => {
        this.submitted = this.loading = false;
        this.toastr.success(data.message, 'Success');
        this.emailForm.reset();
        this.activeModal.close();
      }, (error: HttpErrorResponse) => {
        this.apiError = error.message;
        this.submitted = this.loading = false;
        this.toastr.error(error.message, 'Error Send Email');
      });
    }
  }
}
