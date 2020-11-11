import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { GenericService } from '../../services/generic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-adult-list',
  templateUrl: './adult-list.component.html',
  styleUrls: ['./adult-list.component.scss']
})
export class AdultListComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Output() adultsCount = new EventEmitter();
  @Output() _itinerarySelectionArray = new EventEmitter();
  @Input() travelers: any = [];
  @Input() username: string;
  @Input() type: string;
  @Input() age: string;
  @Input() _adults: any = [];
  @Input() _childs = [];
  @Input() _infants: any = [];

  counter = 0;
  adultCounter = 0;
  childCounter = 0;
  infantCounter = 0;
  totalTravelerCount = 0;
  _travelers = [];
  _selectedId = [];
  loader: boolean = true;
  checked: boolean = false;
  loading: boolean = true;
  checkBoxDisable: boolean = false;
  isLoggedIn: boolean = false;
  showAddAdultForm: boolean = false;
  showAddChildForm: boolean = false;
  showAddInfantForm: boolean = false;
  adultFormStatus: boolean = false;
  infantCollapse: boolean = false;
  childCollapse: boolean = false;
  adultCollapse: boolean = false;
  count = 0;
  random = 0;
  _itinerary: any = [];
  countries: any = [];
  countries_code: any = [];
  containers = [];
  _itinerarySelection: any = {
    adult: [],
    child: [],
    infant: []
  };
  totalAdult=0;
  countChild=0;

  constructor(
    private cookieService: CookieService,
    private genericService: GenericService,
    public router: Router,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.checkUser();
    this.getCountry();
    let _itinerary:any =  sessionStorage.getItem('_itinerary');
    try{
      this._itinerary = _itinerary ? JSON.parse(_itinerary) : this._itinerary;
    }catch(e){}

    if (this.type == 'adult' && !this.isLoggedIn) {
      this.showAddAdultForm = true;
    }
  }

  selectItinerary(event, traveler){
   
    let totalAdult = Number(this._itinerary.adult);
    let totalChild = Number(this._itinerary.child);
    let totalInfant = Number(this._itinerary.infant);
    if (this._itinerary) {
      if (event.target.checked) {
        let travelerData = {
          "userId": traveler.userId,
          "firstName": traveler.firstName,
          "lastName": traveler.lastName,
          "email": traveler.email
        };
        this._travelers.push(travelerData);
        this.cookieService.put("_travelers", JSON.stringify(this._travelers));
        if (this.adultCounter + 1 < totalAdult && traveler.user_type == 'adult') {
          this.adultCounter++;            
          // this.checkBoxDisable = false;
        }else{
          if(this.adultCounter + 1 == totalAdult && traveler.user_type == 'adult'){
            this.adultCounter++;       
            // this.checkBoxDisable = true;                
          }
        } 
        
        if (this.childCounter + 1 < totalChild && traveler.user_type == 'child') {
          this.childCounter++;            
          // this.checkBoxDisable = false;
        } else{
          if(this.childCounter + 1 == totalChild && traveler.user_type == 'child'){
            this.childCounter++;       
            // this.checkBoxDisable = true;                
          }
        } 
        if (this.infantCounter + 1 < totalInfant && traveler.user_type == 'infant') {          
          this.infantCounter++;
        } else {
          if(this.infantCounter + 1 == totalInfant && traveler.user_type == 'infant'){              
            this.infantCounter++;       
          }
        } 
                
        if (traveler.user_type == 'adult') {
          this._itinerarySelection.adult.push(traveler.userId);
        } else if (traveler.user_type == 'child') {
          this._itinerarySelection.child.push(traveler.userId);
        } else if(traveler.user_type == 'infant' ){
          this._itinerarySelection.infant.push(traveler.userId);
        } 
      } else {
        
        // this.checkBoxDisable = false;
        this._travelers = this._travelers.filter(obj => obj.userId !== traveler.userId);
        this.cookieService.remove('_travelers');
        this.cookieService.put("_travelers", JSON.stringify(this._travelers));
        if (traveler.user_type == 'adult') {
          if(this.adultCounter >= totalAdult || this.adultCounter <= totalAdult){
            this.adultCounter--;
          }
          this._itinerarySelection.adult = this._itinerarySelection.adult.filter(obj => obj !== traveler.userId);
        } else if (traveler.user_type == 'child') {
          if(this.childCounter >= totalChild || this.childCounter <= totalChild){
            this.childCounter--;
          }
          this._itinerarySelection.child = this._itinerarySelection.child.filter(obj => obj !== traveler.userId);
        } else if(traveler.user_type == 'infant'){
          if(this.infantCounter >= totalInfant || this.infantCounter <= totalInfant){
            this.infantCounter--;
          }
          this._itinerarySelection.child = this._itinerarySelection.infant.filter(obj => obj !== traveler.userId);
        }
      }
    }
    this._itinerarySelectionArray.emit(this._itinerarySelection);
  }
 

  getRandomNumber(i: number) {
    let random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['traveler']) {
      this.travelers = this.travelers;
    }
  }


  ngDoCheck() {
    this.checkUser();
    this.containers = this.containers;
    if (this.travelers.length >= 0) {
      this.loader = false;
      
    }
  }


  addForms(type) {
    if (type == 'adult') {
      this.showAddAdultForm = !this.showAddAdultForm;
    } else if (type == 'child') {
      this.showAddChildForm = !this.showAddChildForm;
    } else if (type == 'infant') {
      this.showAddInfantForm = !this.showAddInfantForm;
    }
  }

  checkUser() {
    let userToken = localStorage.getItem('_lay_sess');
    if (userToken) {
      this.isLoggedIn = true;
    }
  }


  pushTraveler(event) {
    let travellerKeys = ["firstName","lastName","email","dob","gender"];
    let _itinerary : any;
    let _itineraryJson : any;
     _itinerary =  sessionStorage.getItem('_itinerary');
    try{
    _itineraryJson  = JSON.parse(_itinerary);
    
    }catch(e){}
    
    if (event.user_type === 'adult') {

      const index = this._adults.indexOf(event.userId, 0);
      this._adults = this._adults.filter(item => item.userId != event.userId );  

      this.showAddAdultForm = false;      

      let adultTravellerKeys = ["firstName","lastName","email","dob","gender","countryCode","phoneNo"];
      
      if(_itineraryJson && _itineraryJson.is_passport_required) {
         adultTravellerKeys = ["firstName","lastName","email","dob","gender","countryCode","phoneNo","passportNumber","passportExpiry"];        
      }
      
      event.isComplete = this.checkObj(event,adultTravellerKeys);           
      this._adults.push(event);
    } else if (event.user_type === 'child') {

      this._childs = this._childs.filter(item => item.userId != event.userId );
      event.isComplete = this.checkObj(event,travellerKeys);     
      this._childs.push(event);
      this.showAddChildForm = false;

    } else {
      this._infants = this._infants.filter(item => item.userId != event.userId );
      event.isComplete = this.checkObj(event,travellerKeys);     
      this._infants.push(event);
      this.showAddInfantForm = false;
    }
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


  getFormStatus(status) {
    this.adultFormStatus = status;
  }

  infantCollapseClick() {
    this.infantCollapse = !this.infantCollapse;    
  }

  childCollapseClick() {
    this.childCollapse = !this.childCollapse;
  }

  adultCollapseClick() {
    this.adultCollapse = !this.adultCollapse;
  }

  getCountry() {
    this.genericService.getCountry().subscribe((data: any) => {
      this.countries = data.map(country => {
        return {
          id: country.id,
          name: country.name,
          code: country.phonecode,
          flag: this.s3BucketUrl+'assets/images/icon/flag/'+ country.iso3.toLowerCase()+'.jpg'
        }
      }),
        this.countries_code = data.map(country => {
          return {
            id: country.id,
            name:country.phonecode+' ('+country.iso2+')',
            code:country.phonecode,
            country_name:country.name+ ' ' +country.phonecode,
            flag: this.s3BucketUrl+'assets/images/icon/flag/'+ country.iso3.toLowerCase()+'.jpg'
          }
        })
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

}
