import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { environment } from '../../../../environments/environment';
declare var $ : any;

@Component({
  selector: 'app-user-benefit',
  templateUrl: './user-benefit.component.html',
  styleUrls: ['./user-benefit.component.scss']
})
export class UserBenefitComponent implements OnInit {

  roleId;
  userDetails;
  s3BucketUrl = environment.s3BucketUrl;
  loading=false;
  constructor(
    public router :Router
  ) { }

  ngOnInit() {
    this.userDetails = getLoginUserInfo();    
  }
  
  ngAfterContentChecked(){
    this.userDetails = getLoginUserInfo();    
  }
  subscribeNow(){
    this.loading = true;
    if(this.userDetails.roleId == 6){
      this.loading = false;
      this.router.navigate(['account/subscription']);
    } else if(this.userDetails.roleId == 7 || !this.userDetails.roleId){
      this.loading = false;
      localStorage.setItem("_isSubscribeNow","Yes");
      $('#sign_in_modal').modal('show');
    } 
  }
}
