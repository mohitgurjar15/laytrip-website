import { Component, OnInit } from '@angular/core';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';

@Component({
  selector: 'app-flight-payment',
  templateUrl: './flight-payment.component.html',
  styleUrls: ['./flight-payment.component.scss']
})
export class FlightPaymentComponent implements OnInit {

  progressStep={ step1:true, step2:false, step3:false,step4:false };
  userInfo;
  isShowPaymentOption:boolean=true;
  laycreditpoints:number=0;
  sellingPrice:number=0;
  flightSummary=[];
  instalmentMode='instalment';
  instalmentType:string='weekly';
  customAmount:number | null;
  customInstalment:number | null;
  additionalAmount:number;
  constructor() { }

  ngOnInit() {
    window.scroll(0,0);
    this.userInfo = getLoginUserInfo();
    let __route = sessionStorage.getItem('__route');
    try{
      let response  = JSON.parse(__route);
      response[0]=response;
      this.flightSummary=response;
      this.sellingPrice = response[0].selling_price;
      console.log("this.sellingPrice",this.sellingPrice);
    }
    catch(e){

    }
  }

  applyLaycredit(laycreditpoints){
    this.laycreditpoints=laycreditpoints;
    this.isShowPaymentOption=true;
    if(this.laycreditpoints>=this.sellingPrice){
      this.isShowPaymentOption=false;
    }
  }

  selectInstalmentMode(instalmentMode){
    this.instalmentMode=instalmentMode;
  }

  getInstalmentData(data){

    this.additionalAmount = data.additionalAmount;
    this.instalmentType = data.instalmentType;
    this.customAmount = data.customAmount;
    this.customInstalment = data.customInstalment;

  }
}
