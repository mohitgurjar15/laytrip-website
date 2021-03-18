import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild, Renderer2 } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { MustMatch } from '../../../_helpers/must-match.validators';
import { HttpErrorResponse } from '@angular/common/http';
import { VerifyOtpComponent } from '../verify-otp/verify-otp.component';
import { RecaptchaComponent } from 'ng-recaptcha';
import { CommonFunction } from '../../../_helpers/common-function';

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
  emailForVerifyOtp: string = '';
  loading: boolean = false;
  cnfPassFieldTextType: boolean;
  passFieldTextType: boolean;
  apiError = '';
  is_email_available = false;
  emailExist = false;
  public isCaptchaValidated: boolean = false;
  public message: string = "";
  iAccept: boolean = false;
  @ViewChild('captchaElem', { static: false }) captchaElem: RecaptchaComponent;

  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public router: Router,
    public renderer: Renderer2,
    public commonFunction: CommonFunction,

  ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
      last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$')]],
      confirm_password: ['', Validators.required],
      checked: ['', Validators.required],
    }, {
      validators: MustMatch('password', 'confirm_password'),
    });
    this.isCaptchaValidated = false;
  }

  openOtpPage() {
    Object.keys(this.signupForm.controls).forEach(key => {
      this.signupForm.get(key).markAsUntouched();
    });
    this.signupForm.reset();
    this.submitted = false;
    this.isCaptchaValidated = false;
    $('#sign_up_modal').modal('hide');
    const modalRef = this.modalService.open(VerifyOtpComponent, { windowClass: 'otp_window', centered: true, backdrop: 'static', keyboard: false });
    (<VerifyOtpComponent>modalRef.componentInstance).isSignup = true;
    (<VerifyOtpComponent>modalRef.componentInstance).emailForVerifyOtp = this.emailForVerifyOtp;
  }

  closeModal() {
    this.apiError = '';
    this.isCaptchaValidated = false;
    this.submitted = false;
    Object.keys(this.signupForm.controls).forEach(key => {
      this.signupForm.get(key).markAsUntouched();
    });
    this.signupForm.reset();
    $('#sign_up_modal').modal('hide');
  }


  toggleFieldTextType(event) {
    if (event.target.id == 'passEye') {
      this.passFieldTextType = !this.passFieldTextType;

    } else if (event.target.id == 'cnfEye') {
      this.cnfPassFieldTextType = !this.cnfPassFieldTextType;
    }
  }

  captchaResponse(response: string) {
    this.isCaptchaValidated = true;
  }

  onSubmit() {
    this.submitted = this.loading = true;
    if (this.signupForm.invalid || !this.isCaptchaValidated || !this.iAccept) {
      Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.get(key).markAsTouched();
      });
      this.signupForm.reset();
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

  openSignInModal() {
    this.isCaptchaValidated = false;
    this.submitted = false;
    Object.keys(this.signupForm.controls).forEach(key => {
      this.signupForm.get(key).markAsUntouched();
    });
    this.signupForm.reset();
    setTimeout(() => {
      this.renderer.addClass(document.body, 'modal-open');
    }, 1000);
    $('#sign_up_modal').modal('hide');
    this.emailExist = false;
  }

  socialError(error) {
    this.apiError = error;
  }

  checkAccept(event) {
    if (event.target.checked) {
      this.iAccept = true;
    } else {
      this.iAccept = false;
    }
  }

  checkEmailExist(emailString) {
    if (this.signupForm.controls.email.valid) {
      this.userService.emailVeryfiy(emailString).subscribe((data: any) => {
        if (data && data.is_available) {
          this.is_email_available = data.is_available;
          this.emailExist = true;
        } else {
          this.emailExist = false;
        }
      });
    }
  }
}
