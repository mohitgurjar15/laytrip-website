import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { CommonFunction } from '../../../_helpers/common-function';
import { VerifyOtpComponent } from '../verify-otp/verify-otp.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

declare var $: any;

@Component({ 
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SigninComponent  implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  signUpModal = false;
  signInModal = true;
  loginForm: FormGroup;
  submitted =  false;Location
  fieldTextType :  boolean;
  apiError :string =  '';
  public loading: boolean = false;
  emailForVerifyOtp : string = '';

  @Input() pageData;
  @Output() valueChange = new EventEmitter();
  
  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService : UserService,
    public router: Router,
    public commonFunction:CommonFunction,

    ) { }    


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      password: ['', [Validators.required]]
    });
  }  

  closeModal(){        
    this.valueChange.emit({ key: 'signIn', value: true });
    $('#sign_in_modal').modal('hide');    
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {    

    this.submitted = false;
    this.loading = true;
    if (this.loginForm.invalid) {
      this.submitted = true;
      this.loading = false;
      return;
    } else {
      this.userService.signin(this.loginForm.value).subscribe((data: any) => {
        if(data.token){

          localStorage.setItem("_lay_sess", data.token);
          const userDetails = getLoginUserInfo();    
          
          $('#sign_in_modal').modal('hide');          
          this.loading = this.submitted = false;
          const _isSubscribeNow = localStorage.getItem("_isSubscribeNow"); 
         
          if(_isSubscribeNow == "Yes" && userDetails.roleId == 6){
            this.router.navigate(['account/subscription']);
          } else {
              let urlData = this.commonFunction.decodeUrl(this.router.url)
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.router.navigate([`${urlData.url}`],{queryParams:urlData.params})
              });
          } 
        }
      }, (error: HttpErrorResponse) => {       
        if(error.status == 406){
          this.userService.resendOtp(this.loginForm.value.email).subscribe((data: any) => {
            this.openOtpPage();
            // $('.modal_container').addClass('right-panel-active');
            // this.valueChange.emit({ key: 'otpModal', value: true,emailForVerifyOtp:this.loginForm.value.email });
            
          }, (error: HttpErrorResponse) => {       
            this.submitted = this.loading = false;
            this.apiError = error.message;
          });
        } else {
          this.submitted = this.loading = false;
          this.apiError = error.message;
        }
      });
    }
  }

  openPage(event) {
    if (event && event.value === 'forgotPassword') {
      $('.modal_container').addClass('right-panel-active');
      $('.forgotpassword-container').addClass('show_forgotpass');
      this.pageData = true;
      this.valueChange.emit({ key: 'forgotPassword', value: this.pageData });
    } else if (event && event.value === 'signUp') {
      $('.modal_container').addClass('right-panel-active');
      this.pageData = true;
      this.valueChange.emit({ key: 'signUp', value: this.pageData });
    }
  }
  
  toggleFieldTextType(){
    this.fieldTextType = !this.fieldTextType;
  }

  socialError(error){
    this.apiError = error;
  } 

  btnSignUpClick(){
    $('#sign_in_modal').modal('hide');
    $('#sign_up_modal').modal('show');
    $("body").addClass("modal-open");

  }

  openOtpPage() {
    $('#sign_in_modal').modal('hide');
    const modalRef = this.modalService.open(VerifyOtpComponent, {windowClass:'otp_window', centered: true});
    (<VerifyOtpComponent>modalRef.componentInstance).emailForVerifyOtp = this.emailForVerifyOtp;
  }

  // openForgotPassModal() {
  //   $('#sign_in_modal').modal('hide');
  //   const modalRef = this.modalService.open(ForgotPasswordComponent, {windowClass:'forgot_window', centered: true});
  //   // (<VerifyOtpComponent>modalRef.componentInstance).emailForVerifyOtp = this.emailForVerifyOtp;
  // }

  openResetPassModal() {
    $('#sign_in_modal').modal('hide');
    const modalRef = this.modalService.open(ResetPasswordComponent, {windowClass:'resetpass_window', centered: true});
    // (<VerifyOtpComponent>modalRef.componentInstance).emailForVerifyOtp = this.emailForVerifyOtp;
  }
}

