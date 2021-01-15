import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TravelerService } from '../../../services/traveler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import * as moment from 'moment';
import { FlightService } from '../../../services/flight.service';

@Component({
  selector: 'app-flight-traveler',
  templateUrl: './flight-traveler.component.html',
  styleUrls: ['./flight-traveler.component.scss']
})
export class FlightTravelerComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  travelers:any=[]
  _adults:any=[]
  _childs:any=[]
  _infants:any=[]
  selectedAdults = 0;  
  routeCode:string='';
  loading=true;
  progressStep={ step1:true, step2:true, step3:false, step4:false };
  isLoggedIn : boolean = false;
  public is_traveller : boolean = false;
  totalTraveler = 0;
  _itinerary :any;
  _travellersCountValid :boolean = false;
  isFlightNotAvailable:boolean=false;
  is_updateToken = false;
  userDetails;
  partialPaymentAmount:number=0;
  showPartialPayemntOption:boolean=false;
  isComplete : boolean = false;
  payNowAmount:number=0;
  instalmentMode:string='';
  priceData=[];
  laycreditpoints:number;
  slectedItinerary:any={};
  
  constructor(
    private travelerService:TravelerService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private router:Router,
    private flightService:FlightService
  ) { }

  ngOnInit() {
    window.scroll(0,0);
    this.loading = true;
    this.getTravelers();
    this.getSellingPrice();
    this.checkUser()

    if(sessionStorage.getItem('_itinerary')){
      this._itinerary = JSON.parse(sessionStorage.getItem('_itinerary'));
      this.totalTraveler =  (Number(this._itinerary.adult) + Number(this._itinerary.child) + Number(this._itinerary.infant));   
    }
    this.routeCode = this.route.snapshot.paramMap.get('rc');

    let customInstalmentData:any=atob(sessionStorage.getItem('__islt'))
    customInstalmentData = JSON.parse(customInstalmentData);
    
    this.partialPaymentAmount = customInstalmentData.partialPaymentAmount;
    this.laycreditpoints = customInstalmentData.layCreditPoints;
    this.instalmentMode=atob(sessionStorage.getItem('__insMode'))
    this.showPartialPayemntOption= this.instalmentMode=='instalment'?true:false;
   
    this.payNowAmount = customInstalmentData.payNowAmount;
  }
  
  
  getTravelers() {
    this._adults = this._childs = this._infants = this.travelers= [];
    

    let userToken = localStorage.getItem('_lay_sess');
    if(userToken && userToken != 'undefined'){
      this.is_traveller = true;     
      this.travelerService.getTravelers().subscribe((res:any)=>{
      this.travelers = res.data;        

      this.travelers.forEach(element => {
        
        if(element.user_type == 'adult') {                              
          element.isComplete  = this.checkTravellerComplete(element,'adult');            
          this._adults.push(element);

        } else if(element.user_type == 'child'){
          element.isComplete  = this.checkTravellerComplete(element,'child');            
          this._childs.push(element);          
        }else if(element.user_type == 'infant'){
          element.isComplete  = this.checkTravellerComplete(element,'infant');            
          this._infants.push(element);          
        }
      });  
        this.loading = false;
      })
    } else {
      this.loading = false;
    }
    
    setTimeout(() => {
      this.loading = false;      
    }, 2000);
  }

  checkTravellerComplete(object,type){
    let isEmpty = false;
    let travellerKeys = ["firstName","lastName","email","dob","gender"];
    let _itinerary : any;
    let _itineraryJson : any;
     _itinerary =  sessionStorage.getItem('_itinerary');
    try{
       _itineraryJson  = JSON.parse(_itinerary);
       
      }catch(e){}
      
    if(type == 'adult'){
      let adultTravellerKeys = ["firstName","lastName","email","dob","gender","countryCode","phoneNo"];
      
      if(_itineraryJson && _itineraryJson.is_passport_required) {
         adultTravellerKeys = ["firstName","lastName","email","dob","gender","countryCode","phoneNo","passportNumber","passportExpiry"];        
      }

      isEmpty = this.checkObj(object,adultTravellerKeys);     
    } else if(type == 'child' || type == 'infant'){
      isEmpty = this.checkObj(object,travellerKeys);
    } 
    return isEmpty;
    

  }
  
  
  checkObj(obj,travellerKeys) { 
    let isComplete = true;
    const userStr = JSON.stringify(obj);
    JSON.parse(userStr, (key, value) => {
      if(!value &&  travellerKeys.indexOf(key) !== -1){
        return isComplete = false;                
      }          
    }); 
    return isComplete;
  }

  getAdultCount(count: number){  
    this.selectedAdults = count;
  }

  getItinerarySelectionArray(itinerarys){  
    this.slectedItinerary = itinerarys;
    this._travellersCountValid = false;

    if(itinerarys.adult.length === Number(this._itinerary.adult)
    && itinerarys.child.length === Number(this._itinerary.child) 
    && itinerarys.infant.length === Number(this._itinerary.infant)
    ){
      this._travellersCountValid = true;
    } 
  }

  checkTravelesValid() {
    if(typeof this.slectedItinerary == 'undefined' || Object.keys(this.slectedItinerary).length == 0 || (typeof this.slectedItinerary.adult != 'undefined' && this.slectedItinerary.adult.length == 0 && this.slectedItinerary.child.length == 0 && this.slectedItinerary.infant.length == 0)) {
      this.toastr.error('Please select itinerary', 'Invalid Criteria',{positionClass:'toast-top-center',easeTime:1000});
      return;
    }
    if(this._travellersCountValid ){
      this.router.navigate(['/flight/checkout',this.routeCode]);
    } else {
      let errorMessage = "You can only select ";
      if(Number(this._itinerary.adult)){
        errorMessage +=  Number(this._itinerary.adult)+" Adult, ";
      } 
      if(Number(this._itinerary.child)){
        errorMessage +=  Number(this._itinerary.child)+" Child, ";
      } 
      if(Number(this._itinerary.infant)){
        errorMessage +=  Number(this._itinerary.infant)+" Infant";
      } 
      errorMessage = errorMessage.replace(/,\s*$/, "");
      
      this.toastr.error(errorMessage, 'Invalid Criteria',{positionClass:'toast-top-center',easeTime:1000});
    }
  }

  checkUser(){
  
    this.userDetails = getLoginUserInfo();
    if(this.isLoggedIn && this.userDetails.roleId != 7 && !this.is_updateToken){
      this.is_updateToken = this.is_traveller = true ;
      // this.getTravelers();
    } 
    let userToken = localStorage.getItem('_lay_sess');    
    if(userToken && userToken != 'undefined'){
      this.isLoggedIn = true;
    }
  }
  
  /* ngDoCheck(){

    this.checkUser(); 
    if(this.is_traveller === false){
      this.loading = true;
      this.getTravelers();
    } 
  } */

  flightAvailable(event){
    this.isFlightNotAvailable=event;
  }

  onActivate(event){
    window.scroll(0,0);
  }

  getSellingPrice(){
     
    try{
      let __route = sessionStorage.getItem('__route');
      let response  = JSON.parse(__route);
      response[0]=response;
      let payLoad ={
        departure_date : moment(response[0].departure_date,'DD/MM/YYYY').format("YYYY-MM-DD"),
        net_rate  : response[0].net_rate
      }
      this.flightService.getSellingPrice(payLoad).subscribe((res:any)=>{
  
        this.priceData=res;
      },(error)=>{
  
      })
    }
    catch(e){

    }
  }
}
