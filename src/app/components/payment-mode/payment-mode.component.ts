import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import * as moment from 'moment';
import { CommonFunction } from '../../_helpers/common-function';
import { FlightService } from '../../services/flight.service';
import { error } from 'protractor';
declare var $: any; 

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
  constructor(
    private genericService:GenericService,
    private commonFunction:CommonFunction,
    private flightService:FlightService
  ) {
    this.getPredictionDate();
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
  customAmount:number;
  customInstalment:number;
  defaultInstalment:number;
  defaultInstalmentNo:number;
  customMethod:string;
  secondInstalment:number;
  totalLaycreditPoints=0;
  instalmentAvavible:boolean=false;
  showFirstAccrodian:boolean=false;
  weeklyDefaultInstalmentNo:number=0;
  weeklyDefaultInstalment:number=0;
  weeklyFirsttInstalment:number=0;
  biWeeklyDefaultInstalmentNo:number=0;
  biWeeklyDefaultInstalment:number=0;
  biWeeklyFirstInstalment:number=0;
  monthlyDefaultInstalmentNo:number=0;
  monthlyDefaultInstalment:number=0;
  monthlyFirstInstalment:number=0;
  upFrontPayment:number=0;
  payNowPrice:number=0;
  discountedPrice:number;
  totalPrice;

  ngOnInit(){
    this.discountedPrice = this.flightSummary[0].secondary_selling_price
    this.instalmentRequest.amount= this.flightSummary[0].selling_price;
    this.instalmentRequest.checkin_date= moment(this.flightSummary[0].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD");
    this.getInstalemntsBiweekly('biweekly');
    this.getInstalemntsMonthly('monthly');
    this.getInstalemntsWeekly('weekly');
    if(Object.keys(this.customInstalmentData).length){
      this.additionalAmount = this.customInstalmentData.additionalAmount;
      this.durationType = this.customInstalmentData.instalmentType;
      this.customAmount = this.customInstalmentData.customAmount;
      this.customInstalment = this.customInstalmentData.customInstalment;
      this.laycreditpoints = this.customInstalmentData.layCreditPoints;
      
      this.instalmentRequest.instalment_type = this.durationType;
      this.instalmentRequest.custom_instalment_no=this.customInstalment;
      this.instalmentRequest.custom_amount = this.customAmount;
      this.instalmentRequest.additional_amount =Number(this.additionalAmount)+Number(this.laycreditpoints);
      this.getInstalmentData.emit({ 
        additionalAmount:this.additionalAmount, 
        instalmentType:this.durationType, 
        customAmount: this.instalmentRequest.custom_amount,
        customInstalment : this.instalmentRequest.custom_instalment_no,
        layCreditPoints : this.laycreditpoints,
        partialPaymentAmount : this.secondInstalment,
        payNowAmount:this.getPayNowAmount(),
        firstInstalment:this.customInstalmentData.firstInstalment
      })
      setTimeout(()=>{this.getInstalemnts(this.durationType);},2000)
      
    }
    else{
      
      this.getInstalemnts('weekly');
      this.triggerPayemntMode('instalment');
    }
    
  }

  toggleaccordin(){
    this.showFirstAccrodian = !this.showFirstAccrodian;
  }

  /* changeAdditionalAmount(event){

    this.additionalAmount = Number(event.target.value);

    this.remainingAmount=this.remainingAmount-this.additionalAmount;
    this.firstInstalment+=this.additionalAmount;
    this.getInstalmentData.emit({ 
      additionalAmount:this.additionalAmount , 
      instalmentType:this.durationType, 
      customAmount: this.instalmentRequest.custom_amount,
      customInstalment : this.instalmentRequest.custom_instalment_no,
      layCreditPoints : this.laycreditpoints,
      partialPaymentAmount : this.secondInstalment
    })
    this.calculateInstalment();
  } */
  changeAdditionalAmount(event){

    this.upFrontPayment = Number(event.target.value);
    if(this.upFrontPayment<this.defaultInstalment){
      this.upFrontPayment=this.defaultInstalment;
    }

    this.additionalAmount = this.upFrontPayment-this.defaultInstalment;
    this.remainingAmount=this.remainingAmount-this.upFrontPayment;
    this.firstInstalment=this.upFrontPayment;
    this.getInstalmentData.emit({ 
      additionalAmount:this.additionalAmount, 
      instalmentType:this.durationType, 
      customAmount: this.instalmentRequest.custom_amount,
      customInstalment : this.instalmentRequest.custom_instalment_no,
      layCreditPoints : this.laycreditpoints,
      partialPaymentAmount : this.secondInstalment,
      payNowAmount:this.getPayNowAmount(),
      firstInstalment:this.firstInstalment
    })

    if((Number(this.laycreditpoints) + Number(this.upFrontPayment))>=this.flightSummary[0].selling_price){
      this.toggleFullPayment();
    }
    this.calculateInstalment();
  }

  changeCustomInstalmentAmount(event){
    if(this.customMethod=='amount'){
      this.customAmount = Number(event.target.value);
      console.log(this.customAmount,this.weeklyDefaultInstalment,"-----")
      if(this.customAmount<this.secondInstalment){
        
      }

      if(this.durationType=='weekly' && this.customAmount<this.weeklyDefaultInstalment){
        this.customAmount = this.weeklyDefaultInstalment;
      }
      else if(this.durationType=='biweekly' && this.customAmount<this.biWeeklyDefaultInstalment){
        
        this.customAmount = this.biWeeklyDefaultInstalment;
      }
      else if(this.durationType=='monthly' && this.customAmount<this.monthlyDefaultInstalment){
        this.customAmount = this.monthlyDefaultInstalment;
      }

      console.log(this.firstInstalment)
      if(Number(this.firstInstalment)+this.customAmount > this.flightSummary[0].selling_price){
        this.customAmount = this.flightSummary[0].selling_price - this.firstInstalment;
      }
    }

    this.getInstalmentData.emit({ 
      additionalAmount:this.additionalAmount , 
      instalmentType:this.durationType, 
      customAmount: this.customAmount,
      customInstalment : null,
      layCreditPoints : this.laycreditpoints,
      partialPaymentAmount : this.customAmount,
      payNowAmount:this.getPayNowAmount(),
      firstInstalment:this.firstInstalment
    })
    this.calculateInstalment();
  }

  /**
   * 
   * @param type [weekly,biweekly,monthly]
   */
  getInstalemnts(type){

    this.instalmentRequest.instalment_type=type;

    this.genericService.getInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
      this.instalments=res;
      if(this.instalments.instalment_available==true){

        this.instalmentAvavible=true;
        this.remainingAmount  = this.instalmentRequest.amount - parseFloat(this.instalments.instalment_date[0].instalment_amount)
        this.firstInstalment  = this.instalments.instalment_date[0].instalment_amount;
        this.defaultInstalment  = this.instalments.instalment_date[0].instalment_amount;
        this.upFrontPayment  = this.instalments.instalment_date[0].instalment_amount-this.laycreditpoints;
        this.customAmount     = this.instalments.instalment_date[1].instalment_amount;
        this.customInstalment = this.instalments.instalment_date.length;
        this.defaultInstalmentNo = this.instalments.instalment_date.length;
        this.remainingInstalment = this.instalments.instalment_date.length-1;
        this.secondInstalment = this.instalments.instalment_date[1].instalment_amount;

        this.defaultInstalment = this.defaultInstalment - Number(this.laycreditpoints)-(this.additionalAmount);
        /* console.log(this.defaultInstalmentNo,"----",this.customInstalment)
        if(this.customInstalment){
          this.defaultInstalmentNo = this.defaultInstalmentNo - this.customInstalment;
        } */
        
        this.getInstalmentData.emit({ 
          additionalAmount:this.additionalAmount, 
          instalmentType:this.durationType, 
          customAmount: this.instalmentRequest.custom_amount,
          customInstalment : this.instalmentRequest.custom_instalment_no,
          layCreditPoints : this.laycreditpoints,
          partialPaymentAmount : this.secondInstalment,
          payNowAmount:this.getPayNowAmount(),
          firstInstalment:this.firstInstalment
        })
        //this.redeemableLayCredit.emit(this.flightSummary[0].selling_price-this.defaultInstalment)
        
      }
      else{
        this.instalmentAvavible=false;
        this.selectInstalmentMode.emit('no-instalment');
      }
    },(err)=>{

    })
  }

  getInstalemntsBiweekly(type){

    this.instalmentRequest.instalment_type=type;

    this.genericService.getInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
      this.instalments=res;
      if(this.instalments.instalment_available==true){
        this.biWeeklyDefaultInstalmentNo = this.instalments.instalment_date.length;
        this.biWeeklyDefaultInstalment = this.instalments.instalment_date[1].instalment_amount;
        this.biWeeklyFirstInstalment = this.instalments.instalment_date[0].instalment_amount;
      }
      else{
        this.instalmentAvavible=false;
        this.selectInstalmentMode.emit('no-instalment');
      }
    },(err)=>{

    })
  }

  getInstalemntsMonthly(type){

    this.instalmentRequest.instalment_type=type;

    this.genericService.getInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
      this.instalments=res;
      if(this.instalments.instalment_available==true){
        this.monthlyDefaultInstalmentNo = this.instalments.instalment_date.length;
        this.monthlyDefaultInstalment = this.instalments.instalment_date[1].instalment_amount;
      }
      else{
        this.instalmentAvavible=false;
        this.selectInstalmentMode.emit('no-instalment');
      }
    },(err)=>{

    })
  }
  getInstalemntsWeekly(type){

    this.instalmentRequest.instalment_type=type;

    this.genericService.getInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
      this.instalments=res;
      if(this.instalments.instalment_available==true){
        this.weeklyDefaultInstalmentNo = this.instalments.instalment_date.length;
        this.weeklyDefaultInstalment = this.instalments.instalment_date[1].instalment_amount;
        this.weeklyFirsttInstalment = this.instalments.instalment_date[0].instalment_amount;
        this.monthlyFirstInstalment = this.instalments.instalment_date[1].instalment_amount;
      }
      else{
        this.instalmentAvavible=false;
        this.selectInstalmentMode.emit('no-instalment');
      }
    },(err)=>{

    })
  }

  changeDuration(type){
    this.durationType=type;
    this.customMethod='';
    this.additionalAmount=0;
    //this.laycreditpoints=0;
    this.instalmentRequest.custom_amount=null;
    this.instalmentRequest.custom_instalment_no=null;
    this.instalmentRequest.additional_amount=Number(this.laycreditpoints);
    
    this.getInstalemnts(this.durationType);
    this.getInstalmentData.emit({ 
      additionalAmount:this.additionalAmount , 
      instalmentType:this.durationType, 
      customAmount: this.instalmentRequest.custom_amount,
      customInstalment : this.instalmentRequest.custom_instalment_no,
      layCreditPoints : this.laycreditpoints,
      partialPaymentAmount : this.secondInstalment,
      payNowAmount:this.getPayNowAmount(),
      firstInstalment:this.firstInstalment
    })
  }

  triggerPayemntMode(type){
    if((Number(this.laycreditpoints) + Number(this.upFrontPayment))<=this.flightSummary[0].selling_price){
      if( type=='instalment'){

        this.isInstalemtMode = true;
        this.getInstalmentData.emit({ 
          additionalAmount:this.additionalAmount , 
          instalmentType:this.durationType, 
          customAmount: this.customAmount,
          customInstalment : null,
          layCreditPoints :this.laycreditpoints,
          partialPaymentAmount : this.secondInstalment,
          payNowAmount:this.getPayNowAmount(),
          firstInstalment:this.firstInstalment
        });
        //console.log("One",this.flightSummary[0].selling_price,this.defaultInstalment)
        this.redeemableLayCredit.emit(this.flightSummary[0].selling_price-this.defaultInstalment)
      }

      if(type=='no-instalment'){

        this.isInstalemtMode = false;
       
        this.getInstalmentData.emit({ 
          additionalAmount:this.additionalAmount , 
          instalmentType:'', 
          customAmount: null,
          customInstalment : null,
          layCreditPoints :this.laycreditpoints,
          partialPaymentAmount : this.instalments.instalment_date[1].instalment_amount,
          payNowAmount:this.getPayNowAmount(),
          firstInstalment:this.firstInstalment
        })
        console.log("two")
        this.redeemableLayCredit.emit(this.getTotalPrice())
      }
      this.selectInstalmentMode.emit(type)
    } 
    else{
      this.isInstalemtMode = false;
    }

  }


  /**
   * 
   * @param type [add,minus]
   */
  setAdditionalAmount(type){
    if(type=='add'){
      this.additionalAmount+=1;
      this.remainingAmount=this.remainingAmount-1;
      this.firstInstalment+=1;
    }
    else{

      if(this.additionalAmount!=0){
        this.additionalAmount-=1;
        this.remainingAmount=this.remainingAmount+1;
        this.firstInstalment-=1;
      }
    }
    this.getInstalmentData.emit({ 
      additionalAmount:this.additionalAmount , 
      instalmentType:this.durationType, 
      customAmount: this.instalmentRequest.custom_amount,
      customInstalment : this.instalmentRequest.custom_instalment_no,
      layCreditPoints : this.laycreditpoints,
      partialPaymentAmount : this.secondInstalment,
      payNowAmount:this.getPayNowAmount(),
      firstInstalment:this.firstInstalment
    })
    this.calculateInstalment();

  }

  /**
   * 
   * @param type [increase,decrease]
   */
  /* setCustomAmount(type){

    if(this.customMethod=='amount'){

      if(type=='increase'){
        this.customAmount+=1;
        this.calculateInstalment();
      }
      else{

        if(this.defaultInstalment<this.customAmount){

          this.customAmount-=1;
          this.calculateInstalment();
        }
      }
      this.getInstalmentData.emit({ 
        additionalAmount:this.additionalAmount , 
        instalmentType:this.durationType, 
        customAmount: this.customAmount,
        customInstalment : null,
        layCreditPoints : this.laycreditpoints,
        partialPaymentAmount : this.secondInstalment,
        payNowAmount:this.getPayNowAmount()
      })
    }
  } */

  /**
   * 
   * @param type [increase,decrease]
   */
  setCustomInstalmentNo(type){
    if(this.customMethod=='instalment'){
      if(type=='increase'){

        if(this.defaultInstalmentNo>this.customInstalment){
  
          this.customInstalment+=1;
          this.calculateInstalment();
        }
      }
      else{
         if(this.customInstalment>2){
           this.customInstalment-=1;
           this.calculateInstalment();
         }
      }
    }
    this.getInstalmentData.emit({ 
      additionalAmount:this.additionalAmount , 
      instalmentType:this.durationType, 
      customAmount: null,
      customInstalment : this.customInstalment,
      layCreditPoints : this.laycreditpoints,
      partialPaymentAmount : this.secondInstalment,
      payNowAmount:this.getPayNowAmount(),
      firstInstalment:this.firstInstalment
    })
  }

  /**
   * 
   * @param type [amount,instalment]
   */
  selectCustomMethod(event){
    
    if(event.target.value=='amount'){
      this.instalmentRequest.custom_amount=this.customAmount;
      this.instalmentRequest.custom_instalment_no=null;
    }
    else if(event.target.value=='instalment'){
      this.instalmentRequest.custom_amount=null;
      this.instalmentRequest.custom_instalment_no=this.customInstalment;
    }
    this.getInstalmentData.emit({ 
      additionalAmount:this.additionalAmount , 
      instalmentType:this.durationType, 
      customAmount: this.instalmentRequest.custom_amount,
      customInstalment : this.instalmentRequest.custom_instalment_no,
      layCreditPoints : this.laycreditpoints,
      partialPaymentAmount : this.secondInstalment,
      payNowAmount:this.getPayNowAmount(),
      firstInstalment:this.firstInstalment
    })
    if(this.durationType=='weekly'){
      this.customAmount = this.weeklyDefaultInstalment;
    }
    else if(this.durationType=='biweekly'){
      this.customAmount = this.biWeeklyDefaultInstalment;
    }
    else{
      this.customAmount = this.monthlyDefaultInstalment;
    }
    this.customInstalment = this.defaultInstalmentNo;
    this.customMethod=event.target.checked?event.target.value:'';
    this.calculateInstalment();
  }
  
  calculateInstalment(){

    if(this.customMethod=='amount'){

      this.instalmentRequest.custom_amount=this.customAmount;
      this.instalmentRequest.custom_instalment_no=null;
    }
    else if(this.customMethod=='instalment'){
      this.instalmentRequest.custom_amount=null;
      this.instalmentRequest.custom_instalment_no=this.customInstalment;
    }

    this.instalmentRequest.additional_amount=(this.upFrontPayment-this.defaultInstalment) + Number(this.laycreditpoints);
    this.genericService.getInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
        this.instalments=res;
        if(this.instalments.instalment_available==true){
          
          this.firstInstalment  = this.instalments.instalment_date[0].instalment_amount;
          this.remainingAmount  = this.instalmentRequest.amount - parseFloat(this.instalments.instalment_date[0].instalment_amount)
          this.secondInstalment = this.instalments.instalment_date[1].instalment_amount;
          this.remainingInstalment = this.instalments.instalment_date.length-1;

          this.getInstalmentData.emit({ 
            additionalAmount:this.additionalAmount, 
            instalmentType:this.durationType, 
            customAmount: this.instalmentRequest.custom_amount,
            customInstalment : this.instalmentRequest.custom_instalment_no,
            layCreditPoints : this.laycreditpoints,
            partialPaymentAmount : this.secondInstalment,
            payNowAmount:this.getPayNowAmount(),
            firstInstalment:this.firstInstalment
          })
          
        }
      },(err)=>{

    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['laycreditpoints']) {
      this.laycreditpoints = changes['laycreditpoints'].currentValue;
      this.getInstalmentData.emit({ 
        additionalAmount:this.additionalAmount, 
        instalmentType:this.durationType, 
        customAmount: this.instalmentRequest.custom_amount,
        customInstalment : this.instalmentRequest.custom_instalment_no,
        layCreditPoints : this.laycreditpoints,
        partialPaymentAmount : this.secondInstalment,
        payNowAmount:this.getPayNowAmount(),
        firstInstalment:this.firstInstalment
      })
      
      if((Number(this.laycreditpoints) + Number(this.upFrontPayment))>=this.flightSummary[0].selling_price){
        this.toggleFullPayment();
        this.disablePartialPayment=true;   
      }
      else{
        this.disablePartialPayment=false;   
      }
      this.calculateInstalment();
    }
  }

  toggleFullPayment(){
    this.isInstalemtMode = false;
    this.selectInstalmentMode.emit('no-instalment');
    this.firstInstalment = this.defaultInstalment;
    this.getInstalmentData.emit({ 
      additionalAmount:0, 
      instalmentType:'', 
      customAmount: null,
      customInstalment : null,
      layCreditPoints : this.laycreditpoints,
      partialPaymentAmount : this.secondInstalment,
      payNowAmount:this.getPayNowAmount(),
      firstInstalment:this.firstInstalment
    });
    console.log("three")
    this.redeemableLayCredit.emit(this.getTotalPrice())

    this.upFrontPayment = this.defaultInstalment;
    this.firstInstalment = this.defaultInstalment;
    this.additionalAmount=0;
    this.customAmount = this.defaultInstalment;
    this.customInstalment = this.defaultInstalmentNo;
    this.instalmentRequest.custom_amount=null;
    this.instalmentRequest.custom_instalment_no=null;
    this.instalmentRequest.additional_amount=0;
    this.calculateInstalment();
  }

  getPayNowAmount(){
    if(this.isInstalemtMode){

      this.payNowPrice= this.upFrontPayment;
    }
    else{
      this.sellingPrice = this.getTotalPrice();    
      this.payNowPrice = Number(this.sellingPrice) -Number(this.laycreditpoints);
    }

    return this.payNowPrice;
  }

  getTotalPrice(){
      this.sellingPrice=this.flightSummary[0].selling_price;
      if(this.flightSummary[0].secondary_selling_price){
        this.sellingPrice = this.flightSummary[0].secondary_selling_price;
      }
      return this.sellingPrice;
  }

  getPredictionDate(){

    let routeInfo:any = sessionStorage.getItem("__route");
    let _itinerary:any = sessionStorage.getItem("_itinerary")
    try{

        routeInfo = JSON.parse(routeInfo);
        _itinerary = JSON.parse(_itinerary);
        let searchParams={
          source_location: routeInfo.departure_code,
          destination_location: routeInfo.arrival_code,
          departure_date: moment(routeInfo.departure_date,"DD/MM/YYYY").format("YYYY-MM-DD"),
          flight_class: routeInfo.routes[0].stops[0].cabin_class,
          adult_count: Number(_itinerary.adult),
          child_count: Number(_itinerary.child),
          infant_count: Number(_itinerary.infant),
          unique_token: routeInfo.unique_code
        }
        this.pridictionLoading=true;
        this.flightService.getPredictionDate(searchParams).subscribe((res:any)=>{

          this.pridictionLoading=false;
          if(res.length){
            let pridictedData=res.find(date=>date.is_booking_avaible==true)
            if(Object.keys(pridictedData).length){
              this.predictionDate=this.commonFunction.convertDateFormat(pridictedData.date,"DD/MM/YYYY") ;
            }
          }
        },
        (error)=>{
          this.pridictionLoading=false;
          }
        )
    }
    catch(e){

    }
    
  }
}
