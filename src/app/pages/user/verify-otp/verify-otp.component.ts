import { Component, OnInit, Output, Input,EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() pageData;
  @Output() valueChange = new EventEmitter();
  otpForm: FormGroup;
  submitted = false;

  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService : UserService
    ) { }

  ngOnInit() {
    this.otpForm = this.formBuilder.group({
      otp: ['', Validators.required],
    });
  }

  validateNumber(e: any) {
    let input = String.fromCharCode(e.charCode);
    const reg = /^[0-9]*$/;
    
    if (!reg.test(input)) {
      e.preventDefault();
    }
  }

  onSubmit() {
   
    this.submitted = true;
    if (this.otpForm.invalid) {
      this.submitted = true;      
      return;
    } else {
      console.log(this.otpForm.value)
      this.userService.verifyOtp(this.otpForm.value).subscribe((data: any) => {
        console.log(data)
      this.submitted = false;      
      }, (error: HttpErrorResponse) => {       
        console.log(error);
        this.submitted = false;
      }); 
    }
  }
}
