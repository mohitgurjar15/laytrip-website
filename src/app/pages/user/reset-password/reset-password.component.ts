import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunction } from '../../../_helpers/common-function';
import { MustMatch } from '../../../_helpers/must-match.validators';

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
  resetForm: FormGroup;
  submitted = false;
  loading: boolean = false;
  resetSuccess: boolean = false;
  apiMessage =  '';
  resetPasswordSuccess : boolean = false;
  errorMessage = '';
  cnfPassFieldTextType :  boolean;
  passFieldTextType :  boolean;


 
  constructor(
    private formBuilder: FormBuilder,
    private userService : UserService,
    public commonFunctoin: CommonFunction
  
  ) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      new_password: ['', [Validators.required, Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$')]],
      confirm_password: ['', [Validators.required]],
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required],
      otp6: ['', Validators.required],
    },{
      validator: MustMatch('new_password', 'confirm_password'),
    });
  }

  openPage(event) {
    this.pageData = true;
    this.valueChange.emit({ key: 'reset-password', value: this.pageData });
  }

  openSignInPage() {
    this.pageData = true;
    this.valueChange.emit({ key: 'signIn', value: this.pageData });
    $('.modal_container').removeClass('right-panel-active');
    $('.forgotpassword-container').removeClass('show_forgotpass');  
  }
  toggleFieldTextType(event){
    if(event.target.id == 'passEye'){
      this.passFieldTextType = !this.passFieldTextType;
      
    }else if(event.target.id == 'cnfEye'){
      this.cnfPassFieldTextType = !this.cnfPassFieldTextType;

    }
  }
  onSubmit() {
    let inputDataOtp: string = '';

    Object.keys(this.resetForm.controls).forEach((key) => {
      console.log(key)
      inputDataOtp += this.resetForm.get(key).value;
    });
    this.submitted = this.loading = true;
    
    if (this.resetForm.invalid) {
      console.log(inputDataOtp.length)
      if(inputDataOtp.length < 6){
        console.log('error')
        this.errorMessage = "Please enter OTP.";
      }
      this.submitted = true;      
      this.loading = false;      
      return;
    } else {
        this.loading = true;  
        let request_param = {
          "email":this.emailForVerifyOtp,
          "new_password":this.resetForm.value.new_password,
          "confirm_password":this.resetForm.value.confirm_password,
          "otp":inputDataOtp      
        };    
      
      this.userService.resetPassword(request_param).subscribe((data: any) => {
        console.log(data)
        this.submitted = false;    
        this.resetSuccess = true;
      }, (error: HttpErrorResponse) => {   
        console.log(error)    
        this.resetSuccess = this.submitted = this.loading  = false;
        this.apiMessage = error.message;
      });
    }
  }
}
