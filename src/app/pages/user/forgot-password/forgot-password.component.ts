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
  apiMessage =  '';
  forgotPasswordSuccess : boolean = false;

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
    $('.modal_container').removeClass('right-panel-active');
    $('.forgotpassword-container').removeClass('show_forgotpass');  
  }

  onSubmit() {
   
    this.submitted = this.loading = true;
    
    if (this.forgotForm.invalid) {
      this.submitted = true;      
      this.loading = false;      
      return;
    } else {
        // this.loading = true;     
      //this.userService.forgotPassword(this.forgotForm.value).subscribe((data: any) => {
        this.submitted = false;    
        // this.forgotPasswordSuccess = true;
        this.valueChange.emit({ key: 'reset-password', value: true,emailForVerifyOtp:this.forgotForm.value.email,isReset:true });  
        $('.modal_container').addClass('right-panel-active');
        $('.resetpass-container').addClass('show_resetpass');
      /* }, (error: HttpErrorResponse) => {       
        this.submitted = this.loading  = false;
        this.apiMessage = error.message;

      }); */
    }
  }
}
