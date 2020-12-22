import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import * as moment from 'moment';
import { CommonFunction } from '../../_helpers/common-function';

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
    private commonFunction:CommonFunction
  ) {
   }
  
  @Input() flightSummary;
  @Input() isShowSummary:boolean;
  @Input() showFullPartialPayOption:boolean=true;
  @Input() isShowPartialPaymentDetails:boolean=true;
  
  
  instalmentRequest={
    instalment_type: "weekly",
    checkin_date: '',
    booking_date: moment().format("YYYY-MM-DD"),
    amount: 0,
    additional_amount: 0,
    down_payment:0
  }
  instalments;
  allInstalments;
  durationType:string='weekly'; // [weekly,biweekly,monthly]
  paymentType:string='instalment';
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
  weeklyInstalment:number=0;
  biWeeklyInstalment:number=0;
  montlyInstalment:number=0;
  downPayments=[];
  //downPayment:number=0;
  sellingPrice:number;

  ngOnInit(){

    this.instalmentRequest.checkin_date= moment(this.flightSummary[0].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD");
    this.getTotalPrice();
    this.getAllInstalment();
    this.calculateInstalment();
  }
  
  calculateInstalment(type1=null){
    
    this.genericService.getInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
        this.instalments=res;
        console.log()
        if(this.instalments.instalment_available==true){
          if(type1!=null && type1=='down-payment'){
            this.calculateDownPayment(this.instalments.instalment_date[0].instalment_amount)
          }
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

  getAllInstalment(){
    this.genericService.getAllInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
        if(res.instalment_available==true){
          this.instalmentAvavible=true;
          this.weeklyInstalment   = res.weekly_instalments[1].instalment_amount;
          this.biWeeklyInstalment = res.biweekly_instalments[1].instalment_amount;
          this.montlyInstalment   = res.monthly_instalments[1].instalment_amount;
          this.calculateDownPayment(res.weekly_instalments[0].instalment_amount);
        }
        
      },(err)=>{

    })
  }

  calculateDownPayment(amount){

    this.downPayments=[];
    this.downPayments.push(amount);

    let secondDownPayment = amount+(amount*10)/100;
    this.downPayments.push(secondDownPayment);

    let thirdDownPayment = amount+(amount*20)/100;
    this.downPayments.push(thirdDownPayment);
  }

  /**
   * 
   * @param type ['instalment','no-instalment']
   */
  togglePaymentMode(type){
    this.paymentType=type;
  }

  /**
   * 
   * @param type ['weekly','biweekly','monthly']
   */
  togglePaymentFrequency(type){

    this.instalmentRequest.instalment_type=type;
    this.calculateInstalment(type='down-payment');
    
  }
  
  /**
   * 
   * @param index [it will hold the first(0) ,second(1) or third(2) downpayment option]
   */
  toggleDownPayment(index){

    //this.downPayment = this.downPayments[index];
    this.instalmentRequest.down_payment= this.downPayments[index];
    this.calculateInstalment();
    //console.log("this.downPayment",this.downPayment)
  }
}
