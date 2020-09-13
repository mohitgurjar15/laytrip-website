import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
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
      private router:Router,
      private flightService:FlightService,
      private cookieService: CookieService
    ) { }
    s3BucketUrl = environment.s3BucketUrl;
    showAddCardForm:boolean=false;
    progressStep={ step1:true, step2:true, step3:false };
    cardToken:string;
    instalmentMode='no-instalment';
    laycreditpoints:number;
    additionalAmount:number;
    routeCode:string;
    travelers=[];
    travelerList;
    isDisableBookBtn:boolean=true;
    isTandCaccepeted:boolean=false;
    bookingStatus:number=0;
    userInfo;
    bookingTimerConfig;
    bookingLoader:boolean=false;
    bookingResult:any={};
    sellingPrice:number;
    flightSummary:[]=[];
    instalmentType:string;
    customAmount:number | null;
    customInstalment:number | null;
    newCard;

    ngOnInit() {
      this.userInfo = getLoginUserInfo();
      if(typeof this.userInfo.roleId=='undefined'){
        this.router.navigate(['/'])
      }
      console.log("this",this.userInfo)
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
      let travelersIds = this.cookieService.get('_travelers');
      try{
        travelersIds = JSON.parse(travelersIds);

        this.travelerList=travelersIds;

        if(travelersIds.length){
          for(let i=0; i < travelersIds.length; i++){
            this.travelers.push({
              "traveler_id" : travelersIds[i]['userId']
            })
            
          }
        }
        console.log(this.travelers)
      }
      catch(e){

      }
      
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
        payment_type            : this.instalmentMode,
        laycredit_points        : this.laycreditpoints,
        instalment_type         : this.instalmentType,
        route_code              : this.routeCode,
        travelers               : this.travelers,
        additional_amount       : this.additionalAmount,
        card_token              : this.cardToken,
        custom_instalment_amount: this.customAmount,
        custom_instalment_no    : this.customInstalment
      }

      this.flightService.bookFligt(bookingData).subscribe((res:any)=>{
        this.bookingStatus=1;
        this.bookingLoader=false;
        this.progressStep = { step1:true, step2:true, step3:true }
        this.bookingResult=res;
      },(error)=>{

        console.log("error",error)
        if(error.status==404){
          this.bookingStatus=2; // Flight Not available  
        }
        if(error.status==424){
          this.bookingStatus=2; // Booking failed from supplier side
        }
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

    getFlightSummaryData(data){

      this.flightSummary=data;
    }

    getInstalmentData(data){

      this.additionalAmount = data.additionalAmount;
      this.instalmentType = data.instalmentType;
      this.customAmount = data.customAmount;
      this.customInstalment = data.customInstalment;
      console.log(data)

    }

    emitNewCard(event){
      console.log("event",event)
      this.newCard =event;
    }
}
