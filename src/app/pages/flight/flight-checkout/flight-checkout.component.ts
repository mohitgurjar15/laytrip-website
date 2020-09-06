import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-flight-checkout',
  templateUrl: './flight-checkout.component.html',
  styleUrls: ['./flight-checkout.component.scss']
})
export class FlightCheckoutComponent implements OnInit {

    constructor(
      private route: ActivatedRoute,
      private flightService:FlightService
    ) { }
    s3BucketUrl = environment.s3BucketUrl;
    showAddCardForm:boolean=false;
    progressStep={ step1:true, step2:true, step3:false };
    cardToken:string;
    instalmentMode:'noinstalment';
    laycreditpoints:number;
    additionalAmount:number;
    routeCode:string;
    travelers:[]=[];
    isDisableBookBtn:boolean=true;
    isTandCaccepeted:boolean=false;

    ngOnInit() {
      this.routeCode = this.route.snapshot.paramMap.get('rc')
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
      
      let bookingData={
        payment_type      : this.instalmentMode,
        laycredit_points  : this.laycreditpoints,
        instalment_type   : 'weekly',
        route_code        : this.routeCode,
        travelers         : [
                                {
                                  "traveler_id": "c5944389-53f3-4120-84a4-488fb4e94d87"
                                }
                            ]

      }

      this.flightService.bookFligt(bookingData).subscribe((res:any)=>{
        console.log(res);
      });
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
