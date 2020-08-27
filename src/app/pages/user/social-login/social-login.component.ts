import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})

export class SocialLoginComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  apiError :string =  '';


  constructor(
    private userService: UserService,
    public router: Router,
    public modalService: NgbModal
  ) { }

  @ViewChild('loginRef') loginElement: ElementRef;
  auth2: any;

  ngOnInit() {
    this.loadGoogleSdk();
    this.loadFacebookSdk();
  }

  loadGoogleSdk() {
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: '562377259795-3e19h9as9mqt4rhrreoqqlsf3ae89knh.apps.googleusercontent.com',
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
            this.router.navigate(['/']);      
          }
        }, (error: HttpErrorResponse) => {
          console.log(error)
        });
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

  loadFacebookSdk() {

    (window as any).fbAsyncInit = function () {
      window['FB'].init({
        appId: '933948490440237',
        cookie: true,
        xfbml: true,
        version: 'v3.1'
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
      console.log('login response', response);
      if (response.authResponse) {

        window['FB'].api('/me', {
          fields: 'last_name, first_name, email'
        }, (userInfo) => {

          let json_data = {
            "account_type": 1,
            "name": userInfo.first_name + ' ' + userInfo.last_name,
            "email": userInfo.email,
            "social_account_id": userInfo.id,
            "device_type": 1,
            "device_model": "RNE-L22",
            "device_token": "123abc#$%456",
            "app_version": "1.0",
            "os_version": "7.0"
          };
          this.userService.socialLogin(json_data).subscribe((data: any) => {
            if (data.user_details) {
              localStorage.setItem("_lay_sess", data.user_details.access_token);
              this.router.navigate(['/']);
            }
          }, (error: HttpErrorResponse) => {
            console.log(error)
          });

        }, (error) => {
          console.log(JSON.stringify(error, undefined, 2));
        });
      } else {
        this.apiError = 'User login failed';
        console.log('User login failed');
      }
    }, { scope: 'email' });
  }
}
