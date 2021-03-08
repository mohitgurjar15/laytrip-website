import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mobile-and-subscribe',
  templateUrl: './mobile-and-subscribe.component.html',
  styleUrls: ['./mobile-and-subscribe.component.scss']
})
export class MobileAndSubscribeComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  subscribeForm: FormGroup;
  submitted = false;
  loading = false;
  success = false;
  error = false;
  successMessage = '';
  errorMessage = '';
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private elementRef: ElementRef
  ) { }

  // @HostListener('click', ['$event.target'])
  // public onClick(target) {
  //   console.log('OUTSIDE:::::');
  //   const clickedInside = this.elementRef.nativeElement.contains(target);
  //   if (!clickedInside) {
  //     console.log('OUTSIDE:::::');
  //     // this.clickOutside.emit();
  //   }
  // }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    this.submitted = false;
    let controls = this.subscribeForm.controls;
    Object.keys(controls).forEach(controlName =>
      controls[controlName].markAsUntouched()
    );
  }

  ngOnInit() {
    this.subscribeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
    });
  }

  changeEmail() {
    this.successMessage = '';
    this.errorMessage = '';
    this.success = false;
    this.error = false;
  }

  subscribeNow() {
    this.submitted = this.loading = true;
    if (this.subscribeForm.controls.email.invalid) {
      this.submitted = true;
      this.errorMessage = 'Please enter valid email address.';
    }
    if (this.subscribeForm.invalid) {
      let controls = this.subscribeForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.submitted = true;
      this.loading = false;
      return;
    } else {
      this.userService.subscribeNow(this.subscribeForm.value.email).subscribe((data: any) => {
        this.submitted = this.loading = false;
        this.success = true;
        this.error = false;
        this.errorMessage = '';
        this.subscribeForm.markAsUntouched();
        this.subscribeForm.controls.email.setValue('');
        this.successMessage = data.message;
        // this.toastr.success(data.message, '');
      }, (error: HttpErrorResponse) => {
        console.log('sd')
        this.error = true;
        this.successMessage = '';
        this.submitted = this.loading = this.success = false;
        this.subscribeForm.controls.email.setValue('');
        this.subscribeForm.markAsUntouched();
        this.errorMessage = error.error.message;
        // this.toastr.error(error.error.message, 'Subscribed Error');
      });
    }
  }

  ngDoCheck(){
    if(this.error || this.success){
      setTimeout(() => {
        this.success = false;
        this.error = false;    
      }, 2000);
    }
  }
}
