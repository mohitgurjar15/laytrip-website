import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunction } from '../../_helpers/common-function';
import { getUserDetails, redirectToLogin } from '../../_helpers/jwt.helper';

@Component({
  selector: 'app-sso-login',
  templateUrl: './sso-login.component.html',
  styleUrls: ['./sso-login.component.scss']
})
export class SsoLoginComponent implements OnInit {
  token = '';
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
    this.route.queryParams.forEach(params => {
      this.token = params.sid
    })
    this.ssonLogin();
  }

  ssonLogin() {
    if (this.token) {
      var userDetail = getUserDetails(this.token);
      if (userDetail && userDetail.roleId != 7) {
        localStorage.setItem("_lay_sess", this.token);
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
          this.router.navigate(['/'], { queryParams: queryParams });
        } else {
          this.router.navigate(['/']);
        }
      } else {
        redirectToLogin();
      }
    }
  }

}
