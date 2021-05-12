import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { GenericService } from './services/generic.service';
import * as moment from 'moment';
import { environment } from '../environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { getLoginUserInfo } from './_helpers/jwt.helper';
import { UserService } from './services/user.service';
import { CheckOutService } from './services/checkout.service';
import { ActivatedRoute, Event, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'laytrip-website';
  readonly VAPID_PUBLIC_KEY = environment.VAPID_PUBLIC_KEY;
  constructor(
    private cookieService:CookieService,
    private genericService:GenericService,
    private checkOutService:CheckOutService,
    private route: ActivatedRoute,
    private router: Router,
    private userService:UserService
  ){
    this.setUserOrigin();
    this.getUserLocationInfo();

    /* this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Trigger when route change
        if(this.route.snapshot.params['id']){
          this.isValidateReferralId(this.route.snapshot.params['id'])
        } else {
          console.log('removed-app')
          localStorage.removeItem("referral_id")
        }
        
      }
    }); */
   

  }

  ngOnInit(){
    let token = localStorage.getItem('_lay_sess');
    if(token){
      // this.subscribeToNotifications()
    }
    this.registerGuestUser();
    this.setCountryBehaviour();

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
