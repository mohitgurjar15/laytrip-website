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
        let queryParam: any = {};
        if (this.commonFunction.isRefferal()) {
          let parms = this.commonFunction.getRefferalParms();
          queryParam.utm_source = parms.utm_source ? parms.utm_source : '';
          queryParam.utm_medium = parms.utm_medium ? parms.utm_medium : '';
          this.router.navigate(['/'], { queryParams: queryParam });
        } else {
          this.router.navigate(['/']);
        }
      } else {
        redirectToLogin();
      }
    }
  }

}
