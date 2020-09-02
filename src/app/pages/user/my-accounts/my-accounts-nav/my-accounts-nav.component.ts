import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { getUserDetails } from '../../../../_helpers/jwt.helper';

@Component({
  selector: 'app-my-accounts-nav',
  templateUrl: './my-accounts-nav.component.html',
  styleUrls: ['./my-accounts-nav.component.scss']
})
export class MyAccountsNavComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  profile_pic : string = '';
  _login_user_info : any =[];
  public defaultImage = this.s3BucketUrl+'assets/images/profile_im.svg';

  constructor() { }

  ngOnInit() {
  }
  
  ngDoCheck(){  
    this._login_user_info =  getUserDetails(localStorage.getItem("_lay_sess"));
    this.profile_pic = this._login_user_info.profilePic;
  }
                                                                                                                                                
}
