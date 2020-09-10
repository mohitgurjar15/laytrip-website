import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Options, ChangeContext } from 'ng5-slider';
import { GenericService } from 'src/app/services/generic.service';
import * as moment from 'moment';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss']
})
export class PaymentModeComponent implements OnInit {

  @Output() applyLaycredit = new EventEmitter();
  @Output() selectInstalmentMode = new EventEmitter();
  constructor(
    private genericService:GenericService
  ) { }
  
  sellingPrice:number;
  isInstalemtMode:boolean=false;
  value: number = 100;
  laycreditOptions: Options = {
    floor: 0,
    ceil: 600
  };
  instalmentRequest={
    instalment_type: "weekly",
    checkin_date: "2020-10-25",
    booking_date: moment().format("YYYY-MM-DD"),
    amount: 150,
    additional_amount: null,
    custom_instalment_no: null,
    custom_amount: null
  }
  instalments;
  durationType:string; // [weekly,biweekly,monthly]
  additionalAmount:number=0;
  remainingAmount:number;
  firstInstalment:number;
  customAmount:number;
  customInstalment:number;
  defaultInstalment:number;
  defaultInstalmentNo:number;
  customMethod:string;

  ngOnInit() {

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
      }
    },(err)=>{

    })
  }

  changeDuration(type){
    this.durationType=type;
  }

  triggerPayemntMode(type){

    if(type=='instalment'){

      this.isInstalemtMode = true;
    }

    if(type=='noinstalment'){

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

  }

  /**
   * 
   * @param type [increase,decrease]
   */
  setCustomAmount(type){

    if(type=='increase'){
      this.customAmount+=1;
    }
    else{

      if(this.defaultInstalment<this.customAmount){

        this.customAmount-=1;
      }
    }
  }

  /**
   * 
   * @param type [increase,decrease]
   */
  setCustomInstalmentNo(type){
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

  /**
   * 
   * @param type [amount,instalment]
   */
  selectCustomMethod(type){
    this.customMethod=type;
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
    this.instalmentRequest.additional_amount=this.additionalAmount;

    this.genericService.getInstalemnts(this.instalmentRequest).subscribe((res:any)=>{
      this.instalments=res;
      if(this.instalments.instalment_available==true){
        /* this.remainingAmount  = this.instalmentRequest.amount - parseFloat(this.instalments.instalment_date[0].instalment_amount)
        this.firstInstalment  = this.instalments.instalment_date[0].instalment_amount;
        this.defaultInstalment  = this.instalments.instalment_date[0].instalment_amount;
        this.customAmount     = this.instalments.instalment_date[0].instalment_amount;
        this.customInstalment = this.instalments.instalment_date.length;
        this.defaultInstalmentNo = this.instalments.instalment_date.length; */
        console.log(res)
      }
    },(err)=>{

    })
  }
}
