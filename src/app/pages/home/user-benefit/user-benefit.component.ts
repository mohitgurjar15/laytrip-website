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
      if (this.commonFunction.isRefferal()) {
        let parms = this.commonFunction.getRefferalParms();
        var queryParams: any = {};
        queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
        if(parms.utm_medium){
          queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        }
        if(parms.utm_campaign){
          queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
        }
        this.router.navigate(['account/subscription'], { queryParams: queryParams });
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
