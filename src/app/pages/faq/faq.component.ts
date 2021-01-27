import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from '../../../environments/environment';
import { GenericService } from '../../services/generic.service';
declare var $: any;

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
 
  s3BucketUrl = environment.s3BucketUrl;
  loading = false;
  faqDetail;
  google_loading: boolean = false;
  @ViewChild('loginRef', { static: true }) loginElement: ElementRef;
  auth2: any;
  constructor(
    private genericService: GenericService,
    private userService: UserService,
    public router: Router

  ) { }

  ngOnInit() {
    window.scroll(0,0);
    this.loadJquery();
    this.loading = true;
    this.genericService.getFaqData().subscribe((res: any) => {
      this.faqDetail = res.data;
      this.loading = false;
    });
    this.loadGoogleSdk();
  }

  loadGoogleSdk() {
    console.log('hee')

    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: '188637199174-dnm6dm1r7k652d8ddqd122kgas9kho3e.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.googleLogin();
      });
    }
 
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
 
  }
  

  loadJquery() {
    $(document).ready(function () {

      $('.faq_callapse').on('shown.bs.collapse', function () {
        $(this).parent().addClass('active');
      });

      $('.faq_callapse').on('hidden.bs.collapse', function () {
        $(this).parent().removeClass('active');
      });

    });
  }


  googleLogin() {
    console.log('googleLogin')
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleUser) => {
 
        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        //YOUR CODE HERE
 
 
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
      return;
    // this.loadGoogleSdk();
    console.log(this.auth2)
    console.log(this.auth2)
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleUser) => {
        this.google_loading = true;

        let profile = googleUser.getBasicProfile();

        // YOUR CODE HERE
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
            this.router.url;
            document.getElementById('navbarNav').click();
          }
        }, (error: HttpErrorResponse) => {
          this.google_loading = false;
          // this.socialError.emit(error.message);
        });
      }, (error) => {
        this.google_loading = false;
        // this.socialError.emit('Authentication failed.');
        // this.toastr.error("Something went wrong!", 'SignIn Error');
      });
  }
}
