import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { GenericService } from '../../services/generic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var $: any;


@Component({
  selector: 'app-adult-list',
  templateUrl: './adult-list.component.html',
  styleUrls: ['./adult-list.component.scss']
})
export class AdultListComponent implements OnInit {
  @Output() adultsCount = new EventEmitter();
  @Output() _itinerarySelectionArray = new EventEmitter();
  @Input() travelers: any = [];
  @Input() username: string;
  @Input() type: string;
  @Input() age: string;
  @Input() _adults: [];
  @Input() _childs: [];
  @Input() _infants: [];

  counter = 0;
  totalTravelerCount = 0;
  _travelers = [];
  _selectedId = [];
  checked: boolean = false;
  checkBoxDisable: boolean = false;
  isLoggedIn: boolean = false;
  showAddAdultForm: boolean = false;
  showAddChildForm: boolean = false;
  showAddInfantForm: boolean = false;
  adultFormStatus: boolean = false;
  infantCollapse : boolean = false;
  childCollapse : boolean = false;
  adultCollapse : boolean = false;
  count = 0;
  random = 0;
  _itinerary :any;
  countries: any = [];
  countries_code: any = [];
  containers = [];
  _itinerarySelection:any = {
    adult:[],
    child:[],
    infant:[]
  };

  constructor(
    private cookieService: CookieService,
    private genericService: GenericService,
    public router: Router,
    public cd: ChangeDetectorRef,
    private toastr: ToastrService


  ) { }

  ngOnInit() {
   
    this.checkUser();
    this.getCountry();
    if (this.type == 'adult' && !this.isLoggedIn) {
      this.showAddAdultForm = true;
    }
  }



  selectTraveler(event, traveler) {
    
    if(event.target.checked){
      if(traveler.user_type == 'adult'){
        this._itinerarySelection.adult.push(traveler.userId);
      } else if(traveler.user_type == 'child'){
        this._itinerarySelection.child.push(traveler.userId);
      } else {
        this._itinerarySelection.infant.push(traveler.userId);
      }
    } else {
      if(traveler.user_type == 'adult'){
        this._itinerarySelection.adult = this._itinerarySelection.adult.filter(obj => obj !== traveler.userId);
      } else if(traveler.user_type == 'child'){
        this._itinerarySelection.child = this._itinerarySelection.child.filter(obj => obj !== traveler.userId);
      } else {
        this._itinerarySelection.infant = this._itinerarySelection.infant.filter(obj => obj !== traveler.userId);
      }
    }
    this._itinerarySelectionArray.emit(this._itinerarySelection)
   /*  if (event.target.checked) {
      this._selectedId.push(event.target.id);
      this._itinerary = JSON.parse(this.cookieService.get('_itinerary'));
      let totalTraveler =  (Number(this._itinerary.adult) + Number(this._itinerary.child) + Number(this._itinerary.infant));   
      
      if (this.counter + 1 < totalTraveler) {
        this.counter++;
        this.checkBoxDisable = false;
      } else {
        this.checkBoxDisable = true;        
        
      }
    } else {
      this._selectedId = this._selectedId.filter(obj => obj !== event.target.id);

      this.checkBoxDisable = false
      this.counter--;
    } */
    // console.log(this.counter ,this._selectedId)

    /* if (event.target.checked) {
      traveler.checked = true;
      let travelerData = {
        "userId": traveler.userId,
        "firstName": traveler.firstName,
        "lastName": traveler.lastName,
        "email": traveler.email
      };
      this._travelers.push(travelerData);
      this.cookieService.put("_travelers", JSON.stringify(this._travelers));
      // let checkCounter = this.counter + 1;
      
      if (this.counter + 1 < this.totalTravelerCount) {
        this.counter++;
        this.checkBoxDisable = false;
      } else {
        this.checkBoxDisable = false;
      }
    } else {
      traveler.checked = false;
      this.counter--;
      this.checkBoxDisable = false;
      this._travelers = this._travelers.filter(obj => obj.userId !== traveler.userId);
      this.cookieService.remove('_travelers');
      this.cookieService.put("_travelers", JSON.stringify(this._travelers));
    } */

    // this.adultsCount.emit(this.counter);
  }

  getRandomNumber(i: number) {
    let random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  }


  ngOnChanges(changes) {
    if (changes['traveler']) {
      // console.log("this.traveler",this.travelers)
    }
  }


  ngDoCheck() {
    /* this._selectedId.forEach(id => {
      $(  "#"+id   ).removeAttr( "disabled" );     
    }); */
    this.checkUser();
    this.containers = this.containers;
    this.travelers = this.travelers;
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
    this.travelers.push(event);
    this.showAddAdultForm = false;
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
    console.log(this.adultCollapse)

  }

  getCountry() {
    this.genericService.getCountry().subscribe((data: any) => {
      this.countries = data.map(country => {
        return {
          id: country.id,
          name: country.name,
          code: country.phonecode
        }
      }),
        this.countries_code = data.map(country => {
          return {
            id: country.id,
            name: country.phonecode + ' (' + country.iso2 + ')',
            code: country.phonecode
          }
        })
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

}
