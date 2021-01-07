import { Component, Inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../../services/flight.service';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { CookieService } from 'ngx-cookie';
import * as moment from 'moment';
import { GenericService } from '../../../services/generic.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SpreedlyService } from 'src/app/services/spreedly.service';
import { BookService } from 'src/app/services/book.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-flight-checkout',
  templateUrl: './flight-checkout.component.html',
  styleUrls: ['./flight-checkout.component.scss']
})
export class FlightCheckoutComponent implements OnInit {

    s3BucketUrl = environment.s3BucketUrl;
    validateCardDetails:Subject<any> = new Subject();
    showAddCardForm:boolean=false;
    progressStep={ step1:true, step2:true, step3:true,step4:false };
    cardToken:string='';
    instalmentMode='instalment';
    laycreditpoints:number=0;
    additionalAmount:number;
    routeCode:string;
    travelers=[];
    travelerList;
    isDisableBookBtn:boolean=true;
    isTandCaccepeted:boolean=false;
    isShowTermConditionPopup:boolean=false;
    bookingStatus:number=0;
    userInfo;
    bookingTimerConfig;
    bookingLoader:boolean=false;
    bookingResult:any={};
    sellingPrice:number;
    flightSummary:any=[];
    instalmentType:string='weekly';
    customAmount:number | null;
    customInstalment:number | null;
    newCard;
    guestCardDetails={ first_name:'', last_name:'',card_cvv:'', card_number:'',expiry:'' };
    isFlightNotAvailable:boolean=false;
    isSessionTimeOut:boolean=false;
    isShowCardOption:boolean=true;
    isShowPaymentOption:boolean=true;
    isShowFeedbackPopup:boolean=false;
    isShowPartialPaymentDetails:boolean=false;
    bookingId;
    customInstalmentData:any;
    showPartialPayemntOption:boolean=false;
    partialPaymentAmount:number=0;
    payNowAmount:number=0;
    priceData=[];

  challengePopUp: boolean = false;
  deviceInfo: any = [];

    constructor(
      private route: ActivatedRoute,
      private router:Router,
      private flightService:FlightService,
      private bookService:BookService,
      private cookieService: CookieService,
      private genericService:GenericService,
      private toastr: ToastrService,
      private deviceService: DeviceDetectorService,
      private spreedly: SpreedlyService,
      @Inject(DOCUMENT) private document: Document
    ) { }

    ngOnInit() {
      this.deviceInfo = this.deviceService.getDeviceInfo();
      window.scroll(0,0);
      this.getSellingPrice();
      this.userInfo = getLoginUserInfo();
      if(typeof this.userInfo.roleId=='undefined'){
        this.router.navigate(['/'])
      }
      this.routeCode = decodeURIComponent(this.route.snapshot.paramMap.get('rc'))

      this.bookingTimerConfiguration();
      this.setInstalmentInfo();


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

      let instalmentMode=sessionStorage.getItem('__insMode')?atob(sessionStorage.getItem('__insMode')):'';
      this.instalmentMode= instalmentMode || 'no-instalment';
      if(this.userInfo.roleId==7){
        this.instalmentMode='no-instalment';
        this.instalmentType='';
        this.showAddCardForm=true;
      }
      this.showPartialPayemntOption = instalmentMode=='instalment'?true:false;
      this.validateBookingButton();
    }

    bookingTimerConfiguration(){
      let timerInfo:any = this.cookieService.get('flight_booking_timer')
      timerInfo = timerInfo ? JSON.parse(timerInfo) : {};
      if(timerInfo.route_code==this.routeCode){
        this.bookingTimerConfig={
          leftTime : 600 - moment(moment().format('YYYY-MM-DD h:mm:ss')).diff(timerInfo.time ,'seconds'),
          format: 'm:s'
        }
      }
      else{

        this.bookingTimerConfig={
          leftTime: 600, format: 'm:s'
        };

        let bookingTimer={
          'route_code':this.routeCode,
          'time': moment().format('YYYY-MM-DD h:mm:ss')
        }
        this.cookieService.put("flight_booking_timer", JSON.stringify(bookingTimer));
      }
    }

