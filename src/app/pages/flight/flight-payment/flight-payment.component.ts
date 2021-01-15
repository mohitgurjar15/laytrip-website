import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { environment } from '../../../../environments/environment';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { FlightService } from '../../../services/flight.service';
import * as moment from 'moment';
import { GenericService } from '../../../services/generic.service';
import { FormGroup } from '@angular/forms';
import { TravelerService } from '../../../services/traveler.service';
import { CheckOutService } from '../../../services/checkout.service';

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
  showPartialPayemntOption:boolean=true;
  partialPaymentAmount:number;
  payNowAmount:number=0;
  redeemableLayPoints:number;
  priceData=[];
  totalLaycreditPoints:number=0;
  isLayCreditLoading:boolean=false;
  priceSummary;
  travelerForm: FormGroup;
  travelers=[];
  carts=[];

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private flightService: FlightService,
    private genericService:GenericService,
    private travelerService:TravelerService,
    private checkOutService:CheckOutService
  ) { 
    this.totalLaycredit();
  }

  ngOnInit() {
    window.scroll(0,0);
    this.routeCode = this.route.snapshot.paramMap.get('rc');  
    this.userInfo = getLoginUserInfo();
    if(Object.keys(this.userInfo).length>0){
      this.getTravelers();
    }

    let __route = sessionStorage.getItem('__route');
    try{
      let response  = JSON.parse(__route);
      response[0]=response;
      this.flightSummary=response;
      this.carts[0]={
        type : 'flight',
        module_info:this.flightSummary[0],
        travelers:[]
      };
      //this.sellingPrice = response[0].selling_price;
      this.getSellingPrice();
    }
    catch(e){

    }

    sessionStorage.setItem('__insMode',btoa(this.instalmentMode))
  }

  totalLaycredit(){
    this.isLayCreditLoading=true;
    this.genericService.getAvailableLaycredit().subscribe((res:any)=>{
      this.isLayCreditLoading=false;
      this.totalLaycreditPoints=res.total_available_points;
    },(error=>{
      this.isLayCreditLoading=false;
    }))
  }

  applyLaycredit(laycreditpoints){
    this.laycreditpoints=laycreditpoints;
    this.isShowPaymentOption=true;
    if(this.laycreditpoints>=this.sellingPrice){
      this.isShowPaymentOption=false;
    }
  }
  
  getSellingPrice(){
     
    let payLoad ={
      departure_date : moment(this.flightSummary[0].departure_date,'DD/MM/YYYY').format("YYYY-MM-DD"),
      net_rate  : this.flightSummary[0].net_rate
    }
    this.flightService.getSellingPrice(payLoad).subscribe((res:any)=>{

      this.priceData=res;
      this.sellingPrice = this.priceData[0].selling_price;
    },(error)=>{

    })
  }

  selectInstalmentMode(instalmentMode){
    this.instalmentMode=instalmentMode;
    this.showPartialPayemntOption = (this.instalmentMode=='instalment')?true:false
    sessionStorage.setItem('__insMode',btoa(this.instalmentMode))
  }

  getInstalmentData(data){

    this.instalmentType = data.instalmentType;
    this.laycreditpoints = data.layCreditPoints;
    this.priceSummary=data;
    sessionStorage.setItem('__islt',btoa(JSON.stringify(data)))
  }

  flightAvailable(event){
    this.isFlightNotAvailable=event;
  }

  checkUserAndRedirect(){
    
    if(typeof this.userInfo.roleId!='undefined' && this.userInfo.roleId!=7){
      this.router.navigate(['/flight/checkout',this.routeCode]);      
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

  redeemableLayCredit(event){
    this.redeemableLayPoints=event;
  }

  getTravelers() {
    this.travelerService.getTravelers().subscribe((res:any)=>{
      //this.travelers=res.data;
      this.checkOutService.setTravelers(res.data)
    })
  }

  submitHandle(){
    
  }
}
