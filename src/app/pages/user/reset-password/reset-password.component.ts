import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunction } from '../../../_helpers/common-function';
import { MustMatch } from '../../../_helpers/must-match.validators';
import { optValidation } from '../../../_helpers/custom.validators';
import { CountdownComponent } from 'ngx-countdown';

declare var $: any;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() pageData;
  @Input() emailForVerifyOtp;
  @Output() valueChange = new EventEmitter();
  @ViewChild('ngOtpInput',{static:false}) ngOtpInputRef:any;//Get reference using ViewChild and the specified hash
  @ViewChild('countdown',{static:false}) counter: CountdownComponent;

  resetForm: FormGroup;
  submitted = false;
  spinner: boolean = false;
  loading: boolean = false;
  resetSuccess: boolean = false;
  apiMessage =  '';
  resetPasswordSuccess : boolean = false;
  errorMessage = '';
  cnfPassFieldTextType :  boolean;
  passFieldTextType :  boolean;
  isResend :  boolean = false;
  otp:number=0;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '64px',
      'height': '64px'
    } 
  };
  configCountDown : any = {leftTime: 60,demand: false};
  otpLengthError = false;
  isTimerEnable = true;
 
  constructor(
    private formBuilder: FormBuilder,
    private userService : UserService,
    public commonFunctoin: CommonFunction,
    public activeModal: NgbActiveModal
  
  ) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      new_password: ['', [Validators.required, Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$')]],
      confirm_password: ['', [Validators.required]],
      otp: ['']    
    },{
      validator: [MustMatch('new_password', 'confirm_password'),optValidation()]    
    });
    setTimeout(() => {
      this.isResend = true;
    }, 60000);
  }

  openSignInPage() {
    this.activeModal.close();
    $("#signin-form").trigger( "reset" );
    $('#sign_in_modal').modal('show');    
  }

  toggleFieldTextType(event){
    if(event.target.id == 'passEye'){
      this.passFieldTextType = !this.passFieldTextType;      
    }else if(event.target.id == 'cnfEye'){
      this.cnfPassFieldTextType = !this.cnfPassFieldTextType;
    }
  }

  onSubmit() {
    var otpValue='';
    let otps : any = this.ngOtpInputRef.otpForm.value;
    Object.values(otps).forEach((v) => {    
     otpValue += v;
    });
    this.submitted = this.loading = true;
    if(otpValue.length != 6){
      this.otpLengthError = true;
    }
    if (this.resetForm.invalid || this.resetForm.hasError('otpsError') || otpValue.length != 6) {     
      this.loading = false;      
      return;
    } else {
      this.loading = true;  
      let request_param = {
        "email":this.emailForVerifyOtp,
        "new_password":this.resetForm.value.new_password,
        "confirm_password":this.resetForm.value.confirm_password,
        "otp":otpValue      
      };        
      this.userService.resetPassword(request_param).subscribe((data: any) => {
        this.submitted = false;    
        this.resetSuccess = true;
      }, (error: HttpErrorResponse) => {  
        this.resetSuccess = this.submitted = this.otpLengthError = this.loading  = false;
        this.apiMessage = error.error.message;
      });
    }
  }
  
  timerComplete() {
    this.isResend = true; 
    this.isTimerEnable = false; 
    
    this.configCountDown = {leftTime: 60,demand: true};
  }

  resendOtp(){
    if(this.isResend){
      this.configCountDown = {leftTime: 60,demand: true};
      this.ngOtpInputRef.setValue('');
      this.resetForm.controls.new_password.setValue(null);
      this.resetForm.controls.confirm_password.setValue(null);
      this.spinner = true;
      this.userService.forgotPassword(this.emailForVerifyOtp).subscribe((data: any) => {
        this.spinner = this.isResend = false;
        this.isTimerEnable = true;
        setTimeout(() => {
          this.counter.begin();          
        }, 1000);
      }, (error: HttpErrorResponse) => {       
        this.submitted = this.spinner =  this.isTimerEnable = false;
        this.apiMessage = error.message;
      });

    }
  }

  onOtpChange(event){
    if(event.length == 6){
      this.otp = event;     
      this.resetForm.controls.otp.setValue(event);
      this.ngOtpInputRef.setValue(event);      
    }
  }
  
}
