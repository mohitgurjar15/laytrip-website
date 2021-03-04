import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-apple-security-login-popup',
  templateUrl: './apple-security-login-popup.component.html',
  styleUrls: ['./apple-security-login-popup.component.scss']
})
export class AppleSecurityLoginPopupComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router
  ) { }

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }

}