    setInstalmentInfo(){
      try{
        let customInstalmentData=atob(sessionStorage.getItem('__islt'))
        this.customInstalmentData = JSON.parse(customInstalmentData);
        this.laycreditpoints = Number(this.customInstalmentData.layCreditPoints);
        this.additionalAmount = this.customInstalmentData.additionalAmount;
        this.customAmount = this.customInstalmentData.customAmount;
        this.customInstalment = this.customInstalmentData.customInstalment;
        this.instalmentType = this.customInstalmentData.instalmentType;

      }
      catch(error){

      }
    }

    toggleAddcardForm(){
      this.showAddCardForm=!this.showAddCardForm;
    }

    applyLaycredit(laycreditpoints){
      this.isShowCardOption=true;
      this.laycreditpoints=laycreditpoints;
      this.isShowPaymentOption=true;
      if(this.laycreditpoints>=this.sellingPrice){
        this.isShowCardOption=false;
        this.isShowPaymentOption=false;
        this.cardToken='';
      }
      this.validateBookingButton();
    }

    selectCreditCard(cardToken){
      this.cardToken=cardToken;
      this.validateBookingButton();
    }

    selectInstalmentMode(instalmentMode){
      this.instalmentMode=instalmentMode;
    }

    acceptTermCondtion(event){
      this.isTandCaccepeted=event;
      //this.validateBookingButton();
      this.isShowTermConditionPopup=false;
      this.bookFlight();
    }

