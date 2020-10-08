import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import * as moment from 'moment';
declare var $: any; 

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss']
})
export class PaymentModeComponent implements OnInit {

  
  @Output() selectInstalmentMode = new EventEmitter();
  @Output() getInstalmentData = new EventEmitter<{
    additionalAmount:number,
    instalmentType:string,
    customAmount:number,
    customInstalment:number,
    layCreditPoints:number
  }>(); 
  @Input() laycreditpoints;
  @Input() customInstalmentData:any={};
  constructor(
    private genericService:GenericService
  ) { }
  
  @Input() flightSummary;
  @Input() isShowSummary:boolean;
  @Input() showFullPartialPayOption:boolean=true;
  @Input() isShowPartialPaymentDetails:boolean=true;
  sellingPrice:number;
  isInstalemtMode:boolean=true;
  
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
  biWeeklyDefaultInstalmentNo:number=0;
  biWeeklyDefaultInstalment:number=0;
  monthlyDefaultInstalmentNo:number=0;
  monthlyDefaultInstalment:number=0;



  ngOnInit() {
    this.instalmentRequest.amount= this.flightSummary[0].selling_price;
    this.instalmentRequest.checkin_date= moment(this.flightSummary[0].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD");
    this.getInstalemnts('biweekly');
    this.getInstalemnts('monthly');
    this.getInstalemnts('weekly');
    console.log("Hellllo",this.sellingPrice)
    if(Object.keys(this.customInstalmentData).length){
      this.additionalAmount = this.customInstalmentData.additionalAmount;
      this.durationType = this.customInstalmentData.instalmentType;
      this.customAmount = this.customInstalmentData.customAmount;
      this.customInstalment = this.customInstalmentData.customInstalment;
      this.laycreditpoints = this.customInstalmentData.layCreditPoints;
      this.calculateInstalment();
    }
  }

  toggleaccordin(){
    this.showFirstAccrodian = !this.showFirstAccrodian;
  }

  changeAdditionalAmount(event){

    this.additionalAmount = Number(event.target.value);

    this.remainingAmount=this.remainingAmount-this.additionalAmount;
    this.firstInstalment+=this.additionalAmount;
    this.getInstalmentData.emit({ 
      additionalAmount:this.additionalAmount , 
      instalmentType:this.durationType, 
      customAmount: this.instalmentRequest.custom_amount,
      customInstalment : this.instalmentRequest.custom_instalment_no,
      layCreditPoints : this.laycreditpoints
    })
    this.calculateInstalment();
  }

  changeCustomInstalmentAmount(event){
    if(this.customMethod=='amount'){

      this.customAmount = Number(event.target.value);
    }

    this.getInstalmentData.emit({ 
      additionalAmount:this.additionalAmount , 
      instalmentType:this.durationType, 
      customAmount: this.customAmount,
      customInstalment : null,
      layCreditPoints : this.laycreditpoints
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

        if(type=='weekly'){
          this.weeklyDefaultInstalmentNo = this.instalments.instalment_date.length;
          this.weeklyDefaultInstalment = this.instalments.instalment_date[0].instalment_amount;
        }

        if(type=='biweekly'){
          this.biWeeklyDefaultInstalmentNo = this.instalments.instalment_date.length;
          this.biWeeklyDefaultInstalment = this.instalments.instalment_date[0].instalment_amount;
        }

        if(type=='monthly'){
          this.monthlyDefaultInstalmentNo = this.instalments.instalment_date.length;
          this.monthlyDefaultInstalment = this.instalments.instalment_date[0].instalment_amount;
        }

        this.instalmentAvavible=true;
        this.remainingAmount  = this.instalmentRequest.amount - parseFloat(this.instalments.instalment_date[0].instalment_amount)
        this.firstInstalment  = this.instalments.instalment_date[0].instalment_amount;
        this.defaultInstalment  = this.instalments.instalment_date[0].instalment_amount;
        this.customAmount     = this.instalments.instalment_date[0].instalment_amount;
        this.customInstalment = this.instalments.instalment_date.length;
        this.defaultInstalmentNo = this.instalments.instalment_date.length;
        this.remainingInstalment = this.instalments.instalment_date.length-1;
        this.secondInstalment = this.instalments.instalment_date[1].instalment_amount;
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
    this.laycreditpoints=0;
    this.instalmentRequest.custom_amount=null;
    this.instalmentRequest.custom_instalment_no=null;
    this.instalmentRequest.additional_amount=0;
    this.getInstalmentData.emit({ 
      additionalAmount:this.additionalAmount , 
      instalmentType:this.durationType, 
      customAmount: this.instalmentRequest.custom_amount,
      customInstalment : this.instalmentRequest.custom_instalment_no,
      layCreditPoints : this.laycreditpoints
    })
    this.getInstalemnts(this.durationType);

  }

  triggerPayemntMode(type){

    if(type=='instalment'){

      this.isInstalemtMode = true;
      this.getInstalmentData.emit({ 
        additionalAmount:this.additionalAmount , 
        instalmentType:this.durationType, 
        customAmount: this.customAmount,
        customInstalment : null,
        layCreditPoints :this.laycreditpoints
      })
    }

    if(type=='no-instalment'){

      this.isInstalemtMode = false;
      this.getInstalmentData.emit({ 
        additionalAmount:this.additionalAmount , 
        instalmentType:'', 
        customAmount: null,
        customInstalment : null,
        layCreditPoints :this.laycreditpoints
      })
    }
    this.selectInstalmentMode.emit(type)

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
      layCreditPoints : this.laycreditpoints
    })
    this.calculateInstalment();

  }

  /**
   * 
   * @param type [increase,decrease]
   */
  setCustomAmount(type){

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
        layCreditPoints : this.laycreditpoints
      })
    }
  }

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
      layCreditPoints : this.laycreditpoints
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
      layCreditPoints : this.laycreditpoints
    })
    this.customAmount = this.defaultInstalment;
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

    this.instalmentRequest.additional_amount=this.additionalAmount + Number(this.laycreditpoints);

    this.genericService.getInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
      this.instalments=res;
      if(this.instalments.instalment_available==true){
        
        this.firstInstalment  = this.instalments.instalment_date[0].instalment_amount;
        this.remainingAmount  = this.instalmentRequest.amount - parseFloat(this.instalments.instalment_date[0].instalment_amount)
        this.secondInstalment = this.instalments.instalment_date[1].instalment_amount;
        this.remainingInstalment = this.instalments.instalment_date.length-1;
          console.log("1223innnnn",this.firstInstalment,this.flightSummary[0].selling_price);
        if(this.firstInstalment>=this.flightSummary[0].selling_price){
          this.isInstalemtMode = false;
          this.selectInstalmentMode.emit('no-instalment')
        }
      }
    },(err)=>{

    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['laycreditpoints']) {
      this.laycreditpoints = changes['laycreditpoints'].currentValue;
      this.getInstalmentData.emit({ 
        additionalAmount:this.additionalAmount , 
        instalmentType:this.durationType, 
        customAmount: this.instalmentRequest.custom_amount,
        customInstalment : this.instalmentRequest.custom_instalment_no,
        layCreditPoints : this.laycreditpoints
      })
      this.calculateInstalment();
    }
  }
}
