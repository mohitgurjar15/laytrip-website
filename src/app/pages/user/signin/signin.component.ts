import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SignupComponent } from '../signup/signup.component';
import { ModalContainerBaseClassComponent } from 'src/app/components/modal-container-base-class/modal-container-base-class.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent extends ModalContainerBaseClassComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  signUpModal = false;
  loginForm: FormGroup;
  submitted = false;
  public loading: boolean = false;

  @Input() pageData;
  @Output() valueChange = new EventEmitter();
  
  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService : UserService,
    public router: Router
    ) {
    super(modalService);
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$')]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {    

    this.submitted = true;
    this.loading = true;
    if (this.loginForm.invalid) {
      this.submitted = true;
      this.loading = false;
      return;
    } else {
      
      this.userService.signin(this.loginForm.value).subscribe((data: any) => {
        if(data.token){
          localStorage.setItem("_lay_sess", data.token);
          $('#sign_in_modal').modal('hide');
          this.loading = false;
          this.submitted = false;
          this.router.navigate(['/']);      
        }
      }, (error: HttpErrorResponse) => {       
        console.log(error);
        this.submitted = false;
        this.loading = false;
      });
    }
  }

  openPage(event) {
    if (event && event.value === 'forgotPassword') {
      this.pageData = true;
      this.valueChange.emit({ key: 'forgotPassword', value: this.pageData });
    } else if (event && event.value === 'signUp') {
      this.pageData = true;
      this.valueChange.emit({ key: 'signUp', value: this.pageData });
    }
  }

  ngOnDestroy() {
      // this.pageData = true;
      // this.valueChange.emit({ key: 'signUp', value: this.pageData });

      // console.log('signinDestroy')    

      // $('#sign_in_modal').modal('hide');
      // this.signUpModal = true;
  }
  


}
