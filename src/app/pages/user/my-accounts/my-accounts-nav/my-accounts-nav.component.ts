import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonFunction } from '../../../../_helpers/common-function';
import { environment } from '../../../../../environments/environment';
import { getUserDetails } from '../../../../_helpers/jwt.helper';

@Component({
  selector: 'app-my-accounts-nav',
  templateUrl: './my-accounts-nav.component.html',
  styleUrls: ['./my-accounts-nav.component.scss']
})
export class MyAccountsNavComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  profile_pic: string = '';
  _login_user_info: any = [];
  isLoggedIn = false;
  expanded: boolean;
  expandedSecond: boolean;
  expandedThird: boolean;


  public defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';

  constructor(public router: Router,
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
  }

  ngDoCheck() {
    this._login_user_info = getUserDetails(localStorage.getItem("_lay_sess"));
    this.profile_pic = this._login_user_info.profilePic ? this._login_user_info.profilePic : '';
    this.checkUser();
  }

  checkUser() {
    let userToken = localStorage.getItem('_lay_sess');

    if (userToken && userToken != 'undefined') {
      this.isLoggedIn = true;
    }
  }

  ngOnDestroy() { }

  onLoggedout() {
    this.isLoggedIn = false;
    localStorage.removeItem('_lay_sess');
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
  }

  onToggleSubMenu(event) {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.expandedSecond = false;
      this.expandedThird = false;
    }
  }

}
