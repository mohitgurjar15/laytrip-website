import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';

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
  submitted =  false;
  fieldTextType :  boolean;
  apiError :string =  '';
  public loading: boolean = false;

  @Input() pageData;
  @Output() valueChange = new EventEmitter();
  
  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService : UserService,
    public router: Router,
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
          $('#sign_in_modal').modal('hide');
          
          this.loading = this.submitted = false;
          this.router.navigate(['/']);      
        }
      }, (error: HttpErrorResponse) => {       
        if(error.status == 406){
          this.userService.resendOtp(this.loginForm.value.email).subscribe((data: any) => {
            $('.modal_container').addClass('right-panel-active');
            this.valueChange.emit({ key: 'otpModal', value: true,emailForVerifyOtp:this.loginForm.value.email });
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

  ngOnDestroy() {} 
  
  toggleFieldTextType(){
    this.fieldTextType = !this.fieldTextType;
  }

}
