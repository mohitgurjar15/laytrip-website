import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { environment } from '../../../../environments/environment';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';

@Component({
  selector: 'app-flight-payment',
  templateUrl: './flight-payment.component.html',
  styleUrls: ['./flight-payment.component.scss']
})
export class FlightPaymentComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  progressStep={ step1:true, step2:false, step3:false,step4:false };
  userInfo;
  isShowPaymentOption:boolean=true;
  laycreditpoints:number=0;
  sellingPrice:number;
  flightSummary=[];
  instalmentMode='instalment';
  instalmentType:string='weekly';
  customAmount:number | null;
  customInstalment:number | null;
  additionalAmount:number;
  routeCode:string='';
  isFlightNotAvailable:boolean=false;
  isShowGuestPopup:boolean=false;
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit() {
    window.scroll(0,0);
    this.routeCode = this.route.snapshot.paramMap.get('rc');  
    this.userInfo = getLoginUserInfo();

    let __route = sessionStorage.getItem('__route');
    try{
      let response  = JSON.parse(__route);
      response[0]=response;
      this.flightSummary=response;
      this.sellingPrice = response[0].selling_price;
    }
    catch(e){

    }

    sessionStorage.setItem('__insMode',btoa(this.instalmentMode))
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
    sessionStorage.setItem('__insMode',btoa(this.instalmentMode))
  }

  getInstalmentData(data){

    this.additionalAmount = data.additionalAmount;
    this.instalmentType = data.instalmentType;
    this.customAmount = data.customAmount;
    this.customInstalment = data.customInstalment;
    this.laycreditpoints = data.layCreditPoints;
    sessionStorage.setItem('__islt',btoa(JSON.stringify(data)))
  }

  flightAvailable(event){
    this.isFlightNotAvailable=event;
  }

  checkUserAndRedirect(){
    console.log(this.userInfo)
    if(typeof this.userInfo.roleId!='undefined' && this.userInfo.roleId!=7){
      this.router.navigate(['/flight/traveler',this.routeCode]);      
    } else {
      this.isShowGuestPopup=true;
    }
  }

  changePopupValue(event){
    this.isShowGuestPopup = event; 
  }

  ngDoCheck() {
    let userToken = localStorage.getItem('_lay_sess');
    this.userInfo = getLoginUserInfo();

    if (userToken) {
      this.isLoggedIn = true;
    }
  }
}
