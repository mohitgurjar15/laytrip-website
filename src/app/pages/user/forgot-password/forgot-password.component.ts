import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() pageData;
  @Output() valueChange = new EventEmitter();
  forgotForm: FormGroup;
  submitted = false;
  forgotModal = false;
  loading: boolean = false;
  forgotPasswordSuccess : boolean = false;
  apiError =  '';

  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService : UserService  
      ) { }


  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
    });
  }

  closeModal(){
      this.valueChange.emit({ key: 'signIn', value: true });
      $('#sign_in_modal').modal('hide');
  }
  

  openPage(event) {
    this.pageData = true;
    this.valueChange.emit({ key: 'forgotPassword', value: this.pageData });
  }

  ngOnDestroy() {}

  openSignInPage() {
    this.pageData = true;
    this.valueChange.emit({ key: 'signIn', value: this.pageData });
  }
  onSubmit() {
   
    this.submitted = this.loading = true;
    
    if (this.forgotForm.invalid) {
      this.submitted = true;      
      this.loading = false;      
      return;
    } else {
        this.loading = true;     
        this.userService.forgotPassword(this.forgotForm.value).subscribe((data: any) => {
        this.submitted = false;    
        this.forgotPasswordSuccess = true;  
      }, (error: HttpErrorResponse) => {       
        this.submitted = this.loading  = false;
        this.apiError = error.message;

      });
    }
  }
}
