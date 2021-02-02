import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { GenericService } from './services/generic.service';
import * as moment from 'moment';
import { SwPush } from '@angular/service-worker';
import { environment } from '../environments/environment';

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
    private swPush: SwPush,
  ){
    this.setUserOrigin();
    this.getUserLocationInfo();
  }

  ngOnInit(){
    var token = localStorage.getItem('_lay_sess');
    if(token){
      this.subscribeToNotifications()
    }
  }


  subscribeToNotifications() {

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
  })
  .then(sub =>   this.genericService.addPushSubscriber(sub).subscribe()
    )
  .catch(
    // err =>console.log("Could not subscribe to notifications")
  );
    /* this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub =>
      console.log(sub)
        // this.genericService.addPushSubscriber(sub).subscribe()
      )
    .catch(err => console.error(this.VAPID_PUBLIC_KEY,"Could not subscribe to notifications", err)); */
  }

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

  checkUserValidate(){
    
  }
}
