import { Component, OnInit, Output, Input,EventEmitter, ElementRef } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CommonFunction } from '../../../_helpers/common-function';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { optValidation } from '../../../_helpers/custom.validators';
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

  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService : UserService,
    public router: Router,
    public commonFunctoin: CommonFunction
    ) { }

  ngOnInit() {

    this.otpForm = this.formBuilder.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required],
      otp6: ['', Validators.required],
    }, { validator: optValidation() });

   
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
    this.otpForm.reset();
    this.spinner = true;
    this.userService.resendOtp(this.emailForVerifyOtp).subscribe((data: any) => {
      this.spinner = false;

    }, (error: HttpErrorResponse) => {       
      this.submitted = this.spinner = false;
      this.apiError = error.message;
    });
  }

  onInputEntry(event, nextInput) {
    const input = event.target;
    const length = input.value.length;
    const maxLength = input.attributes.maxlength.value;

    if (length >= maxLength) {
      nextInput.focus();
    }
  }

  onSubmit() {  
    let inputDataOtp: string = '';

    Object.keys(this.otpForm.controls).forEach((key) => {
      inputDataOtp += this.otpForm.get(key).value;
    }); 
    this.submitted = this.loading = true;
    if (this.otpForm.invalid) {
      if(inputDataOtp.length != 6){
        this.errorMessage = "Please enter OTP.";
      }
      this.submitted = true;     
      this.loading = false; 
      return;
    } else {    

      let data = {
        "email":this.emailForVerifyOtp,
        "otp": inputDataOtp,
       }; 
      
      this.userService.verifyOtp(data).subscribe((data: any) => {
        this.otpVerified = true;  
        this.submitted = this.loading = false;    
        $('.modal_container').removeClass('right-panel-active');
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
