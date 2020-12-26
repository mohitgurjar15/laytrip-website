import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import * as moment from 'moment';
import { CommonFunction } from '../../_helpers/common-function';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
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
    selected_down_payment:0
  }
  instalments;
  allInstalments;
  instalmentType:string='weekly'; // [weekly,biweekly,monthly]
  paymentType:string='instalment';
  additionalAmount:number=0;
  remainingAmount:number;
  remainingInstalment:number;
  firstInstalment:number;
  defaultInstalmentNo:number;
  totalLaycreditPoints=0;
  instalmentAvavible:boolean=false;
  payNowPrice:number=0;
  totalPrice;
  weeklyInstalment:number=0;
  biWeeklyInstalment:number=0;
  montlyInstalment:number=0;
  downPayments=[];
  defaultDownPayments={
    weekly : [],
    biweekly : [],
    monthly : []
  }
  selectedDownPaymentIndex:number=0;
  sellingPrice:number;
  minimumPriceValidationError:string='Your installment price is less then $5, Partial payment option is not available for this Offer.';

  ngOnInit(){

    this.instalmentRequest.checkin_date= moment(this.flightSummary[0].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD");
    if(this.instalmentRequest.checkin_date){

      this.getTotalPrice();
      this.getAllInstalment('set-default-down-payment');
      this.calculateInstalment('down-payment');
    }
  }

  
  /**
   * 
   * @param type1 => To calculate first, second & third down payment
   * @param type2 => To calculate redeemable point
   */
  calculateInstalment(type1=null,type2=null,type3=null){
    
    this.genericService.getInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
        this.instalments=res;
        if(this.instalments.instalment_available==true){
          if(type1!=null && type1=='down-payment'){
            this.downPayments=this.instalments.down_payment;
          }

          if(type2!=null && type2=='redeemable_point' && this.sellingPrice){
            this.redeemableLayCredit.emit(this.sellingPrice-this.defaultDownPayments[this.instalmentType][this.selectedDownPaymentIndex]);
          }

          if(this.instalments.instalment_date[1].instalment_amount<5 && this.paymentType=='instalment'){
           // alert("Less then 5")
           this.toastr.warning(this.minimumPriceValidationError, 'Warning',{positionClass:'toast-top-center',easeTime:1000});
           this.togglePaymentMode('no-instalment');
          }
          this.remainingAmount = this.sellingPrice - this.instalments.instalment_date[0].instalment_amount;
        }
      },(err)=>{

    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['laycreditpoints']) {
      this.laycreditpoints =Number(changes['laycreditpoints'].currentValue);
      this.instalmentRequest.additional_amount = this.laycreditpoints;
      this.calculateInstalment('down-payment',null);
      this.getAllInstalment();
    }

    if(changes['priceData']){
      this.instalmentRequest.amount= changes['priceData'].currentValue[0].selling_price;
      //this.instalmentRequest.amount= 100;
    }
  }

  getPayNowAmount(){
    
  }

  getTotalPrice(){
    this.sellingPrice=this.priceData[0].selling_price;

    if(this.paymentType=='no-instalment'){
      if(this.priceData[0].secondary_selling_price){
        this.sellingPrice = this.priceData[0].secondary_selling_price;
      }
    }
    //return this.sellingPrice=100;
  }

  convertToNumber(number){
    return Number(number)
  }

  getAllInstalment(type1=null){
    this.genericService.getAllInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
        if(res.instalment_available==true){
          this.instalmentAvavible=true;
          this.weeklyInstalment   = res.weekly_instalments[1].instalment_amount;
          this.biWeeklyInstalment = res.biweekly_instalments[1].instalment_amount;
          this.montlyInstalment   = res.monthly_instalments[1].instalment_amount;

          if(type1!=null && type1=='set-default-down-payment'){
            this.defaultDownPayments.weekly = res.weekly_down_payment;
            this.defaultDownPayments.biweekly = res.bi_weekly_down_payment;
            this.defaultDownPayments.monthly = res.monthly_down_payment;
            console.log("this.sellingPrice-this.defaultDownPayments[this.instalmentType][this.selectedDownPaymentIndex]",this.sellingPrice-this.defaultDownPayments[this.instalmentType][this.selectedDownPaymentIndex])
            this.redeemableLayCredit.emit(this.sellingPrice-this.defaultDownPayments[this.instalmentType][this.selectedDownPaymentIndex]);
          }
        }
      },(err)=>{

    })
  }

  calculateDownPayment(sellingPrice,firstDownPayment){

    this.downPayments=[];
    this.downPayments.push(firstDownPayment);

    let secondDownPayment = firstDownPayment+(sellingPrice*10)/100;
    this.downPayments.push(secondDownPayment);

    let thirdDownPayment = secondDownPayment+(sellingPrice*10)/100;
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

    /* Reset Section */
    //this.instalmentRequest.down_payment=0;
    //this.selectedDownPaymentIndex=0;

    //this.instalmentRequest.down_payment=this.defaultDownPayments[this.selectedDownPaymentIndex];
    
    /* End Reset Section */
    
    this.instalmentRequest.instalment_type=type;
    this.instalmentType=type;
    this.calculateInstalment('down-payment','redeemable_point','set-default-down-payment');
    this.getAllInstalment();
  }
  
  /**
   * 
   * @param index [it will hold the first(0) ,second(1) or third(2) downpayment option]
   */
  toggleDownPayment(index){

    this.selectedDownPaymentIndex=index;
    //this.instalmentRequest.down_payment= this.downPayments[index];
    this.instalmentRequest.selected_down_payment= this.selectedDownPaymentIndex;
    this.redeemableLayCredit.emit(this.sellingPrice-this.defaultDownPayments[this.instalmentType][index]);
    this.calculateInstalment();
    this.getAllInstalment();
  }
}
