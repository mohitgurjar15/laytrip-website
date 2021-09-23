import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import * as moment from 'moment';
import { CommonFunction } from '../../_helpers/common-function';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { HomeService } from 'src/app/services/home.service';

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
    paymentType:string,
    instalments:[],
    remainingAmount:number,
    totalAmount:number,
    selectedDownPayment:number
  }>(); 
  @Input() laycreditpoints;
  @Input() customInstalmentData:any={};
  @Input() priceData=[];
  constructor(
    private genericService:GenericService,
    private commonFunction:CommonFunction,
    private cartService:CartService,
    private homeService:HomeService
  ) {
   }
  
  cartPrices;
  @Input() isShowSummary:boolean;
  @Input() showFullPartialPayOption:boolean=true;
  @Input() isShowPartialPaymentDetails:boolean=true;
  s3BucketUrl = environment.s3BucketUrl
  
  instalmentRequest={
    instalment_type: "weekly",
    checkin_date: '',
    booking_date: moment().format("YYYY-MM-DD"),
    amount : 0.00,
    additional_amount: 0,
    selected_down_payment:0,
    down_payment:0,
    custom_down_payment:null,
    is_down_payment_in_percentage: true,
    down_payment_option : []
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
  show30DayMinValidation:boolean=false;
  showPartialAndFullPaymentMixValidation:boolean=false;
  isOfferData:boolean=false;
  offerData;


  ngOnInit(){

    this.cartService.getCartPrice.subscribe(cartPrices=>{
      this.cartPrices = cartPrices;
      this.isOfferData=this.cartPrices[0].is_offer_data;
      if(this.isOfferData){
         this.homeService.getLandingPageData.subscribe(data=>{
           if(data){
            this.offerData =data;
            if(!this.offerData.applicable){
              this.isOfferData=false;
            }
           }
           else{
            this.isOfferData=false;
           }
            this.getTotalPrice();
          })
      } else{
        this.getTotalPrice();
      }
      if(this.instalmentRequest.checkin_date){
        let checkInDiff = moment(moment(this.instalmentRequest.checkin_date,'YYYY-MM-DD')).diff(moment().format("YYYY-MM-DD"),'days');
        if(checkInDiff > 30 && checkInDiff <= 90){          
          this.instalmentRequest.down_payment_option = [40,50,60];
        } else if(checkInDiff > 90){
          this.instalmentRequest.down_payment_option = [20,30,40];
        }
        // console.log("checkInDiff",checkInDiff,this.instalmentRequest)
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
    // console.log("this.instalmentRequest 2",this.instalmentRequest)
    this.genericService.getInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
        this.instalments=res;
        if(this.instalments.instalment_available==true){
          this.instalmentAvavible=true;
          
          let checkFullPaymentItem = this.cartPrices.findIndex(cart=> cart.is_installment_available==false)
          if(checkFullPaymentItem!=-1){
            this.instalmentAvavible=false;
            this.paymentType='no-instalment'
          }
          if(type1!=null && type1=='down-payment'){
            this.downPayments=this.instalments.down_payment;
            this.redeemableLayCredit.emit(this.sellingPrice);
          }

          this.remainingAmount = this.sellingPrice - this.instalments.instalment_date[0].instalment_amount;
          let emitParms = {
            layCreditPoints :this.laycreditpoints,
            instalmentType: this.instalmentType,
            instalments:this.instalments,
            remainingAmount:this.remainingAmount,
            totalAmount:this.sellingPrice,
            paymentType:this.paymentType,
            selectedDownPayment:this.selectedDownPaymentIndex
          };
          
          this.getInstalmentData.emit(emitParms);
          this.cartService.setPaymentOptions(emitParms);
        }
        else{
          this.instalmentAvavible=false;
          this.paymentType='no-instalment';
          this.getInstalmentData.emit({
            layCreditPoints :this.laycreditpoints,
            instalmentType: this.instalmentType,
            instalments:this.instalments,
            remainingAmount:this.sellingPrice,
            totalAmount:this.sellingPrice,
            paymentType:this.paymentType,
            selectedDownPayment:this.selectedDownPaymentIndex
          })

          this.cartService.setPaymentOptions({
            layCreditPoints :this.laycreditpoints,
            instalmentType: this.instalmentType,
            instalments:this.instalments,
            remainingAmount:this.remainingAmount,
            totalAmount:this.sellingPrice,
            paymentType:this.paymentType,
            selectedDownPayment:this.selectedDownPaymentIndex
          });
        }
      },(err)=>{

      })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['laycreditpoints']) {
     /*  this.laycreditpoints =Number(changes['laycreditpoints'].currentValue);
      this.instalmentRequest.additional_amount = this.laycreditpoints;
      this.calculateInstalment('down-payment',null);
      this.getAllInstalment(); */
    }
  }

  getTotalPrice(){
    
    let totalPrice=0;
    let downpayment=0;
    if(this.cartPrices.length>0){
        let checkinDate = moment(this.cartPrices[0].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD");

        for(let i=0; i < this.cartPrices.length; i++){
          
          if(this.isOfferData && this.offerData.down_payment_options[0].applicable){
            downpayment+=this.offerData.down_payment_options[0].amount;
          }
          if (this.isOfferData && this.cartPrices[i].type == 'flight') {
            totalPrice += this.cartPrices[i].discounted_selling_price;
          } else if (this.isOfferData && this.cartPrices[i].type == 'hotel') {
            totalPrice += this.cartPrices[i].price_break_down.discounted_total;
          } else if (this.cartPrices[i].type == 'flight') {
            totalPrice += this.cartPrices[i].selling_price;
          } else if (this.cartPrices[i].type == 'hotel') {
            totalPrice += this.cartPrices[i].price_break_down.total;
          }
          if(i==0){
            continue;
          }
          if(moment(checkinDate).isAfter(moment(this.cartPrices[i].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD"))){
            checkinDate = moment(this.cartPrices[i].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD");
          }
        }
        this.sellingPrice=totalPrice;
        this.instalmentRequest.custom_down_payment=downpayment?downpayment:null;
        this.instalmentRequest.checkin_date= checkinDate;

        let checkInDiff = moment(moment(this.instalmentRequest.checkin_date,'YYYY-MM-DD')).diff(moment().format("YYYY-MM-DD"),'days');
        if(checkInDiff > 30 && checkInDiff <= 90){
          this.instalmentRequest.down_payment_option = [40,50,60];
        } else if(checkInDiff > 90){         
          this.instalmentRequest.down_payment_option = [20,30,40];
        }
        // console.log("this.instalmentRequest123",checkInDiff,this.instalmentRequest)

        this.getInstalmentData.emit({
          layCreditPoints :this.laycreditpoints,
          instalmentType: this.instalmentType,
          instalments:this.instalments,
          remainingAmount:this.remainingAmount,
          totalAmount:this.sellingPrice,
          paymentType:this.paymentType,
          selectedDownPayment:this.selectedDownPaymentIndex
        })
    }
  }

  getCheckinDate(module_Info,type){
    let checkinDate;
    if(type=='flight'){
      checkinDate = moment(module_Info.departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
    }
    else if(type=='hotel'){
      checkinDate = moment(module_Info.input_data.check_in, "YYYY-MM-DD'").format("YYYY-MM-DD");
    }
    return checkinDate;
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
          this.weeklyInstalment   = res.weekly_instalments[1].instalment_amount.toFixed(2);
          this.biWeeklyInstalment = res.biweekly_instalments[1].instalment_amount.toFixed(2);
          this.montlyInstalment = res.monthly_instalments[1].instalment_amount.toFixed(2);

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

    if(type=='instalment'){
      let checkFullPaymentItem = this.cartPrices.findIndex(cart=> cart.is_installment_available==false)
      if(checkFullPaymentItem!=-1){
        this.show30DayMinValidation=true;
        this.instalmentAvavible=false;
        this.paymentType='no-instalment'
        return;
      }
    }
    if(type=='instalment' && !this.instalmentAvavible){

      if(this.cartPrices.length>1){

        let checkBelow30DayBooking = this.cartPrices.findIndex(cart=> cart.start_price==0)
        
        if(checkBelow30DayBooking!==-1){
          this.showPartialAndFullPaymentMixValidation=true;
        }
        else{
          this.show30DayMinValidation=true;
        }
      }
      else{
        this.show30DayMinValidation=true;
      }
      return;
    }
    this.paymentType=type;
    let paymentInfo={
      layCreditPoints :this.laycreditpoints,
      instalmentType: this.instalmentType,
      instalments:this.instalments,
      remainingAmount:this.sellingPrice,
      totalAmount:this.sellingPrice,
      paymentType:this.paymentType,
      selectedDownPayment:this.selectedDownPaymentIndex
    }
    this.getInstalmentData.emit(paymentInfo)

    this.cartService.setPaymentOptions(paymentInfo);
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
    this.instalmentRequest.selected_down_payment= this.selectedDownPaymentIndex;
    //Below line commented for temporary reason
    //this.redeemableLayCredit.emit(this.sellingPrice-this.defaultDownPayments[this.instalmentType][index]);
    this.calculateInstalment();
    this.getAllInstalment();
  }

  applyLaycredit(laycreditpoints){
    /* this.laycreditpoints=laycreditpoints;
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
        totalAmount:this.sellingPrice,
        paymentType:this.paymentType,
        selectedDownPayment:this.selectedDownPaymentIndex
      })
    } */
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
  
  hideBelow30DayMinError(){
    this.show30DayMinValidation=false;
  }

  hidePartialAndFullPaymentMixError(){
    this.showPartialAndFullPaymentMixValidation=false;
  }

  showDownPaymentOption(down_payment_option){
    if(typeof this.offerData!='undefined' && this.offerData.applicable){
      if(this.offerData.down_payment_options[down_payment_option].applicable){
        return true;
      }
      return false;
    }
    return true;
  }
  showPaymentFrequency(type){
    if(typeof this.offerData!='undefined' && this.offerData.applicable){
      if(this.offerData.payment_frequency_options[type].applicable){
        return true;
      }
      return false;
    }
    return true;
  }
}
