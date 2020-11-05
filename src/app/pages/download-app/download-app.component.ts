import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-download-app',
  templateUrl: './download-app.component.html',
  styleUrls: ['./download-app.component.scss']
})
export class DownloadAppComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  subscribeForm: FormGroup;
  submitted = false;
  loading = false;
  success = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.subscribeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
    });
  }

  subscribeNow() {
    this.submitted = this.loading = true;
    if (this.subscribeForm.invalid) {
      this.submitted = true;
      this.loading = false;
      return;
    } else {
      this.userService.subscribeNow(this.subscribeForm.value.email).subscribe((data: any) => {
        this.submitted = this.loading = false;
        this.success = true;
        this.toastr.success(data.message, 'Subscribed Successful');
      }, (error: HttpErrorResponse) => {
        this.submitted = this.loading = this.success = false;
        this.toastr.error(error.error.message, 'Subscribed Error');
      });
    }
  }

}
