import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ModalContainerBaseClassComponent } from 'src/app/components/modal-container-base-class/modal-container-base-class.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MustMatch } from 'src/app/_helpers/must-match.validators';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent extends ModalContainerBaseClassComponent implements OnInit, OnDestroy {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() pageData;
  @Output() valueChange = new EventEmitter();
  signupForm: FormGroup;
  submitted = false;
  closeResult = '';
  is_gender: boolean = false;
  is_type: string = '';
  email: string = '';

  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService : UserService,
    public router: Router
    ) {
    super(modalService);
  }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$')]],
      confirm_password: ['', [Validators.required, Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$')]],
      gender: ['', Validators.required],
      term_condition: ['', Validators.required],
    },{
      validator: MustMatch('password', 'confirm_password')
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openSignInPage() {
    this.pageData = true;
    this.valueChange.emit({ key: 'signIn', value: this.pageData });
  }

  openOtpPage() {
    this.pageData = true;
    this.valueChange.emit({ key: 'otpModal', value: this.pageData,email:this.email });
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
  
  ngAfterViewInit(){
    this.email = 'mohit@gmail.com';//this.signupForm.value.email;

  }
  
  onSubmit() {
    this.email = 'mohit@gmail.com';//this.signupForm.value.email;
    this.openOtpPage();
    this.submitted = true;
    
    if(this.signupForm.controls.gender.errors && this.is_gender){
      this.signupForm.controls.gender.setValue(this.is_type);
    }
    if (this.signupForm.invalid) {
      this.submitted = true;      
      return;
    } else {
      this.email = this.signupForm.value.email;
      this.userService.signup(this.signupForm.value).subscribe((data: any) => {
        this.submitted = false;    
      }, (error: HttpErrorResponse) => {       
        console.log(error);
        this.submitted = false;
      });
    }
  }
}
