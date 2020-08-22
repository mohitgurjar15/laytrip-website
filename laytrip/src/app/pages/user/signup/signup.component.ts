import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent  implements OnInit, OnDestroy {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() pageData;
  @Output() valueChange = new EventEmitter();
  signupForm: FormGroup;

  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder
    ) {
  }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  openSignInPage() {
    this.pageData = true;
    this.valueChange.emit({ key: 'signIn', value: this.pageData });
  } 

  ngOnDestroy() {
    
  }

}
