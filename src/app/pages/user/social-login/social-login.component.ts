import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})

export class SocialLoginComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  apiError :string =  '';
  test : boolean = false;

  constructor(
    private userService: UserService,
    public router: Router,
    public modalService: NgbModal,
    public location: Location
  ) { }

  @ViewChild('loginRef') loginElement: ElementRef;
  auth2: any;

  ngOnInit() {
    let userToken = localStorage.getItem('_lay_sess');
    console.log('social',userToken)
    if(!userToken){      
      console.log('done')
      this.loadGoogleSdk();
      this.loadFacebookSdk();
    }
  }

  loadGoogleSdk() {
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: environment.google_client_id,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.googleLogin();
      });
    }

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));

  }


  googleLogin() {

    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleUser) => {

        let profile = googleUser.getBasicProfile();
        
        //YOUR CODE HERE
        let json_data = {
          "account_type": 1,
          "name": profile.getName(),
          "email": profile.getEmail(),
          "social_account_id": profile.getId(),
          "device_type": 1,
          "device_model": "RNE-L22",
          "device_token": "123abc#$%456",
          "app_version": "1.0",
          "os_version": "7.0"
        };
        this.userService.socialLogin(json_data).subscribe((data: any) => {
          if (data.user_details) {
            localStorage.setItem("_lay_sess", data.user_details.access_token);
            $('#sign_in_modal').modal('hide');
            this.router.url;
            document.getElementById('navbarNav').click(); 
          }
        }, (error: HttpErrorResponse) => {
          console.log(error)
        });
      }, (error) => {
        console.log(error)
      });
  }
  ngOnDestroy() {} 

  loadFacebookSdk() {

    (window as any).fbAsyncInit = function () {
      window['FB'].init({
        appId: environment.fb_api_key,
        cookie: true,
        xfbml: true,
        version: 'v3.1',
        proxy: true,
        callbackURL: "/auth/facebook/callback"
      });
      window['FB'].AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }

  fbLogin() {
   
    window['FB'].login((response) => {          

      if (response.authResponse) {

        window['FB'].api('/me', {
          fields: 'last_name, first_name, email'
        }, (userInfo) => {
          let json_data = {
            "account_type": 1,
            "name": userInfo.first_name + ' ' + userInfo.last_name,
            "email": userInfo.email ? userInfo.email : '',
            "social_account_id": userInfo.id,
            "device_type": 1,
            "device_model": "Angular web",
            "device_token": "123abc#$%456",
            "app_version": "1.0",
            "os_version": "7.0"
          };

          this.userService.socialLogin(json_data).subscribe((data: any) => {
            
            if (data.user_details) {
              localStorage.setItem("_lay_sess", data.user_details.access_token);
              $('#sign_in_modal').modal('hide');
              this.test = true;
              document.getElementById('navbarNav').click(); 
              this.router.url;  
            } 
           
          }, (error: HttpErrorResponse) => {
            console.log(error)
          });

        });
      } else {
        this.apiError = 'User login failed';
        console.log('User login failed');
      }
    }, { scope: 'email' });
  }

  ngDoCheck(){ }
}
