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
  loading = false;
  errorMessage = '';
  spinner = false;
  @Input() emailForVerifyOtp;
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
  isResend = false;
  @ViewChild('ngOtpInput',{static:true}) ngOtpInputRef:any;//Get reference using ViewChild and the specified hash
  @ViewChild('countdown',{static:true}) public counter: CountdownComponent;
  otp:number=0;
  
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
  }

  onOtpChange(event){
    this.otp = event;
    this.otpForm.controls.otp.setValue(event);
    this.ngOtpInputRef.setValue(event);
    console.log(this.otpForm,this)
  }

  
  closeModal(){
    this.valueChange.emit({ key: 'signIn', value: true });
    $('#sign_in_modal').modal('hide');
  }

  validateNumber(e: any) {
    let input = String.fromCharCode(e.charCode);
    const reg = /^[0-9]*$/;
    
    if (!reg.test(input)) {
      e.preventDefault();
    }
  }
  
  openSignInPage() {
    $('.modal_container').removeClass('right-panel-active');
    $('.forgotpassword-container').removeClass('show_forgotpass');
    this.pageData = true;
    this.valueChange.emit({ key: 'signIn', value: this.pageData });
  }

  resendOtp(){
    console.log(this.emailForVerifyOtp,this.otpForm)
    this.otpForm.controls.otp.setValue(this.otp);
    this.otpForm.reset();
    this.spinner = true;
    this.userService.resendOtp(this.emailForVerifyOtp).subscribe((data: any) => {
      this.spinner = false;
      this.isResend = false;
      this.counter.begin();
    }, (error: HttpErrorResponse) => {       
      this.submitted = this.spinner = false;
      this.apiError = error.message;
    });
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
    if (this.otpForm.hasError('otpsError')) {
      this.submitted = true; 
      this.loading = false; 
      return;
    } else {    

      let data = {
        "email":this.emailForVerifyOtp,
        "otp": this.otp,
       }; 
      
      this.userService.verifyOtp(data).subscribe((data: any) => {
        this.otpVerified = true;  
        this.submitted = this.loading = false;    
        $('#sign_in_modal').modal('hide');
        localStorage.setItem("_lay_sess", data.userDetails.access_token);  
        const userDetails = getLoginUserInfo();    
        const _isSubscribeNow = localStorage.getItem("_isSubscribeNow"); 
        if(_isSubscribeNow == "Yes" && userDetails.roleId == 6){
          this.router.navigate(['account/subscription']);
        } else {
          this.valueChange.emit({ key: 'signIn', value: true}); 
        }

      }, (error: HttpErrorResponse) => {       
        this.apiError = error.message;
        this.submitted = this.loading = false;        
      });                    
      
    }
  }

  onKeydown(event){
    const tabIndex = event.target.tabIndex ? '.tab'+(event.target.tabIndex-1): 1;
    if(event.key == 'Backspace'){
      $(tabIndex).focus();
      $('.tab'+event.target.tabIndex).val('');
    }
  }

}
