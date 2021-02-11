import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { SocialAuthService } from 'angularx-social-login';
import { AppleLoginProvider } from './apple.provider';
declare var $: any;
import { getUserDetails } from '../../../_helpers/jwt.helper';
import { ToastrService } from 'ngx-toastr';
declare const gapi: any;

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})

export class SocialLoginComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  @Output() socialError = new EventEmitter<string>();
  apiError: string = '';
  test: boolean = false;
  loading: boolean = false;
  google_loading: boolean = false;
  apple_loading: boolean = false;
  @ViewChild('loginRef', { static: true }) loginElement: ElementRef;
  auth2: any;

  constructor(
    private userService: UserService,
    public router: Router,
    public modalService: NgbModal,
    public location: Location,
    private authService: SocialAuthService,
    private toastr: ToastrService,

  ) {
  
   }

  
  ngOnInit() {
    this.loadGoogleSdk();

   this.loadFacebookSdk();
    // APPLE LOGIN RESPONSE 
    this.authService.authState.subscribe((userInfo: any) => {
      if (userInfo) {
        let objApple = getUserDetails(userInfo.authorization.id_token);
        console.log(objApple,userInfo)

        let jsonData = {
          "account_type": 1, 
          "name": objApple.name,
          "email": objApple.email,
          "social_account_id": userInfo.authorization.code,
          "device_type": 1,
          "device_model": "RNE-L22",
          "device_token": "123abc#$%456",
          "app_version": "1.0",
          "os_version": "7.0"
        };
        this.userService.socialLogin(jsonData).subscribe((data: any) => {
          if (data.user_details) {
            localStorage.setItem("_lay_sess", data.user_details.access_token);
            $('#sign_in_modal').modal('hide');
            document.getElementById('navbarNav').click();
            this.router.url;
          }
        }, (error: HttpErrorResponse) => {         
          this.socialError.emit(error.message);
          this.toastr.error(error.message, 'SignIn Error');
        });
      }
    });
  }


  public googleLogin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        this.socialError.emit('');
        let profile = googleUser.getBasicProfile();
        
        let jsonData = {
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
        this.userService.socialLogin(jsonData).subscribe((data: any) => {
          if (data.user_details) {
            this.google_loading = false;
            localStorage.setItem("_lay_sess", data.user_details.access_token);
            $('#sign_in_modal').modal('hide');
            $('#sign_up_modal').modal('hide');
            this.router.url;
            document.getElementById('navbarNav').click();
          }
        }, (error: HttpErrorResponse) => {
          this.google_loading = false;
          this.socialError.emit(error.message);
        });

      }, (error) => {
        console.log(error)
        this.socialError.emit('');
        this.google_loading = false;
      });
  }
 
  ngAfterViewInit(){
    this.loadGoogleSdk();
  }

  loadGoogleSdk(){
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: environment.google_client_id,
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.googleLogin(this.loginElement.nativeElement);
    });
  }

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
    this.socialError.emit('');
    this.loading = true;
    window['FB'].login((response) => {
      if (response.authResponse) {
        window['FB'].api('/me', {
          fields: 'last_name, first_name, email'
        }, (userInfo) => {
          let jsonData = {
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

          this.userService.socialLogin(jsonData).subscribe((data: any) => {
            this.loading = false;
            if (data.user_details) {
              localStorage.setItem("_lay_sess", data.user_details.access_token);
              $('#sign_in_modal').modal('hide');
              $('#sign_up_modal').modal('hide');
              this.test = true;
              document.getElementById('navbarNav').click();
              this.router.url;
            }
          }, (error: HttpErrorResponse) => {
            this.loading = false;
            this.socialError.emit(error.message);
            this.toastr.error(error.message, 'SignIn Error');
          });
        });
      } else {
        this.socialError.emit('');
        this.loading = false;
        // this.socialError.emit('Authentication failed.');
        // this.toastr.error("Something went wrong!", 'SignIn Error');
      }
    }, { scope: 'email' });
  }

  loginWithApple(): void {
    this.socialError.emit('');
    this.authService.signIn(AppleLoginProvider.PROVIDER_ID);
  }

}
