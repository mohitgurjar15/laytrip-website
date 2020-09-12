import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Options, ChangeContext } from 'ng5-slider';
import { GenericService } from '../../services/generic.service';
import * as moment from 'moment';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss']
})
export class PaymentModeComponent implements OnInit {

  @Output() applyLaycredit = new EventEmitter();
  @Output() selectInstalmentMode = new EventEmitter();
  @Output() getInstalmentData = new EventEmitter<{
    additionalAmount:number,
    instalmentType:string,
    customAmount:number,
    customInstalment:number
  }>(); 
  constructor(
    private genericService:GenericService
  ) { }
  
  @Input() flightSummary;
  sellingPrice:number;
  isInstalemtMode:boolean=false;
  value: number = 100;
  laycreditOptions: Options = {
    floor: 0,
    ceil: 600
  };
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

  ngOnInit() {

    this.instalmentRequest.amount= this.flightSummary[0].selling_price;
    this.instalmentRequest.checkin_date= moment(this.flightSummary[0].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD");
    this.getInstalemnts('weekly');
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
        this.remainingAmount  = this.instalmentRequest.amount - parseFloat(this.instalments.instalment_date[0].instalment_amount)
        this.firstInstalment  = this.instalments.instalment_date[0].instalment_amount;
        this.defaultInstalment  = this.instalments.instalment_date[0].instalment_amount;
        this.customAmount     = this.instalments.instalment_date[0].instalment_amount;
        this.customInstalment = this.instalments.instalment_date.length;
        this.defaultInstalmentNo = this.instalments.instalment_date.length;
        this.remainingInstalment = this.instalments.instalment_date.length-1;
        this.secondInstalment = this.instalments.instalment_date[1].instalment_amount;

      }
    },(err)=>{

    })
  }

  changeDuration(type){
    this.durationType=type;
    this.customMethod='';
    this.additionalAmount=0;
    this.instalmentRequest.custom_amount=null;
    this.instalmentRequest.custom_instalment_no=null;
    this.getInstalmentData.emit({ 
      additionalAmount:this.additionalAmount , 
      instalmentType:this.durationType, 
      customAmount: this.instalmentRequest.custom_amount,
      customInstalment : this.instalmentRequest.custom_instalment_no
    })
    this.getInstalemnts(this.durationType);

  }

  triggerPayemntMode(type){

    if(type=='instalment'){

      this.isInstalemtMode = true;
    }

    if(type=='no-instalment'){

      this.isInstalemtMode = false;
    }
    this.selectInstalmentMode.emit(type)

  }

  selectLaycredit(changeContext: ChangeContext): void {
    
    this.applyLaycredit.emit(changeContext.value)
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
      customInstalment : this.instalmentRequest.custom_instalment_no
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
      }
      else{

        if(this.defaultInstalment<this.customAmount){

          this.customAmount-=1;
        }
      }
      this.getInstalmentData.emit({ 
        additionalAmount:this.additionalAmount , 
        instalmentType:this.durationType, 
        customAmount: this.customAmount,
        customInstalment : null
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
        }
      }
      else{
         if(this.customInstalment>2){
           this.customInstalment-=1;
         }
      }
    }
    this.getInstalmentData.emit({ 
      additionalAmount:this.additionalAmount , 
      instalmentType:this.durationType, 
      customAmount: null,
      customInstalment : this.customInstalment
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
      customInstalment : this.instalmentRequest.custom_instalment_no
    })
    this.customAmount = this.defaultInstalment;
    this.customInstalment = this.defaultInstalmentNo;
    this.customMethod=event.target.checked?event.target.value:'';
    //this.calculateInstalment();
  }
  
  calculateInstalment(){

    if(this.customMethod=='amount'){

      this.instalmentRequest.custom_amount=this.customAmount;
      this.instalmentRequest.custom_instalment_no=null;
    }
    else{
      this.instalmentRequest.custom_amount=null;
      this.instalmentRequest.custom_instalment_no=this.customInstalment;
    }
    this.instalmentRequest.additional_amount = this.additionalAmount;

    this.instalmentRequest.additional_amount=this.additionalAmount;

    this.genericService.getInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
      this.instalments=res;
      if(this.instalments.instalment_available==true){
        
        this.firstInstalment  = this.instalments.instalment_date[0].instalment_amount;
        this.remainingAmount  = this.instalmentRequest.amount - parseFloat(this.instalments.instalment_date[0].instalment_amount)
        this.secondInstalment = this.instalments.instalment_date[1].instalment_amount;
        this.remainingInstalment = this.instalments.instalment_date.length-1;
      }
    },(err)=>{

    })
  }
}
