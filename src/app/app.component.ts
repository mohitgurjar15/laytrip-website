import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { GenericService } from './services/generic.service';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'laytrip-website';
  
  constructor(
    private cookieService:CookieService,
    private genericService:GenericService
  ){
    this.getUserLocationInfo();
  }

  getUserLocationInfo(){

    try{
      
      let location:any = this.cookieService.get('__loc');      
      if(typeof location=='undefined'){
        this.genericService.getUserLocationInfo().subscribe((res:any)=>{
          console.log("location",res)
          this.cookieService.put('__loc',JSON.stringify(res), { expires : new Date(moment().add('7',"days").format())})
          this.redirectToDRsite(res)
        },(error)=>{
    
        })
      }
      else{
        console.log("window.location.origin",window.location.origin)
        location = JSON.parse(location);
        this.redirectToDRsite(location)
        
      }
    }
    catch(e){

    }
    
  }

  redirectToDRsite(location){
    console.log("Location",location)
    if(location.country.iso2=='PL'){
      if(window.location.origin=='https://staging.laytrip.com' || window.location.origin=='http://staging.laytrip.com' || window.location.origin=='http://localhost:4200' ){
        //window.location.href='https://www.google.com/'
      }
    }
  }
}
