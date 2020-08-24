import { Component, OnInit, Output, Input,EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
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
  spinner = false;
  @Input() emailForVerifyOtp;
  apiError :string =  '';

  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService : UserService,
    public router: Router
    ) { }

  ngOnInit() {
    console.log(this.emailForVerifyOtp)

    this.otpForm = this.formBuilder.group({
      otp: ['', Validators.required],
    });
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
    this.pageData = true;
    this.valueChange.emit({ key: 'signIn', value: this.pageData });
  }

  resendOtp(){
    this.spinner = true;
    this.userService.resendOtp(this.emailForVerifyOtp).subscribe((data: any) => {
      this.spinner = false;

    }, (error: HttpErrorResponse) => {       
      this.submitted = this.spinner = false;
      this.apiError = error.message;
    });
  }

  onSubmit() {   
    this.submitted = this.loading = true;
    if (this.otpForm.invalid) {
      this.submitted = true;     
      this.loading = false; 
      return;
    } else {
      let data = {
        "email":this.emailForVerifyOtp,
        "otp":this.otpForm.value.otp,
       }; 
      this.userService.verifyOtp(data).subscribe((data: any) => {
      this.otpVerified = true;  
      this.submitted = this.loading = false;    
      localStorage.setItem("_lay_sess", data.userDetails.access_token);  
      this.router.navigate(['/']);      
      }, (error: HttpErrorResponse) => {       
        console.log(error);
        this.apiError = error.message;
        this.submitted = this.loading = false;        
      }); 
    }
  }
}
