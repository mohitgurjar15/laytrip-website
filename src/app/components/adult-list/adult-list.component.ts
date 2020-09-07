import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CookieService } from 'ngx-cookie';


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
  UserIds  = [];
  checked : boolean = false;
  checkBoxDesable : boolean = false;
  isLoggedIn : boolean = false;
  showAddAdultForm : boolean = false;
  adultFormStatus : boolean = false;
  count =0;
  containers = [];
  constructor(
    private cookieService: CookieService
      ) { }

  ngOnInit() {
    // this.cookie.set("nameOfCookie",'cookieValue')
    // console.log("cookie",this.cookie.getAll());
    this.checkUser();
    if(this.type == 'adult' && !this.isLoggedIn){
      this.showAddAdultForm = true;
    }
  } 

  getCookie(){
   
    console.log(this.cookieService.getAll());
  }

  checkBox(event){
   
    if(event.target.checked){
      this.UserIds.push(event.target.value); 
      this.cookieService.put("userIds", JSON.stringify(this.UserIds));
      
      if(this.counter  < this.totalTravelerCount){
        console.log(this.counter  , this.totalTravelerCount)
        this.counter++;
      } else {
        
        // this.checkBoxDesable = true;
      }
      
    } else {
      this.counter--;
      // this.checkBoxDesable = false;

      this.UserIds = this.UserIds.filter(obj => obj !== event.target.value);
      this.cookieService.remove('userIds');
      this.cookieService.put("userIds", JSON.stringify(this.UserIds));
      
    }
    console.log(this.cookieService.get('userIds'));
    this.adultsCount.emit(this.counter); 
  }


  ngOnChanges(changes) {
    if (changes['traveler']) {
      console.log("this.traveler",this.travelers)
    }
  }
  
  
  ngDoCheck() {
    
    this.containers = this.containers;
    this.travelers = this.travelers;
  }
  
  addAdultForm() {    
    this.showAddAdultForm = !this.showAddAdultForm;
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
  
  ngAfterContentChecked(){
    
  }
  getFormStatus(status){  
    this.adultFormStatus = status;
  }
}
