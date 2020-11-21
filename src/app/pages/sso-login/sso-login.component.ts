import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  getUserDetails, redirectToLogin } from '../../_helpers/jwt.helper';

@Component({
  selector: 'app-sso-login',
  templateUrl: './sso-login.component.html',
  styleUrls: ['./sso-login.component.scss']
})
export class SsoLoginComponent implements OnInit {
  token='';
  constructor(    
    private route: ActivatedRoute,
    public router: Router
    ) { }

  ngOnInit() {
    this.route.queryParams.forEach(params => {
      this.token  = params.sid
    })
    this.ssonLogin();
  }

  ssonLogin(){
    if(this.token){
      var userDetail = getUserDetails(this.token);
      if(userDetail && userDetail.roleId != 7 ){
        localStorage.setItem("_lay_sess", this.token);
        this.router.navigate(['/']);
      } else {
        redirectToLogin();
      }
    }
  }

}
