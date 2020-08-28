import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { MustMatch } from '../../../_helpers/must-match.validators';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit, OnDestroy {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() pageData;
  @Output() valueChange = new EventEmitter();
  signupForm: FormGroup;
  submitted = false;
  closeResult = '';
  is_gender: boolean = true;
  is_type: string = 'M';
  emailForVerifyOtp : string = '';
  loading: boolean = false;
  cnfPassFieldTextType :  boolean;
  checkboxError :  boolean=false;
  passFieldTextType :  boolean;
  apiError =  '';
  term_conditionError =  false;


  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService : UserService,
    public router: Router,
    ) {}

  ngOnInit() {    

    this.signupForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$')]],
      confirm_password: ['', Validators.required],
      gender: ['', Validators.required],
      term_condition: ['', Validators.required],
    },{
      validator: MustMatch('password', 'confirm_password'),
    });
  }  

  openSignInPage() {
    $('.modal_container').removeClass('right-panel-active');
    $('.forgotpassword-container').removeClass('show_forgotpass');
    this.pageData = true;
    this.valueChange.emit({ key: 'signIn', value: this.pageData });
  }

  openOtpPage() {
    this.pageData = true;
    this.valueChange.emit({ key: 'otpModal', value: this.pageData,emailForVerifyOtp:this.emailForVerifyOtp });
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
  
  isChecked(event) {
    if(event.target.checked){
      this.checkboxError = false;      
    } else {
      this.checkboxError = true;
    }
  }
  ngOnDestroy() {}

 
  clickGender(event,type){
    this.is_type = '';
    this.is_gender = false;       
      if(type =='M'){
        this.is_type = 'M';
      } else if(type =='F'){
        this.is_type = 'F';        
      } else if(type =='N') {
        this.is_type = 'N';
      } else {
        this.is_gender = false;
        this.is_type = '';
      }
      this.is_gender = true;
  }
    
  onSubmit() {
    // this.openOtpPage();
    this.submitted = true;
    
    this.loading = this.checkboxError = true;
    if(this.signupForm.controls.gender.errors && this.is_gender){
      this.signupForm.controls.gender.setValue(this.is_type);
    } if(this.signupForm.controls.term_condition.errors){
      this.checkboxError = true;
    }
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
        console.log(error);
        this.apiError = error.message;
        this.submitted = this.loading = false;
      });
    }
  }
}
