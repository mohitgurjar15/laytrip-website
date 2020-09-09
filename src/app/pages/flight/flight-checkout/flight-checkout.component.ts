import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../../../services/flight.service';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { CookieService } from 'ngx-cookie';
import * as moment from 'moment';

@Component({
  selector: 'app-flight-checkout',
  templateUrl: './flight-checkout.component.html',
  styleUrls: ['./flight-checkout.component.scss']
})
export class FlightCheckoutComponent implements OnInit {

    constructor(
      private route: ActivatedRoute,
      private flightService:FlightService,
      private cookieService: CookieService
    ) { }
    s3BucketUrl = environment.s3BucketUrl;
    showAddCardForm:boolean=false;
    progressStep={ step1:true, step2:true, step3:false };
    cardToken:string;
    instalmentMode:'noinstalment';
    laycreditpoints:number;
    additionalAmount:number;
    routeCode:string;
    travelers=[];
    isDisableBookBtn:boolean=true;
    isTandCaccepeted:boolean=false;
    bookingStatus:number=0;
    userInfo;
    bookingTimerConfig;
    bookingLoader:boolean=false;
    bookingResult:any={};

    ngOnInit() {

      this.userInfo = getLoginUserInfo();
      console.log("this.userInfo",this.userInfo)

      this.routeCode = this.route.snapshot.paramMap.get('rc')

      let timerInfo:any = this.cookieService.get('flight_booking_timer')
      timerInfo = timerInfo ? JSON.parse(timerInfo) : {};
      if(timerInfo.route_code==this.routeCode){
        this.bookingTimerConfig={
          leftTime : 1200 - moment(moment().format('YYYY-MM-DD h:mm:ss')).diff(timerInfo.time ,'seconds'),
          format: 'm:s'
        }
      }
      else{
        
        this.bookingTimerConfig={
          leftTime: 1200, format: 'm:s'
        };

        let bookingTimer={
          'route_code':this.routeCode,
          'time': moment().format('YYYY-MM-DD h:mm:ss')
        }
        console.log(bookingTimer)
        this.cookieService.put("flight_booking_timer", JSON.stringify(bookingTimer));
      }

      if(this.userInfo.roleId==7){
        this.showAddCardForm=true;
      }
      let travelersIds = this.cookieService.get('userIds');
      travelersIds = JSON.parse(travelersIds)
      if(travelersIds.length){
        for(let i=0; i < travelersIds.length; i++){
          this.travelers.push({
            "traveler_id" : travelersIds[i]
          })
        }
      }
      console.log(this.travelers)
    }

    toggleAddcardForm(){
      this.showAddCardForm=!this.showAddCardForm;
    }

    applyLaycredit(laycreditpoints){
      this.laycreditpoints=laycreditpoints;
      this.validateBookingButton();
    }

    selectCreditCard(cardToken){
      this.cardToken=cardToken;
      this.validateBookingButton();
    }

    selectInstalmentMode(instalmentMode){
      this.instalmentMode=instalmentMode;
    }

    acceptTermCondtion(){
      this.isTandCaccepeted=!this.isTandCaccepeted;
      this.validateBookingButton();
    }

    bookFlight(){
      this.bookingLoader=true;
      let bookingData={
        payment_type      : this.instalmentMode,
        laycredit_points  : this.laycreditpoints,
        instalment_type   : 'weekly',
        route_code        : this.routeCode,
        travelers         : this.travelers
      }

      this.flightService.bookFligt(bookingData).subscribe((res:any)=>{
        this.bookingStatus=1;
        this.bookingLoader=false;
        this.progressStep = { step1:true, step2:true, step3:true }
        this.bookingResult=res;
      },(error)=>{
        this.bookingStatus=2; // Failed 
        this.bookingLoader=false;
      });
    }

    bookingDetails(bookingId){
      this.flightService.getBookingDetails(bookingId).subscribe((res:any)=>{
        
      },(error)=>{

      })
    }

    validateBookingButton(){

      if(
        this.isTandCaccepeted==true
      ){
        this.isDisableBookBtn=false;
      }
      else{
        this.isDisableBookBtn=true;
      }
      console.log("this.isDisableBookBtn",this.isDisableBookBtn)
    }
}
