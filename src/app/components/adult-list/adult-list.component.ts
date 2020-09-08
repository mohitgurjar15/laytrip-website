import { Component, OnInit, Input, Output,EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { GenericService } from 'src/app/services/generic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-adult-list',
  templateUrl: './adult-list.component.html',
  styleUrls: ['./adult-list.component.scss']
})
export class AdultListComponent implements OnInit {
  @Output() adultsCount = new EventEmitter();
  @Input() travelers:any=[];
  @Input() username:string;
  @Input() type:string;
  @Input() age:string;
  @Input() totalTravelerCount:number;

  counter  = 0;
  _travelers  = [];
  checked : boolean = false;
  checkBoxDesable : boolean = false;
  isLoggedIn : boolean = false;
  showAddAdultForm : boolean = false;
  showAddChildForm : boolean = false;
  showAddInfantForm : boolean = false;
  adultFormStatus : boolean = false;
  count =0;
  countries: any = [];
  countries_code: any = [];
  containers = [];
  
  constructor(
    private cookieService: CookieService,
    private genericService: GenericService,
    public router: Router,
    public cd : ChangeDetectorRef

      ) { }

  ngOnInit() {    
    console.log(this.cookieService.getAll())
    this.checkUser();
    this.getCountry();
    if(this.type == 'adult' && !this.isLoggedIn){
      this.showAddAdultForm = true;
    }
  } 



  checkBox(event,traveler){
    if(event.target.checked){
      let travelerData = {
        "userId":traveler.userId,
        "firstName":traveler.firstName,
        "lastName":traveler.lastName,
        "email":traveler.email
      };
      this._travelers.push(travelerData); 
      this.cookieService.put("_travelers", JSON.stringify(this._travelers));
      let checkCounter = this.counter + 1;
      if(checkCounter < this.totalTravelerCount){
        this.counter++;
        this.checkBoxDesable = false;
      } else {        
        this.checkBoxDesable = true;
      }      
    } else {
      this.counter--;
      this.checkBoxDesable = false;
      this._travelers = this._travelers.filter(obj => obj.userId !== traveler.userId);
      this.cookieService.remove('_travelers');
      this.cookieService.put("_travelers", JSON.stringify(this._travelers));      
    }
    this.adultsCount.emit(this.counter); 
  }


  ngOnChanges(changes) {
    if (changes['traveler']) {
      console.log("this.traveler",this.travelers)
    }
  }
  
  
  ngDoCheck() {    
    this.checkUser();
    this.containers = this.containers;
    this.travelers = this.travelers;    
  }
  
  addForms(type) {
    if(type == 'adult'){
      this.showAddAdultForm = !this.showAddAdultForm;
    }  else if(type == 'child'){
      this.showAddChildForm = !this.showAddChildForm;      
    } else if(type == 'infant'){
      this.showAddInfantForm = !this.showAddInfantForm;
    }   
  }

  checkUser() {
    let userToken = localStorage.getItem('_lay_sess');
    
    if( userToken) {
      this.isLoggedIn = true;
    }
  }

  pushTraveler(event){
    this.travelers.push(event);
    this.showAddAdultForm = false;
  }
    
  getFormStatus(status){  
    this.adultFormStatus = status;
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
