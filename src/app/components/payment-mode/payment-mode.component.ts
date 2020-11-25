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
  @Input() priceData=[];
  percentageArray=[];
  percentageValue:number;
  constructor(
    private genericService:GenericService,
    private commonFunction:CommonFunction,
    private flightService:FlightService
  ) {
    //this.getPredictionDate();
    //this.loadJS();
    
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
  secondAccordiain:boolean=false;
  showThirdAccrodian:boolean=false;
  weeklySecondInstalmentTemp:number=0;
  biWeeklySecondInstalmentTemp:number=0;
  monthlySecondInstalmentTemp:number=0;

  ngOnInit(){
    
    
    //console.log("laycreditpoints",this.laycreditpoints)
    this.instalmentRequest.amount= this.priceData[0].selling_price;
    this.partialPaymentSellingPrice= this.priceData[0].selling_price;

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
      if(this.customAmount!=null){
        this.customMethod = 'amount';
      }
      else if(this.customInstalment!=null){
        this.customMethod = 'instalment';
      }
      else{
        this.customMethod='';
      }
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
    }
    
  }

  toggleSecondAccordian(){
    this.secondAccordiain= !this.secondAccordiain;
  }

  toggleaccordin(){
    this.showFirstAccrodian = !this.showFirstAccrodian;
  }

  toggleThirdAccordian(){
    this.showThirdAccrodian = !this.showThirdAccrodian;
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
  /* changeAdditionalAmount(event){

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

    if((Number(this.laycreditpoints) + Number(this.upFrontPayment))>=this.priceData[0].selling_price){
      this.toggleFullPayment();
    }
    this.calculateInstalment();
  } */

  changeAdditionalAmount(){

    this.upFrontPayment = ((this.instalmentRequest.amount-Number(this.laycreditpoints)) *Number(this.percentageValue))/100;
    if(this.percentageValue==this.percentageArray[0]){
      this.additionalAmount = Number(this.laycreditpoints);
    }
    else{
      this.additionalAmount = Number(this.laycreditpoints) + this.getPerecentageAmount() -this.defaultInstalment;
    }
    console.log("this.additionalAmountthis.additionalAmount",this.additionalAmount)
    /* if(this.upFrontPayment<this.defaultInstalment){
      this.upFrontPayment=this.defaultInstalment;
    } */

    //this.additionalAmount = this.upFrontPayment-this.defaultInstalment;
    this.remainingAmount=this.remainingAmount-this.upFrontPayment;
    //this.firstInstalment=this.upFrontPayment;
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

    if((Number(this.laycreditpoints) + Number(this.upFrontPayment))>=this.priceData[0].selling_price){
      this.toggleFullPayment();
    }
    this.calculateInstalment();
  }

  changeCustomInstalmentAmount(event){
    if(this.customMethod=='amount'){
      this.customAmount = Number(event.target.value);
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

      if(Number(this.firstInstalment)+this.customAmount > this.priceData[0].selling_price){
        this.customAmount = this.priceData[0].selling_price - this.firstInstalment;
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
        if(this.instalments.percentage==20){
          this.percentageArray=[20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100];
          this.percentageValue=20;
        }
        else{
          this.percentageArray=[40,45,50,55,60,65,70,75,80,85,90,95,100];
          this.percentageValue=40;
        }
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
        //this.additionalAmount = Number(this.laycreditpoints) + ((this.instalmentRequest.amount-Number(this.laycreditpoints)) *Number(this.percentageValue))/100;
        /* console.log(this.defaultInstalmentNo,"----",this.customInstalment)
        if(this.customInstalment){
          this.defaultInstalmentNo = this.defaultInstalmentNo - this.customInstalment;
        } */
        setTimeout(()=>{ this.triggerPayemntMode('instalment'); },2000);
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
      
      if(res.instalment_available==true){
        this.biWeeklyDefaultInstalmentNo = res.instalment_date.length;
        this.biWeeklyDefaultInstalment = res.instalment_date[1].instalment_amount;
        this.biWeeklyFirstInstalment = res.instalment_date[0].instalment_amount;
        this.biWeeklySecondInstalmentTemp = res.instalment_date[1].instalment_amount;
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
      
      if(res.instalment_available==true){
        this.monthlyDefaultInstalmentNo = res.instalment_date.length;
        this.monthlyDefaultInstalment = res.instalment_date[1].instalment_amount;
        this.monthlyFirstInstalment = res.instalment_date[0].instalment_amount;
        this.monthlySecondInstalmentTemp = res.instalment_date[1].instalment_amount;
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
      
      if(res.instalment_available==true){
        this.weeklyDefaultInstalmentNo = res.instalment_date.length;
        this.weeklyDefaultInstalment = res.instalment_date[1].instalment_amount;
        this.weeklyFirsttInstalment = res.instalment_date[0].instalment_amount;
        this.weeklySecondInstalmentTemp = res.instalment_date[1].instalment_amount;
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
    if(this.instalments.percentage==20){
      this.percentageValue=20;
    }
    else{
      this.percentageValue=40;
    }
    this.customMethod='';
    this.additionalAmount=0;
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

    
    this.getInstalemntsWeekly('weekly')
    this.getInstalemntsBiweekly('biweekly')
    this.getInstalemntsMonthly('monthly')
  }

  triggerPayemntMode(type){
    if((Number(this.laycreditpoints) + Number(this.upFrontPayment))<=this.priceData[0].selling_price){
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
        this.redeemableLayCredit.emit(this.priceData[0].selling_price-this.defaultInstalment)
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

    this.instalmentRequest.instalment_type =this.durationType;
    //this.instalmentRequest.additional_amount=(this.upFrontPayment-this.defaultInstalment) + Number(this.laycreditpoints);
    console.log(this.additionalAmount,"this.additionalAmount");
    this.instalmentRequest.additional_amount=this.additionalAmount;
    this.genericService.getInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
        this.instalments=res;
        if(this.instalments.instalment_available==true){
          this.firstInstalment  = this.instalments.instalment_date[0].instalment_amount;
          this.remainingAmount  = this.instalmentRequest.amount - parseFloat(this.instalments.instalment_date[0].instalment_amount)
          this.secondInstalment = this.instalments.instalment_date[1].instalment_amount;
          this.getInstalemntsWeekly('weekly')
          this.getInstalemntsBiweekly('biweekly')
          this.getInstalemntsMonthly('monthly')
          

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
      if(typeof this.percentageValue!='undefined'){
        if(this.percentageArray[0]==this.percentageValue){
          this.additionalAmount = Number(this.laycreditpoints);
        }
        else{
          this.additionalAmount = Number(this.laycreditpoints) + this.getPerecentageAmount() -this.defaultInstalment;
        }
      }
      console.log("------",this.additionalAmount)
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
      
      /* if((Number(this.defaultInstalment) + Number(this.additionalAmount))>=this.priceData[0].selling_price){
        this.toggleFullPayment();
        this.disablePartialPayment=true;   
      }
      else{
        this.disablePartialPayment=false;   
      } */
      this.calculateInstalment();
    }

    if(changes['priceData']){
      this.discountedPrice = changes['priceData'].currentValue[0].secondary_selling_price;
      this.instalmentRequest.amount= changes['priceData'].currentValue[0].selling_price;
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
    this.sellingPrice = this.getTotalPrice();    
    if(this.isInstalemtMode){

      this.payNowPrice= this.defaultInstalment+this.getPerecentageAmount();
    }
    else{
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

  getPerecentageAmount(){
    return ((this.instalmentRequest.amount-Number(this.laycreditpoints)) *Number(this.percentageValue))/100;
  }

  convertToNumber(number){
    return Number(number)
  }

  loadJS(){
    // Start Custom Select js
    var x, i, j, l, ll, selElmnt, a, b, c;
    /*look for any elements with the class "custom - select":*/
    x = document.getElementsByClassName("custom-select");
    l = x.length;
    for (i = 0; i < l; i++) {
      selElmnt = x[i].getElementsByTagName("select")[0];
      ll = selElmnt.length;
      /*for each element, create a new DIV that will act as the selected item:*/
      a = document.createElement("DIV");
      a.setAttribute("class", "select-selected");
      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      x[i].appendChild(a);
      /*for each element, create a new DIV that will contain the option list:*/
      b = document.createElement("DIV");
      b.setAttribute("class", "select-items select-hide");
      for (j = 1; j < ll; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
          /*when an item is clicked, update the original select box,
          and the selected item:*/
          var y, i, k, s, h, sl, yl;
          s = this.parentNode.parentNode.getElementsByTagName("select")[0];
          sl = s.length;
          h = this.parentNode.previousSibling;
          for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName("same-as-selected");
              yl = y.length;
              for (k = 0; k < yl; k++) {
                y[k].removeAttribute("class");
              }
              this.setAttribute("class", "same-as-selected");
              break;
            }
          }
          h.click();
        });
        b.appendChild(c);
      }
      x[i].appendChild(b);
      a.addEventListener("click", function (e) {
        /*when the select box is clicked, close any other select boxes,
        and open/close the current select box:*/
        e.stopPropagation();
        this.closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
      });
    }
  }

  closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }
}
