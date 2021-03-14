import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../environments/environment';

export enum MODAL_TYPE {
  CLOSE,
}

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss']
})
export class CookiePolicyComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private cookieService: CookieService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  close() {
    this.cookieService.put('__cke', JSON.stringify(true));
    this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
  }

  acceptCookiePolicy() {
    this.cookieService.put('__cke', JSON.stringify(true));
    this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
  }

  goToPrivacyPolicy() {
    this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
    this.router.navigate(['/privacy-policy']);
  }

}