    bookFlight(){

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
          this.bookingLoader=false;
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
      window.scroll(0, 0);

      let browser_info = this.spreedly.browserInfo();
      let site_url = this.document.location.origin;

      let bookingData={
        payment_type            : this.instalmentMode,
        laycredit_points        : this.laycreditpoints,
        instalment_type         : this.instalmentType,
        route_code              : this.routeCode,
        travelers               : this.travelers,
        additional_amount       : this.additionalAmount,
        card_token              : this.cardToken,
        custom_instalment_amount: this.customAmount,
        custom_instalment_no    : this.customInstalment,
        booking_through: 'web',
        browser_info,
        site_url: this.document.location.origin
        // site_url: 'https://demo.eztoflow.com'
      }

      this.bookService.validate(bookingData).subscribe((res: any) => {
        let transaction = res.transaction;
        console.log('res', [res]);

        let redirection = res.redirection.replace('https://demo.eztoflow.com', 'http://localhost:4200');
        res.redirection = redirection;
        if (transaction.state == "succeeded") {

          console.log('succeeded', [redirection]);
          /* Note: Do not use this.router.navigateByUrl or navigate here */
          window.location.href = redirection;
        } else if (transaction.state == "pending") {

          console.log('pending', [res]);

          this.bookingLoader = false;
          this.challengePopUp = true;
          this.spreedly.lifeCycle(res);
        } else {

          console.log('fail', [res]);

          this.router.navigate(['/book/failure']);
        }
      // this.flightService.bookFligt(bookingData).subscribe((res: any) => {
        // console.log(transaction);
        // this.bookingStatus=1;
        // this.bookingId = res.laytrip_booking_id;
        // this.bookingLoader=false;
        // this.progressStep = { step1:true, step2:true, step3:true, step4:true }
        // this.bookingResult=res;
        // this.isShowFeedbackPopup = true;
        // if(this.laycreditpoints>0){
        //   this.genericService.getAvailableLaycredit().subscribe((res:any)=>{
        //     document.getElementById("layPoints").innerHTML=res.total_available_points

        //   },(error=>{

        //   }))
        // }
      },(error)=>{

        if(error.status==404){
          this.bookingStatus=2; // Flight Not available
        }
        if(error.status==424){
          this.bookingStatus=2; // Booking failed from supplier side
        }
        else{
          this.toastr.error(error.message, 'Error',{positionClass:'toast-top-center',easeTime:1000});
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

      this.isDisableBookBtn=true;
      if(
        this.userInfo.roleId!=7  &&
        (this.cardToken!='' || this.laycreditpoints>=this.sellingPrice)
      ){
        this.isDisableBookBtn=false;
      }
      else if(
        this.userInfo.roleId==7 &&
        this.isTandCaccepeted==true
      ){
        this.isDisableBookBtn=false;
      }
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
      if(this.instalmentMode=='instalment'){
        this.sellingPrice = data[0].selling_price;
      }
      else{

        if(typeof data[0].secondary_selling_price!='undefined' && data[0].secondary_selling_price>0){
          this.sellingPrice = data[0].secondary_selling_price;
        }
        else{

          this.sellingPrice = data[0].selling_price;
        }
      }
      if(this.instalmentMode=='no-instalment'){
        this.payNowAmount=Number(this.sellingPrice)-Number(this.laycreditpoints);
      }
    }

    getInstalmentData(data){

      this.additionalAmount = data.additionalAmount;
      this.instalmentType = data.instalmentType;
      this.customAmount = data.customAmount;
      this.customInstalment = data.customInstalment;
      this.partialPaymentAmount = data.partialPaymentAmount;
      if(this.instalmentMode=='instalment'){

        this.payNowAmount=Number(data.firstInstalment)-Number(this.laycreditpoints);
      }
      else{
        this.payNowAmount=Number(this.sellingPrice)-Number(this.laycreditpoints);
      }

      /* let instalmentRequest={
        instalment_type: data.instalmentType,
        checkin_date: moment(this.flightSummary[0].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD"),
        booking_date: moment().format("YYYY-MM-DD"),
        amount: this.sellingPrice,
        additional_amount: Number(data.additionalAmount)+Number(data.layCreditPoints),
        custom_instalment_no: data.customInstalment,
        custom_amount: data.customAmount
      } */
      /* this.genericService.getInstalemnts(instalmentRequest).subscribe((res:any)=>{
        if(res.instalment_available==true){

          this.partialPaymentAmount=res.instalment_date[1].instalment_amount;

          if(this.instalmentMode=='instalment'){
            console.log("res.instalment_date",res.instalment_date)
            this.payNowAmount=Number(res.instalment_date[0].instalment_amount)-Number(this.laycreditpoints);
          }
          else{
            this.payNowAmount=Number(this.sellingPrice)-Number(this.laycreditpoints);
          }
        }
        else{
          this.payNowAmount=Number(this.sellingPrice)-Number(this.laycreditpoints);
        }
      },(err)=>{

      }) */
    }

    emitNewCard(event){
      this.newCard =event;
    }

    emitGuestCardDetails(event){
      this.guestCardDetails=event;
    }


    flightAvailable(event){
      this.isFlightNotAvailable=event;
    }

    sessionTimeout(event){
      this.isSessionTimeOut=event;
    }

    feedbackToggle(event){
      if(event){
        this.isShowFeedbackPopup=false;
      }
    }

    toggleInstalmentMode(){
      this.isShowPartialPaymentDetails=!this.isShowPartialPaymentDetails;
    }

    totalNumberOfcard(count){
      if(count==0){
        this.showAddCardForm=true;
      }
    }

    getSellingPrice(){

      try{
        let __route = sessionStorage.getItem('__route');
        let response  = JSON.parse(__route);
        response[0]=response;
        let payLoad ={
          departure_date : moment(response[0].departure_date,'DD/MM/YYYY').format("YYYY-MM-DD"),
          net_rate  : response[0].net_rate
        }
        this.flightService.getSellingPrice(payLoad).subscribe((res:any)=>{
          this.priceData=res;
        },(error)=>{

        })
      }
      catch(e){

      }
    }

    toggleTermConditionPopup(){
      this.isShowTermConditionPopup=!this.isShowTermConditionPopup;
    }

    closeTermCoditionPopup(){
      this.isShowTermConditionPopup=!this.isShowTermConditionPopup;
    }
}
