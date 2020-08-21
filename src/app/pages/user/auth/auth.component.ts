import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  signInModal = false;
  signUpModal = false;
  forgotPasswordModal = false;

  constructor(public modalService: NgbModal) { }

  ngOnInit() {
    this.signInModal = true;
  }

  pageChange(event) {

    if (event && event.key === 'signUp' && event.value) {
      this.signUpModal = true;
      this.signInModal = false;
      this.forgotPasswordModal = false;
    } else if (event && event.key === 'forgotPassword' && event.value) {
      this.signInModal = false;
      this.signUpModal = false;
      this.forgotPasswordModal = true;
    } else if (event && event.key === 'signIn' && event.value) {
      this.signInModal = true;
      this.signUpModal = false;
      this.forgotPasswordModal = false;
    }
  }
}
