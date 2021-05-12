import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { environment } from '../../../../environments/environment';
import { CommonFunction } from '../../../_helpers/common-function';
declare var $: any;

@Component({
  selector: 'app-user-benefit',
  templateUrl: './user-benefit.component.html',
  styleUrls: ['./user-benefit.component.scss']
})
export class UserBenefitComponent implements OnInit {

  roleId;
  userDetails;
  s3BucketUrl = environment.s3BucketUrl;
  loading = false;
  constructor(
    public router: Router,
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
    this.userDetails = getLoginUserInfo();
  }

  ngAfterContentChecked() {
    this.userDetails = getLoginUserInfo();
  }
  subscribeNow() {
    this.loading = true;
    if (this.userDetails.roleId == 6) {
      this.loading = false;
      let queryParam: any = {};
      if (this.commonFunction.isRefferal()) {
        let parms = this.commonFunction.getRefferalParms();
        queryParam.utm_source = parms.utm_source ? parms.utm_source : '';
        queryParam.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        this.router.navigate(['account/subscription'], { queryParams: queryParam });
      } else {
        this.router.navigate(['account/subscription']);
      }
    } else if (this.userDetails.roleId == 7 || !this.userDetails.roleId) {
      this.loading = false;
      localStorage.setItem("_isSubscribeNow", "Yes");
      $('#sign_in_modal').modal('show');
    }
  }
}
