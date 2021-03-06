import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CommonFunction } from '../../../_helpers/common-function';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { optValidation } from '../../../_helpers/custom.validators';
import { CountdownComponent } from 'ngx-countdown';
import { NgxOtpInputConfig } from 'ngx-otp-input';
declare var $: any;

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() pageData;
  @Output() valueChange = new EventEmitter();
  otpForm: FormGroup;
  submitted = false;
  otpVerified = false;
  otpLengthError = false;
  loading = false;
  errorMessage = '';
  spinner = false;
  @Input() emailForVerifyOtp;
  @Input() isUserNotVerify: boolean = false;
  @Input() isSignup: boolean = false;
  apiError: string = '';
 config: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: false,
    numericInputMode: true,
    isPasswordInput: false,
    classList: {
      input: 'inputStyles'
    }
  };
  isResend: boolean = false;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInputRef: any;//Get reference using ViewChild and the specified hash
  @ViewChild('countdown', { static: false }) counter: CountdownComponent;
  otp: number = 0;
  configCountDown: any = { leftTime: 60, demand: false };
  isTimerEnable = true;
  guestUserId: string = '';

  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public router: Router,
    public commonFunction: CommonFunction,
    public activeModal: NgbActiveModal

  ) { }

  ngOnInit() {
    this.otpForm = this.formBuilder.group({
      otp: [''],
    }, { validator: optValidation() });

    setTimeout(() => {
      this.isResend = true;
    }, 60000);

    this.guestUserId = localStorage.getItem('__gst') || '';
  }

  timerComplete() {
    this.isResend = true;
    this.isTimerEnable = false;
    this.configCountDown = { leftTime: 60, demand: true };
  }

  onOtpChange(event) {
    this.otp = event;
    if (event.length == 6) {
      this.otpForm.controls.otp.setValue(event);
    }
  }

  resendOtp() {
    if (this.isResend) {
      this.configCountDown = { leftTime: 60, demand: true };
      this.ngOtpInputRef.setValue('');
      this.spinner = true;
      this.userService.resendOtp(this.emailForVerifyOtp).subscribe((data: any) => {
        this.spinner = this.isResend = this.otpLengthError = false;
        this.isTimerEnable = true;
        this.apiError = '';
        setTimeout(() => {
          this.counter.begin();
        }, 1000);
      }, (error: HttpErrorResponse) => {
        this.submitted = this.spinner = this.otpLengthError = false;
        this.apiError = error.message;
      });
    }
  }

  onInputEntry(event, nextInput) {
    const input = event.event;
    const length = input.value.length;
    const maxLength = input.attributes.maxlength.value;

    if (length >= maxLength) {
      nextInput.focus();
    }
  }

  onSubmit() {

    this.submitted = this.loading = true;
    var otpValue = '';
    let otps: any = this.otpForm.controls.otp.value;
    Object.values(otps).forEach((v) => {
      otpValue += v;
    });
    this.otpLengthError = false;
    if (otpValue.length != 6) {
      this.otpLengthError = true;
    }
    if (this.otpForm.hasError('otpsError') || otpValue.length != 6) {
      this.submitted = true;
      this.loading = false;
      return;
    } else {

      let data = {
        "email": this.emailForVerifyOtp,
        "otp": otpValue,
      };

      this.userService.verifyOtp(data).subscribe((data: any) => {
        this.otpVerified = true;
        this.submitted = this.loading = false;
        localStorage.setItem("_lay_sess", data.userDetails.access_token);
        const userDetails = getLoginUserInfo();

        if (this.guestUserId) {
          this.userService.mapGuestUser(this.guestUserId).subscribe((res: any) => {
            localStorage.setItem('$cartOver', res.cartOverLimit);
            let urlData = this.commonFunction.decodeUrl(this.router.url)
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([`${urlData.url}`], { queryParams: urlData.params })
            });
          })
        }
        else {
          let urlData = this.commonFunction.decodeUrl(this.router.url)
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([`${urlData.url}`], { queryParams: urlData.params })
          });
        }

        const _isSubscribeNow = localStorage.getItem("_isSubscribeNow");
        if (_isSubscribeNow == "Yes" && userDetails.roleId == 6) {
          this.router.navigate(['account/subscription']);
        }
      }, (error: HttpErrorResponse) => {
        this.apiError = error.message;
        this.submitted = this.loading = false;
      });
    }
  }
}
