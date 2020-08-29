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
  otpModal = false;
  emailForVerifyOtp = '';


  @Input() pageData;
  @Output() valueChange = new EventEmitter();
  
  constructor(public modalService: NgbModal) { }

  ngOnInit() {
    this.signInModal = true;
  }

  pageChange(event) {
    console.log(event)
    if (event && event.key === 'signUp' && event.value) {
      this.signUpModal = true;
      this.signInModal = false;
      this.forgotPasswordModal = false;
      this.otpModal = false;
    } else if (event && event.key === 'forgotPassword' && event.value) {
      this.signInModal = false;
      this.signUpModal = false;
      this.otpModal = false;
      this.forgotPasswordModal = true;
    } else if (event && event.key === 'signIn' && event.value) {
      this.signInModal = true;
      this.signUpModal = false;
      this.forgotPasswordModal = false;
      this.otpModal = false;
    } else if (event && event.key === 'otpModal' && event.value) {
      console.log(event)
      this.otpModal = true;
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
    this.valueChange.emit({ key: 'signIn', value: true });
  }
}
