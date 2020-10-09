import { Component, OnInit, Output, Input,EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';

declare var $: any;

@Component({
  
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  signInModal = false;
  signUpModal = false;
  forgotPasswordModal = false;
  resetPasswordModal = false;
  otpModal = false;
  emailForVerifyOtp = '';
  @Input() is_signUpModal: boolean = false;
  @Input() pageData;
  @Output() valueChange = new EventEmitter();
  
  constructor(public modalService: NgbModal) { }

  ngOnInit() {
     
    this.signInModal = true;

  }

 /*  ngAfterContentChecked(){
    if(this.is_signUpModal){
      this.openSignUp();
    } else {
      this.signInModal = false; 
    }
  } */

  openSignUp(){
   
      this.signInModal = false;
      this.signUpModal = true;
      // $('#sign_in_modal').modal('show');
      // $('.modal_container').addClass('right-panel-active');
    
    console.log("sds",this)

  }
  pageChange(event) {
    if (event && event.key === 'signUp' && event.value) {
      this.signUpModal = true;
      this.signInModal = false;
      this.forgotPasswordModal = false;
      this.otpModal = this.resetPasswordModal = false;
    } else if (event && event.key === 'forgotPassword' && event.value) {
      this.signInModal = false;
      this.signUpModal = false;
      this.otpModal = this.resetPasswordModal = false;
      this.forgotPasswordModal = true;
    } else if (event && event.key === 'signIn' && event.value) {
      this.signInModal = true;
      this.signUpModal = false;
      this.forgotPasswordModal = this.resetPasswordModal = false;
      this.otpModal = false;
    } else if (event && event.key === 'otpModal' && event.value) {
      this.otpModal = true;
      this.signInModal = false;
      this.signUpModal = false;
      this.forgotPasswordModal = this.resetPasswordModal = false;
      this.emailForVerifyOtp = event.emailForVerifyOtp;
    } else if (event && event.key === 'reset-password') {
      this.resetPasswordModal = true;
      this.otpModal = false;
      this.signInModal = false;
      this.signUpModal = false;
      this.forgotPasswordModal = false;
      this.emailForVerifyOtp = event.emailForVerifyOtp;
    }
  }


 clickedOut(event) {
    if(event.target.id === "sign_in_modal") {
      this.signInModal = true;
      this.signUpModal = false;
      this.forgotPasswordModal = false;
      this.otpModal = false;
    } 
  }


  closeModal(){     
    this.signInModal = true;
    this.signUpModal = false;
    this.forgotPasswordModal = false;
    this.otpModal = false;   
    $('.modal_container').removeClass('right-panel-active');
    this.valueChange.emit({ key: 'signIn', value: true });
  }
}
