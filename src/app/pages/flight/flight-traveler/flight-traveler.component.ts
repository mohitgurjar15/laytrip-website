import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TravelerService } from '../../../services/traveler.service';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
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

  constructor(
    private travelerService:TravelerService,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.getTravelers();
    this._itinerary = JSON.parse(this.cookieService.get('_itinerary'));
    this.totalTraveler =  (Number(this._itinerary.adult) + Number(this._itinerary.child) + Number(this._itinerary.infant));   
    this.routeCode = this.route.snapshot.paramMap.get('rc')
  }
  
  
  getTravelers(){
    let userToken = localStorage.getItem('_lay_sess');
    if(userToken){
      
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
      })
    }
    this.loading = false;
  }

  getAdultCount(count: number){  
    this.selectedAdults = count;
  }

  checkUser(){
    let userToken = localStorage.getItem('_lay_sess');
    
    if( userToken) {
      this.isLoggedIn = true;
      this.is_traveller = false;
    }
  }
  
  ngDoCheck(){
    this.checkUser();    
    if(this.is_traveller === false && this.travelers.length === 0 ){
      this.is_traveller = true;
      // this.getTravelers();
    }
  }
}
