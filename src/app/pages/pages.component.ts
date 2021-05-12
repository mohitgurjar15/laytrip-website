import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationStart, Router } from '@angular/router';
import { cookieServiceFactory } from 'ngx-cookie';
import { GenericService } from '../services/generic.service';
import { redirectToLogin } from '../_helpers/jwt.helper';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  public lottieConfig: any;

  constructor(
    private router: Router,
    private genericService: GenericService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    
  ) {
    
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Trigger when route change
        this.checkIsValidUser();        
      }
    });

  }

  ngOnInit() {
    this.checkIsValidUser();
    document.getElementById('loader_full_page').style.display = 'block' ? 'none' : 'block';
    this.lottieConfig = {
      path: 'assets/lottie-json/flight/data.json',
      autoplay: true,
      loop: true
    };
  }

  isValidateReferralId(){
    if(this.route.snapshot.queryParams['utm_source']){
      localStorage.setItem("referral_id",this.route.snapshot.queryParams['utm_source'])     
    } else {      
      localStorage.removeItem("referral_id")
    }
  }

  checkIsValidUser() {
      this.route.queryParams.subscribe(queryParams => {
      if(typeof queryParams['utm_source'] != 'undefined' && queryParams['utm_source']){      
        localStorage.setItem("referral_id",this.route.snapshot.queryParams['utm_source'])
      }else {
        localStorage.removeItem("referral_id")
      }
      // do something with the query params
    });
     
    var token = localStorage.getItem('_lay_sess');
    if (token) {
      this.genericService.checkUserValidate(token).subscribe((res: any) => {
      }, err => {
        redirectToLogin();
      });
    }
  }

}
