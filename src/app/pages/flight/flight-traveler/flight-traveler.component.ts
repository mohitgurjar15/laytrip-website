import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TravelerService } from '../../../services/traveler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { getLoginUserInfo } from 'src/app/_helpers/jwt.helper';

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
  progressStep={ step1:true, step2:false, step3:false };
  isLoggedIn : boolean = false;
  public is_traveller : boolean = false;
  totalTraveler = 0;
  _itinerary :any;
  _travellersCountValid :boolean = false;
  isFlightNotAvailable:boolean=false;
  is_updateToken = false;
  userDetails;

  
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
    this.routeCode = this.route.snapshot.paramMap.get('rc')
  }
  
  
  getTravelers() {

    this._adults = this._childs = this._infants = [];
    let userToken = localStorage.getItem('_lay_sess');
    if(userToken && userToken != 'undefined'){
      this.is_traveller = true;
     
      this.travelerService.getTravelers().subscribe((res:any)=>{
        this.travelers = res.data;
        this.travelers.forEach(element => {
          if(element.user_type == 'adult'){
            this._adults.push(element);
          } else if(element.user_type == 'child'){
            this._childs.push(element);          
          }else if(element.user_type == 'infant'){
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
      this.is_updateToken = true;
      this.getTravelers();
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
