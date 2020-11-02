import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mobile-and-subscribe',
  templateUrl: './mobile-and-subscribe.component.html',
  styleUrls: ['./mobile-and-subscribe.component.scss']
})
export class MobileAndSubscribeComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  subscribeForm:FormGroup;
  submitted = false;
  loading = false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService

  ) { }

  ngOnInit() {
    this.subscribeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
    });
  }

  subscribeNow(){
    this.submitted = this.loading = true;
    if (this.subscribeForm.invalid) {
      this.submitted = true;
      this.loading = false;
      return;
    } else {
      this.userService.subscribeNow(this.subscribeForm.value.email).subscribe((data: any) => {
        this.submitted = this.loading  = false;
        
      }, (error: HttpErrorResponse) => {
        this.submitted = this.loading  = false;        
      });
    }
  }
}
