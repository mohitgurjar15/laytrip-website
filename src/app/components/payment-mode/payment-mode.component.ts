import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import * as moment from 'moment';
import { CommonFunction } from '../../_helpers/common-function';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss']
})
export class PaymentModeComponent implements OnInit {

  
  @Output() selectInstalmentMode = new EventEmitter();
  @Output() redeemableLayCredit = new EventEmitter();
  @Output() getInstalmentData = new EventEmitter<{
    instalmentType:string,
    layCreditPoints:number,
    instalments:[],
    remainingAmount:number,
    totalAmount:number
  }>(); 
  @Input() laycreditpoints;
  @Input() customInstalmentData:any={};
  @Input() priceData=[];
  constructor(
    private genericService:GenericService,
    private commonFunction:CommonFunction,
    private toastr: ToastrService,
    private cartService:CartService
  ) {
   }
  
  cartPrices;
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
  isBelowMinimumInstallment:boolean=false;
  isLayCreditLoading:boolean=false;
  isPaymentCalulcatorLoading:boolean=false;

  ngOnInit(){

    this.cartService.getCartPrice.subscribe(cartPrices=>{
      this.cartPrices = cartPrices;
      this.getTotalPrice();
      if(this.instalmentRequest.checkin_date){

        this.instalmentRequest.amount = this.sellingPrice;
        this.totalLaycredit();
        this.getAllInstalment('set-default-down-payment');
        this.calculateInstalment('down-payment',null);
      }
    })

    
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
            this.redeemableLayCredit.emit(this.sellingPrice);
          }

          if(type2!=null && type2=='redeemable_point' && this.sellingPrice){
            //Below line commented for temporary reason
            //this.redeemableLayCredit.emit(this.sellingPrice-this.defaultDownPayments[this.instalmentType][this.selectedDownPaymentIndex]);
          }

          if(this.instalments.instalment_date[1].instalment_amount<5 && type3==null){
            
            if(this.paymentType=='instalment'){

             this.toastr.warning(this.minimumPriceValidationError, 'Warning',{positionClass:'toast-top-center',easeTime:1000});
             this.togglePaymentMode('no-instalment');
            }
            this.isBelowMinimumInstallment=true;
           // this.minimumInstallmentValidation();
          }
          else{
            this.isBelowMinimumInstallment=false;
            /* if(type3!=null && type3=='min-instal'){
              this.minimumInstallmentValidation();
            } */
          }
          
          this.remainingAmount = this.sellingPrice - this.instalments.instalment_date[0].instalment_amount;
        }

        this.getInstalmentData.emit({
          layCreditPoints :this.laycreditpoints,
          instalmentType: this.instalmentType,
          instalments:this.instalments,
          remainingAmount:this.remainingAmount,
          totalAmount:this.sellingPrice
        })
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

    /* if(changes['priceData']){
      this.instalmentRequest.amount= changes['priceData'].currentValue[0].selling_price;
    } */
  }

  getPayNowAmount(){
    
  }

  getTotalPrice(){
    //this.sellingPrice=this.priceData[0].selling_price;
    let totalPrice=0;
    if(this.cartPrices.length>0){
        let checkinDate = moment(this.cartPrices[0].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD");

        for(let i=0; i < this.cartPrices.length; i++){
          totalPrice+=this.cartPrices[i].selling_price;
          if(i==0){
            continue;
          }
          if(moment(checkinDate).isAfter(moment(this.cartPrices[i].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD"))){
            checkinDate = moment(this.cartPrices[i].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD");
          }
        }
        this.sellingPrice=totalPrice;
        this.instalmentRequest.checkin_date= checkinDate;
        this.getInstalmentData.emit({
          layCreditPoints :this.laycreditpoints,
          instalmentType: this.instalmentType,
          instalments:this.instalments,
          remainingAmount:this.remainingAmount,
          totalAmount:this.sellingPrice
        })
    }
  }

  convertToNumber(number){
    return Number(number)
  }

  getAllInstalment(type1=null){

    if(!this.weeklyInstalment){
      this.isPaymentCalulcatorLoading=true;
    }
    this.genericService.getAllInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
        this.isPaymentCalulcatorLoading=false;
        if(res.instalment_available==true){
          this.instalmentAvavible=true;
          this.weeklyInstalment   = res.weekly_instalments[1].instalment_amount;
          this.biWeeklyInstalment = res.biweekly_instalments[1].instalment_amount;
          this.montlyInstalment   = res.monthly_instalments[1].instalment_amount;

          if(type1!=null && type1=='set-default-down-payment'){
            this.defaultDownPayments.weekly = res.weekly_down_payment;
            this.defaultDownPayments.biweekly = res.bi_weekly_down_payment;
            this.defaultDownPayments.monthly = res.monthly_down_payment;
            //Below line commented for temporary reason
            //this.redeemableLayCredit.emit(this.sellingPrice-this.defaultDownPayments[this.instalmentType][this.selectedDownPaymentIndex]);
          }
        }
      },(err)=>{
        this.isPaymentCalulcatorLoading=false;
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

    if(type=='instalment' && this.isBelowMinimumInstallment){
      return;
    }
    this.paymentType=type;
  }

  /**
   * 
   * @param type ['weekly','biweekly','monthly']
   */
  togglePaymentFrequency(type){

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
    //Below line commented for temporary reason
    //this.redeemableLayCredit.emit(this.sellingPrice-this.defaultDownPayments[this.instalmentType][index]);
    this.calculateInstalment();
    this.getAllInstalment();
  }

  applyLaycredit(laycreditpoints){
    this.laycreditpoints=laycreditpoints;
    this.instalmentRequest.additional_amount = this.laycreditpoints;
    if(this.instalmentAvavible){
      this.calculateInstalment('down-payment',null);
      this.getAllInstalment();
    }
    else{
      this.getInstalmentData.emit({
        layCreditPoints :this.laycreditpoints,
        instalmentType: this.instalmentType,
        instalments:this.instalments,
        remainingAmount:this.remainingAmount,
        totalAmount:this.sellingPrice
      })
    }
  }

  totalLaycredit(){
    this.isLayCreditLoading=true;
    this.genericService.getAvailableLaycredit().subscribe((res:any)=>{
      this.totalLaycreditPoints=res.total_available_points;
      this.isLayCreditLoading=false;
    },(error=>{
      this.isLayCreditLoading=false;
    }))
  }
  
}
