import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../../services/flight.service';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { CookieService } from 'ngx-cookie';
import * as moment from 'moment';
import { GenericService } from '../../../services/generic.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
      private cookieService: CookieService,
      private genericService:GenericService,
      private toastr: ToastrService
    ) { }
    s3BucketUrl = environment.s3BucketUrl;
    validateCardDetails:Subject<any> = new Subject();
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
    guestCardDetails;

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

    async bookFlight(){
      
      /* Guest user */
      if(this.userInfo.roleId==7){
        let isValid = this.validateCard(this.guestCardDetails);
        if(isValid===false){
          return;
        }
        this.bookingLoader=true;
        this.genericService.saveCard(this.guestCardDetails).subscribe((res:any)=>{
          if(res.cardToken){
            this.cardToken = res.cardToken;
            this.bookFlightApi()
          }
        },(error=>{
          this.toastr.error(error.message, 'Error',{positionClass:'toast-top-center',easeTime:1000});
        }))
      }
      /* Login user */
      else{

        this.bookingLoader=true;
        this.bookFlightApi();
      }


      

      //this.bookFlightApi(bookingData);
    }

    bookFlightApi(){
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
        if(error.status==422){
          this.toastr.error(error.message, 'Error',{positionClass:'toast-top-center',easeTime:1000});
        }
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

    validateCard(guestCardDetails){
      this.validateCardDetails.next(guestCardDetails);
      if(typeof guestCardDetails.first_name=='undefined' || guestCardDetails.first_name=='')
        return false;
      if(typeof guestCardDetails.last_name=='undefined' || guestCardDetails.last_name=='')
        return false;
      if(typeof guestCardDetails.card_number=='undefined' || guestCardDetails.card_number=='')
        return false;
      if(typeof guestCardDetails.expiry=='undefined' || guestCardDetails.expiry=='')
        return false;
      if(typeof guestCardDetails.card_cvv=='undefined' || guestCardDetails.card_cvv=='')
        return false;
      
      
      
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
      this.newCard =event;
    }

    emitGuestCardDetails(event){
      console.log(event)
      this.guestCardDetails=event;
    }

    async saveCard(cardData) {
      try{
        return await this.genericService.saveCard(cardData);
      }
      catch(error){
        return error.message;
      }
    }
}
