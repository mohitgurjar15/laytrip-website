import { Component, OnInit, Output, Input,EventEmitter, ViewChild } from '@angular/core';
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
  @Input() isSignup : boolean = false;
  apiError :string =  '';
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '0',
    inputStyles: {
      'width': '64px',
      'height': '64px'
    }
  };
  isResend : boolean = false;
  @ViewChild('ngOtpInput',{static:false}) ngOtpInputRef:any;//Get reference using ViewChild and the specified hash
  @ViewChild('countdown',{static:false}) counter: CountdownComponent;
  otp:number=0;
  
  configCountDown : any = {leftTime: 60,demand: false};
  
  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService : UserService,
    public router: Router,
    public commonFunctoin: CommonFunction,
    public activeModal: NgbActiveModal

    ) { }

  ngOnInit() {
    this.otpForm = this.formBuilder.group({
      otp: [''],  
    }, { validator: optValidation() });
    
  }

  timerComplete() {
    this.isResend = true; 
    this.configCountDown = {leftTime: 60,demand: true};
  }

  onOtpChange(event){
    this.otp = event;
    if(event.length == 6){
      this.otpForm.controls.otp.setValue(event);
      this.ngOtpInputRef.setValue(event);
    }
  }  

  resendOtp(){
    if(this.isResend){
      this.ngOtpInputRef.setValue('');
      this.spinner = true;
      this.userService.resendOtp(this.emailForVerifyOtp).subscribe((data: any) => {
        this.spinner = this.isResend = false;
        this.counter.begin();
      }, (error: HttpErrorResponse) => {       
        this.submitted = this.spinner = false;
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
    var otpValue='';
    let otps : any = this.ngOtpInputRef.otpForm.value;
      Object.values(otps).forEach((v) => {    
      otpValue += v;
    });
    if(otpValue.length != 6){
      this.otpLengthError = true;
    } 
    if (this.otpForm.hasError('otpsError') || otpValue.length != 6) {
      this.submitted = true; 
      this.loading = false; 
      return;
    } else {    
      
      let data = {
        "email":this.emailForVerifyOtp,
        "otp": otpValue,
       }; 
      
      this.userService.verifyOtp(data).subscribe((data: any) => {
        this.otpVerified = true;  
        this.submitted = this.loading = false;    
        localStorage.setItem("_lay_sess", data.userDetails.access_token);  
        const userDetails = getLoginUserInfo();    
        const _isSubscribeNow = localStorage.getItem("_isSubscribeNow"); 
        if(_isSubscribeNow == "Yes" && userDetails.roleId == 6){
          this.router.navigate(['account/subscription']);
        }
      }, (error: HttpErrorResponse) => {       
        this.apiError = error.message;
        this.submitted = this.loading = false;        
      });                          
    }
  } 
}
