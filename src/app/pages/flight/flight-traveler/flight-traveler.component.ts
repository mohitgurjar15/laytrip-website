import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TravelerService } from '../../../services/traveler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { map } from 'rxjs/operators';

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

  
  constructor(
    private travelerService:TravelerService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private router:Router
  ) { }

  ngOnInit() {
    window.scroll(0,0);
    this.loading = true;
    this.getTravelers();

    if(sessionStorage.getItem('_itinerary')){
      this._itinerary = JSON.parse(sessionStorage.getItem('_itinerary'));
      this.totalTraveler =  (Number(this._itinerary.adult) + Number(this._itinerary.child) + Number(this._itinerary.infant));   
    }
    this.routeCode = this.route.snapshot.paramMap.get('rc');

    let customInstalmentData:any=atob(sessionStorage.getItem('__islt'))
    customInstalmentData = JSON.parse(customInstalmentData);
    console.log("customInstalmentData",customInstalmentData)
    
    this.partialPaymentAmount = customInstalmentData.partialPaymentAmount;
    this.payNowAmount = customInstalmentData.payNowAmount;
    let instalmentMode=atob(sessionStorage.getItem('__insMode'))
    this.showPartialPayemntOption= instalmentMode=='instalment'?true:false;
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
    if(type == 'adult'){
      let travellerKeys = ["firstName","lastName","email","dob","gender","phoneNo","title"];
      isEmpty = this.checkObj(object,travellerKeys);     

    } else if(type == 'child'){
      let travellerKeys = ["firstName","lastName","email","dob","gender","title"];
      isEmpty = this.checkObj(object,travellerKeys);

    } else if(type == 'infant'){
      let travellerKeys = ["firstName","lastName","email","dob","gender","title"];
      isEmpty = this.checkObj(object,travellerKeys);

    }
    return isEmpty;
    

  }
  
  
  checkObj(obj,travellerKeys){ 
    let isComplete = true;
    // obj.firstName = '';
  
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
    this._travellersCountValid = false;
    if(itinerarys.adult.length === Number(this._itinerary.adult)
    && itinerarys.child.length === Number(this._itinerary.child) 
    && itinerarys.infant.length === Number(this._itinerary.infant)
    ){
      this._travellersCountValid = true;
    }
  }

  checkTravelesValid() {

    if(this._travellersCountValid ){
      this.router.navigate(['/flight/checkout',this.routeCode]);
    } else {
      let errorMessage = "You have to select "+ Number(this._itinerary.adult)+" Adult, "
      + Number(this._itinerary.child)+" Child "+Number(this._itinerary.infant)+" Infant";
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
  
  ngDoCheck(){

    this.checkUser(); 
    if(this.is_traveller === false){
      this.loading = true;
      this.getTravelers();
    } 
  }

  flightAvailable(event){
    this.isFlightNotAvailable=event;
  }

  onActivate(event){
    window.scroll(0,0);
  }
}
