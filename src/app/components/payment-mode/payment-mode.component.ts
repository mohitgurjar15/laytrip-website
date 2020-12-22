import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import * as moment from 'moment';
import { CommonFunction } from '../../_helpers/common-function';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss']
})
export class PaymentModeComponent implements OnInit {

  
  @Output() selectInstalmentMode = new EventEmitter();
  @Output() redeemableLayCredit = new EventEmitter();
  @Output() getInstalmentData = new EventEmitter<{
    additionalAmount:number,
    instalmentType:string,
    customAmount:number,
    customInstalment:number,
    layCreditPoints:number,
    partialPaymentAmount:number,
    payNowAmount:number,
    firstInstalment:number
  }>(); 
  @Input() laycreditpoints;
  @Input() customInstalmentData:any={};
  @Input() priceData=[];
  constructor(
    private genericService:GenericService,
    private commonFunction:CommonFunction,
    private flightService:FlightService
  ) {
   }
  
  @Input() flightSummary;
  @Input() isShowSummary:boolean;
  @Input() showFullPartialPayOption:boolean=true;
  @Input() isShowPartialPaymentDetails:boolean=true;
  sellingPrice:number;
  isInstalemtMode:boolean=true;
  disablePartialPayment:boolean=false;
  predictionDate:string='';
  pridictionLoading:boolean=false;
  partialPaymentSellingPrice:number=0;
  isInstalmentLoading:boolean=false;
  
  instalmentRequest={
    instalment_type: "weekly",
    checkin_date: '',
    booking_date: moment().format("YYYY-MM-DD"),
    amount: 0,
    additional_amount: null,
    custom_instalment_no: null,
    custom_amount: null
  }
  instalments;
  durationType:string='weekly'; // [weekly,biweekly,monthly]
  additionalAmount:number=0;
  remainingAmount:number;
  remainingInstalment:number;
  firstInstalment:number;
  defaultInstalment:number;
  defaultInstalmentNo:number;
  totalLaycreditPoints=0;
  instalmentAvavible:boolean=false;
  payNowPrice:number=0;
  totalPrice;

  ngOnInit(){
    
  }

  
  calculateInstalment(){


    this.instalmentRequest.instalment_type =this.durationType;
    this.genericService.getInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
        this.instalments=res;
        if(this.instalments.instalment_available==true){
          
        }
      },(err)=>{

    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['laycreditpoints']) {
      
      this.calculateInstalment();
    }

    if(changes['priceData']){
      this.instalmentRequest.amount= changes['priceData'].currentValue[0].selling_price;
    }
  }

  

  getPayNowAmount(){
    if(this.isInstalemtMode){

    }
    else{
      this.sellingPrice = this.getTotalPrice();    
      this.payNowPrice = Number(this.sellingPrice) -Number(this.laycreditpoints);
    }

    return this.payNowPrice;
  }

  getTotalPrice(){
      this.sellingPrice=this.priceData[0].selling_price;
      if(this.priceData[0].secondary_selling_price){
        this.sellingPrice = this.priceData[0].secondary_selling_price;
      }
      return this.sellingPrice;
  }


  convertToNumber(number){
    return Number(number)
  }
}
