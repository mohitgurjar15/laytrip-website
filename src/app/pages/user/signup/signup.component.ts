import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ModalContainerBaseClassComponent } from 'src/app/components/modal-container-base-class/modal-container-base-class.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MustMatch } from 'src/app/_helpers/must-match.validators';
import { VerifyOtpComponent } from '../verify-otp/verify-otp.component';

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
      email: ['', Validators.required],
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

  ngOnDestroy() {
    
  }

  is_gender: boolean = false;
  is_type: string = '';
  
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
    $('#sign_up_modal').modal('hide');
    const modalRef = this.modalService.open(VerifyOtpComponent);
    modalRef.componentInstance.name = 'Mohit';

    this.submitted = true;
    
    if(this.signupForm.controls.gender.errors && this.is_gender){
      this.signupForm.controls.gender.setValue(this.is_type);
    }
    if (this.signupForm.invalid) {
      this.submitted = false;      
      return;
    } else {
      $('#sign_in_modal').modal('hide');
      const modalRef = this.modalService.open(VerifyOtpComponent);
      modalRef.componentInstance.name = 'Mohit';
  
      /* this.userService.signup(this.signupForm.value).subscribe((data: any) => {
        
        console.log(data)
        this.submitted = false;
            
      }, (error: HttpErrorResponse) => {       
        console.log(error);
        this.submitted = false;
      }); */
    }
  }
}
