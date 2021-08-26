import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { GenericService } from './services/generic.service';
import * as moment from 'moment';
import { environment } from '../environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { getLoginUserInfo } from './_helpers/jwt.helper';
import { UserService } from './services/user.service';
import { CheckOutService } from './services/checkout.service';
import { ActivatedRoute } from '@angular/router';
import { PreloadingService } from './services/preloading.service';
import { HomeService } from './services/home.service';
import { HttpClient, HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'laytrip-website';
  readonly VAPID_PUBLIC_KEY = environment.VAPID_PUBLIC_KEY;
  $lpData;

  constructor(
    private cookieService:CookieService,
    private genericService:GenericService,
    private checkOutService:CheckOutService,
    private route: ActivatedRoute,
    private userService:UserService,
    public preLoadService : PreloadingService,
    private homeService:HomeService,
    private httpClient: HttpClient
  ) {
    this.preloadLandingPageData();
    this.setUserOrigin();
    this.getUserLocationInfo();
  }

  ngOnInit() {
    let token = localStorage.getItem('_lay_sess');
    if(token){
      // this.subscribeToNotifications()
    }
    this.registerGuestUser();
    this.setCountryBehaviour();   
  }

  utm_source ='';
  preloadLandingPageData() {    
    this.route.queryParams.subscribe(parms => {
      if (parms['utm_source']) {
        this.preLoadService.getLandingPageDetails(parms['utm_source']).subscribe((res: any) => {
        this.$lpData =this.homeService.setLandingPageData(res.config)
        }, err => {
          this.homeService.setLandingPageData({});          
          window.location.href='/';
        });
      } 
    });    
  }

  isValidateReferralId(referral_id){
    this.genericService.checkIsReferralUser(referral_id).subscribe((res: any) => {  
      localStorage.setItem("referral_id",res.data.name)
    }, err => {
      localStorage.removeItem("referral_id")
    });
  }

  /* subscribeToNotifications() {

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
  })
  .then(sub =>   this.genericService.addPushSubscriber(sub).subscribe()
    )
  .catch(
    
  );
  
  } */

  setUserOrigin(){
    
    let host = window.location.origin;
    if(host.includes("dr.")){
      localStorage.setItem('__uorigin','DR')
    }
    else{
      localStorage.removeItem('__uorigin')
    }
  }

  getUserLocationInfo(){

    try{
      
      let location:any = this.cookieService.get('__loc');      
      if(typeof location=='undefined'){
        this.genericService.getUserLocationInfo().subscribe((res:any)=>{
          this.cookieService.put('__loc',JSON.stringify(res), { expires : new Date(moment().add('7',"days").format())})
          this.redirectToDRsite(res)
        },(error)=>{
    
        })
      }
      else{
        location = JSON.parse(location);
        this.redirectToDRsite(location)
        
      }
    }
    catch(e){

    }
    
  }

  redirectToDRsite(location){
    if(location.country.iso2=='PL'){

      if(window.location.origin=='https://staging.laytrip.com' || window.location.origin=='http://staging.laytrip.com' || window.location.origin=='http://localhost:4200' ){
        //window.location.href='https://www.google.com/'
      }
    }
  }

  registerGuestUser(){
    let user = getLoginUserInfo();
    if(!user.roleId || user.roleId==7){
      let __gst= localStorage.getItem('__gst')
      if(!__gst){
        let uuid=uuidv4();
        localStorage.setItem('__gst',uuid)
        this.userService.registerGuestUser({guest_id : uuid}).subscribe((result:any)=>{
          localStorage.setItem("_lay_sess",result.accessToken)
        })
      }
      else{
        this.userService.registerGuestUser({guest_id : __gst}).subscribe((result:any)=>{
          localStorage.setItem("_lay_sess",result.accessToken)
        })
      }
    }
  }

  setCountryBehaviour(){
    this.genericService.getCountry().subscribe(res => {
      this.checkOutService.setCountries(res);
    })
  }


}

  