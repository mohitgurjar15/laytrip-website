import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunction } from 'src/app/_helpers/common-function';

declare var $: any;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() pageData;
  @Output() valueChange = new EventEmitter();
  forgotForm: FormGroup;
  submitted = false;
  loading: boolean = false;
  apiMessage =  '';
  resetPasswordSuccess : boolean = false;


 
  constructor(
    private formBuilder: FormBuilder,
    private userService : UserService,
    public commonFunctoin: CommonFunction
  
  ) { }

  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      new_password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required],
      otp6: ['', Validators.required],
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
  
  onSubmit() {
   
    this.submitted = this.loading = true;
    
    if (this.forgotForm.invalid) {
      this.submitted = true;      
      this.loading = false;      
      return;
    } else {
        this.loading = true;     
        this.userService.forgotPassword(this.forgotForm.value).subscribe((data: any) => {
        this.submitted = false;    
        this.valueChange.emit({ key: 'signIn', value: true});  
      }, (error: HttpErrorResponse) => {       
        this.submitted = this.loading  = false;
        this.apiMessage = error.message;

      });
    }
  }
}
