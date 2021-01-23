import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { MustMatch } from '../../../_helpers/must-match.validators';
import { HttpErrorResponse } from '@angular/common/http';
import { VerifyOtpComponent } from '../verify-otp/verify-otp.component';

declare var $: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() pageData;
  @Output() valueChange = new EventEmitter();
  signupForm: FormGroup;
  submitted = false;
  closeResult = '';
  is_type: string = 'M';
  emailForVerifyOtp : string = '';
  loading: boolean = false;
  cnfPassFieldTextType :  boolean;
  passFieldTextType :  boolean;
  apiError =  '';


  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService : UserService,
    public router: Router,
    ) {}

  ngOnInit() {    
    
    this.signupForm = this.formBuilder.group({
      first_name:['',[Validators.required,Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
      last_name:['',[Validators.required,Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$')]],
      confirm_password: ['', Validators.required],
      checked:  ['', Validators.required],      
    },{
      validators: MustMatch('password', 'confirm_password'),     
    });
    this.signupForm.reset();
  }  

  openSignInPage() {
    $('.modal_container').removeClass('right-panel-active');
    $('.forgotpassword-container').removeClass('show_forgotpass');
    this.pageData = true;
    this.valueChange.emit({ key: 'signIn', value: this.pageData });
  }

  openOtpPage() {
    $('#sign_up_modal').modal('hide');
    const modalRef = this.modalService.open(VerifyOtpComponent, {windowClass:'otp_window', centered: true});
    (<VerifyOtpComponent>modalRef.componentInstance).emailForVerifyOtp = this.emailForVerifyOtp;
  }

  closeModal(){
    this.valueChange.emit({ key: 'signIn', value: true });
    $('#sign_in_modal').modal('hide');
  }

  toggleFieldTextType(event){
    if(event.target.id == 'passEye'){
      this.passFieldTextType = !this.passFieldTextType;
      
    }else if(event.target.id == 'cnfEye'){
      this.cnfPassFieldTextType = !this.cnfPassFieldTextType;

    }
  } 
 
    
  onSubmit() {
  // this.openOtpPage();
  // return;
    this.submitted = this.loading  = true;   
    console.log(this.signupForm.controls)
    if (this.signupForm.invalid) {
      this.submitted = true;      
      this.loading = false;
      return;
    } else {
      
      this.userService.signup(this.signupForm.value).subscribe((data: any) => {
        this.emailForVerifyOtp = this.signupForm.value.email;
        this.submitted = this.loading = false;         
        this.openOtpPage();   
      }, (error: HttpErrorResponse) => {       
        this.apiError = error.message;
        this.submitted = this.loading = false;
      });
    }
  }

  openSignInModal(){
    $('#sign_up_modal').modal('hide');
  }
  socialError(error){
    this.apiError = error;
  } 
}
