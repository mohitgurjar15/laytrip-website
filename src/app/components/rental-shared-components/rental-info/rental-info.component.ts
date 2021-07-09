import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonFunction } from '../../../_helpers/common-function';
declare var $: any;

@Component({
  selector: 'app-rental-info',
  templateUrl: './rental-info.component.html',
  styleUrls: ['./rental-info.component.scss']
})
export class RentalInfoComponent implements OnInit {

  @Output() changeValue = new EventEmitter<any>();
  @Input() label;

  adultValue: number = 2;
  childValue: number = 0;
  totalPerson: number = 2;
  errorMessage:string='';
  countryCode:string;

  rentalInfo = {
    adult: 0,
    child: 0,
    totalPerson: 0,
    child_age:[]
  };

  childData:any = [{
    children: [],
  }];

  childAgeInfo = [];

  constructor( 
  	private route: ActivatedRoute,
    private commonFunction:CommonFunction){
    this.adultValue = parseInt(this.route.snapshot.queryParams['adult_count']) ? parseInt(this.route.snapshot.queryParams['adult_count']) : 2;
    this.childValue = parseInt(this.route.snapshot.queryParams['child']) ? parseInt(this.route.snapshot.queryParams['child']) : 0;
    this.totalPerson = this.adultValue + this.childValue;
  	  this.countryCode = this.commonFunction.getUserCountry()
    }

  ngOnInit() {
    const info = JSON.parse(localStorage.getItem('_rental'));
    if(this.childValue  == 0){
       this.childAgeInfo;
    }else{
      this.childAgeInfo=info.number_and_children_ages;
      this.childData[0].children=info.number_and_children_ages;
    }
  	this.loadJquery();
  }

  loadJquery() {
    $("body").click(function () {
  $("#rental_add_room_open").slideUp("slow");
});

$("#rental_add_room").click(function (e) {
  e.stopPropagation();
  $("#rental_add_room_open").slideToggle("slow");
});

$('#rental_add_room_open').click(
  function (e) {
    e.stopPropagation();
  }
);
   
  }

  counter(i: number) {
    return new Array(i);
  }


  btnClickForChange(item) {
    // FOR ADULT
    if (item && item.type === 'minus' && item.label === 'adult') {

      this.adultValue = this.adultValue - 1;
    } else if (item && item.type === 'plus' && item.label === 'adult') {
      if(this.adultValue+1 > 4){
        this.errorMessage="Maximum number of adult all together should not exceed 4 except.";
        return ;
      }
      else{
        this.errorMessage='';
      }
      this.adultValue = this.adultValue + 1;

    }
    // FOR CHILD
    if (item && item.type === 'minus' && item.label === 'child') {
      if(this.childValue-1  < 4){
        this.errorMessage='';
      }
      else{
        this.errorMessage="Maximum number of childs all together should not exceed 4.";
        return ;
      }
      this.childValue = this.childValue - 1;
     this.childData.forEach((oc) => {
        if (this.childValue === 0) {
          oc.children = [];
        } else {
          oc.children.pop();
        }
      });
     //Based on child no age data match
      if(this.childAgeInfo.length >this.childData[0].children.length){
       this.childAgeInfo.pop();
      }
      //Check Child

      //Check Child 
    } else if (item && item.type === 'plus' && item.label === 'child') {
      if(this.childValue+1  > 4){
        this.errorMessage="Maximum number of childs all together should not exceed 4 except.";
        return ;
      }
      else{
        this.errorMessage='';
      }
      this.childValue = this.childValue + 1;
       this.childData.forEach((oc) => {
        if (this.childValue === 0) {
          oc.children = [];
        } else {
          oc.children.push(1);
        }
      });
    }
    
    this.totalPerson = this.adultValue + this.childValue;

    this.rentalInfo = {
      adult: this.adultValue,
      child: this.childValue,
      child_age: this.childAgeInfo,
      totalPerson: this.totalPerson
    };
    this.changeValue.emit(this.rentalInfo);
  }

   changeChildAge(age,id) {
     const index=this.childAgeInfo.hasOwnProperty(id);
     if(index == true){
       this.childAgeInfo[id]=parseInt(age);
     }
     else{
       this.childAgeInfo.push(parseInt(age));
     }
  }

}
