import { Component, OnInit, Output, EventEmitter, Input, Renderer2 } from '@angular/core';
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
  public userNotVerify: boolean = false;
  emailForVerifyOtp : string = '';

  @Input() pageData;
  @Input() resetRecaptcha;
  @Output() valueChange = new EventEmitter();

  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService : UserService,
    public router: Router,
    public commonFunction:CommonFunction,
    private renderer: Renderer2,
    ) { }    


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      password: ['', [Validators.required]]
    });
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
        this.submitted = this.loading = false;      
        if(error.status == 406){
          this.emailForVerifyOtp = this.loginForm.value.email;
          this.userNotVerify = true;  
          this.apiError = '';        
        } else {
          this.apiError = error.message;
        }
      });
    }
  }  

  emailVerify(){
    this.userService.resendOtp(this.emailForVerifyOtp).subscribe((data: any) => {
      this.openOtpPage();
    }, (error: HttpErrorResponse) => {
      this.userNotVerify = false;                  
      this.apiError = error.message;
    });
  }

  toggleFieldTextType(){
    this.fieldTextType = !this.fieldTextType;
  }

  socialError(error){
    this.apiError = error;
  } 

  closeModal(){
    this.apiError ='';
    $('#sign_in_modal').modal('hide');
  } 

  btnSignUpClick(){
    
    $('#sign_in_modal').modal('hide');
    $('#sign_up_modal').modal('show');
    $("#signup-form").trigger( "reset" );
    setTimeout(() => {
      this.renderer.addClass(document.body, 'modal-open');
    }, 1500);

  }

  openOtpPage() {
    $('#sign_in_modal').modal('hide');
    const modalRef = this.modalService.open(VerifyOtpComponent, {
      windowClass:'otp_window', 
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
    (<VerifyOtpComponent>modalRef.componentInstance).emailForVerifyOtp = this.emailForVerifyOtp;
    (<VerifyOtpComponent>modalRef.componentInstance).isUserNotVerify = true;
  }

  openForgotPassModal() {
    $('#sign_in_modal').modal('hide');
    setTimeout(() => {
      this.renderer.addClass(document.body, 'modal-open');
    }, 1500);    
    this.modalService.open(ForgotPasswordComponent, {windowClass:'forgot_window', centered: true, backdrop: 'static',
      keyboard: false
    });
  }
}

