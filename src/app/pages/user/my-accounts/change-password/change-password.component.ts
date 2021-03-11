import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';
import { MustMatch } from '../../../../_helpers/must-match.validators';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  changePasswordForm: FormGroup;
  submitted = false;
  loading: boolean = false;
  oldPassFieldTextType: boolean;
  cnfPassFieldTextType: boolean;
  passFieldTextType: boolean;
  apiError = '';
  @Output() loadingValue = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      old_password: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$')]],
      confirm_password: ['', [Validators.required]],
    }, {
      validator: MustMatch('password', 'confirm_password'),
    });
  }

  onSubmit() {

    this.loadingValue.emit(true);
    this.submitted = true;

    if (this.changePasswordForm.invalid) {
      this.loadingValue.emit(false);
      // this.submitted = false;
      return;
    } else {
      let jsonFromData = {
        old_password: this.changePasswordForm.value.old_password,
        password: this.changePasswordForm.value.password,
        confirm_password: this.changePasswordForm.value.confirm_password,
      };
      this.userService.changePassword(jsonFromData).subscribe((data: any) => {
        this.loadingValue.emit(false);
        this.changePasswordForm.reset();
        // this.toastr.success("Your password has been updated successfully!", 'Password Updated');
        this.toastr.show('Your password has been updated successfully!', 'Password Updated', {
          toastClass: 'custom_toastr',
          titleClass: 'custom_toastr_title',
          messageClass: 'custom_toastr_message',
        });
        this.submitted = false;

      }, (error: HttpErrorResponse) => {
        this.submitted = false;
        this.apiError = error.message;
        this.loadingValue.emit(false);
        // this.toastr.error(error.error.message, 'Error Change Password');
        this.toastr.show(error.error.message, 'Error Change Password', {
          toastClass: 'custom_toastr',
          titleClass: 'custom_toastr_title',
          messageClass: 'custom_toastr_message',
        });
      });
    }
  }

  toggleFieldTextType(event) {
    if (event.target.id == 'passEye') {
      this.passFieldTextType = !this.passFieldTextType;

    } else if (event.target.id == 'cnfEye') {
      this.cnfPassFieldTextType = !this.cnfPassFieldTextType;

    } else if (event.target.id == 'oldEye') {
      this.oldPassFieldTextType = !this.oldPassFieldTextType;

    }
  }
}
