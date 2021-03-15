import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';

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
  cookieExpiredDate = new Date();

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private cookieService: CookieService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.cookieExpiredDate.setDate(this.cookieExpiredDate.getSeconds() + 5);
  }

  close() {
    this.cookieService.put('__cke', JSON.stringify(true), { expires: new Date(moment().add(50, "years").format()) });
    this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
  }

  acceptCookiePolicy() {
    this.cookieService.put('__cke', JSON.stringify(true), { expires: new Date(moment().add(50, "years").format()) });
    this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
  }

  goToPrivacyPolicy() {
    this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
    this.router.navigate(['/privacy-policy']);
  }

}
