import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericService } from '../../../services/generic.service';
import { environment } from '../../../../environments/environment';
import { CommonFunction } from '../../../_helpers/common-function';
import { ToastrService } from 'ngx-toastr';

export enum MODAL_TYPE {
  CLOSE,
}

@Component({
  selector: 'app-apple-security-login-popup',
  templateUrl: './apple-security-login-popup.component.html',
  styleUrls: ['./apple-security-login-popup.component.scss']
})
export class AppleSecurityLoginPopupComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  appleLoginForm: FormGroup;
  loading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private formBuilder: FormBuilder,
    private genericService: GenericService,
    public commonFunction: CommonFunction,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.appleLoginForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
      last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
    });
  }

  close() {
    this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
  }

  onSubmit(formValue) {
    this.loading = true;
    if (this.appleLoginForm.invalid) {
      Object.keys(this.appleLoginForm.controls).forEach(key => {
        this.appleLoginForm.get(key).markAsTouched();
      });
      this.loading = false;
      return;
    }
    // API CALL
    this.genericService.updateViaAppleLogin(formValue).subscribe((res: any) => {
      if (res) {
        localStorage.setItem("_lay_sess", res.token);
        this.loading = false;
        this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
      }
    }, error => {
      this.loading = false;
      if (error && error.status === 409) {
        this.toastr.show('This email address is already registered with us. Please enter different email address.', '', {
          toastClass: 'custom_toastr',
          titleClass: 'custom_toastr_title',
          messageClass: 'custom_toastr_message',
        });
      } else {
        this.toastr.show(error.message, '', {
          toastClass: 'custom_toastr',
          titleClass: 'custom_toastr_title',
          messageClass: 'custom_toastr_message',
        });
      }
    });
  }

}
