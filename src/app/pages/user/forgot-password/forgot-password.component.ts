import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
declare var $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() pageData;
  @Output() valueChange = new EventEmitter();
  forgotForm: FormGroup;
  submitted = false;
  forgotModal = false;
  loading: boolean = false;
  apiMessage = '';
  forgotEmail = '';
  forgotPasswordSuccess: boolean = false;

  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public activeModal: NgbActiveModal
  ) { }


  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
    });
  }

  onSubmit() {

    this.submitted = this.loading = true;

    if (this.forgotForm.invalid) {
      Object.keys(this.forgotForm.controls).forEach(key => {
        this.forgotForm.get(key).markAsUntouched();
      });
      this.submitted = true;
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.userService.forgotPassword(this.forgotForm.value).subscribe((data: any) => {
        this.submitted = false;
        this.forgotPasswordSuccess = true;
        this.forgotEmail = this.forgotForm.value.email;
        this.openResetModal();
      }, (error: HttpErrorResponse) => {
        this.submitted = this.loading = false;
        this.apiMessage = error.message;
      });
    }
  }

  closeModal() {
    this.apiMessage = '';
    this.submitted = false;
    this.activeModal.close();
    Object.keys(this.forgotForm.controls).forEach(key => {
      this.forgotForm.get(key).markAsUntouched();
    });
    this.forgotForm.reset();
  }

  openResetModal() {
    this.apiMessage = '';
    this.submitted = false;
    Object.keys(this.forgotForm.controls).forEach(key => {
      this.forgotForm.get(key).markAsUntouched();
    });
    this.forgotForm.reset();
    this.activeModal.close();
    setTimeout(() => {
      $('body').addClass('modal-open');
    }, 1000);

    const modalRef = this.modalService.open(ResetPasswordComponent, { windowClass: 'reset_pass_window', centered: true, backdrop: 'static', keyboard: false });
    (<ResetPasswordComponent>modalRef.componentInstance).emailForVerifyOtp = this.forgotEmail;
  }
}
