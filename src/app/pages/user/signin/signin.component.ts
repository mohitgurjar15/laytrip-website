import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SignupComponent } from '../signup/signup.component';
import { ModalContainerBaseClassComponent } from 'src/app/components/modal-container-base-class/modal-container-base-class.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent extends ModalContainerBaseClassComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  signUpModal = false;

  @Input() pageData;
  @Output() valueChange = new EventEmitter();

  constructor(public modalService: NgbModal) {
    super(modalService);
  }

  ngOnInit() {
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

  close() {
    console.log('here')
  }

}
