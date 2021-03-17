import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonFunction } from '../../_helpers/common-function';
declare var $: any;

@Component({
  selector: 'app-traveller-info',
  templateUrl: './traveller-info.component.html',
  styleUrls: ['./traveller-info.component.scss']
})
export class TravellerInfoComponent implements OnInit {

  @Output() changeValue = new EventEmitter<any>();
  @Input() label;
  @Input() domid;

  adultValue: number = 1;
  childValue: number = 0;
  infantValue: number = 0;
  totalPerson: number = 1;
  travelerLabel = 'Traveler'
  class = 'Economy';
  errorMessage:string='';
  countryCode:string;
  showTraveller:boolean=false;

  travellerInfo = {
    adult: 0,
    child: 0,
    infant: 0,
    class: 'Economy',
    totalPerson: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private commonFunction:CommonFunction
  ) {
    this.adultValue = parseInt(this.route.snapshot.queryParams['adult']) ? parseInt(this.route.snapshot.queryParams['adult']) : 1;
    this.childValue = parseInt(this.route.snapshot.queryParams['child']) ? parseInt(this.route.snapshot.queryParams['child']) : 0;
    this.infantValue = parseInt(this.route.snapshot.queryParams['infant']) ? parseInt(this.route.snapshot.queryParams['infant']) : 0;
    this.totalPerson = this.adultValue + this.childValue + this.infantValue;
    this.class = this.route.snapshot.queryParams['class'] ? this.route.snapshot.queryParams['class'] : 'Economy';

    this.countryCode = this.commonFunction.getUserCountry()
  }

  ngOnInit() {
    this.loadJquery();
    this.totalPerson = this.adultValue + this.childValue + this.infantValue;
    this.travelerLabel = this.totalPerson > 1 ? 'Travelers' : 'Traveler';
  }
  toggle = 0;

  loadJquery() {
    $("body").click(function () {
      $(".add_traveler__open").hide();
    });

    $(".add_traveler_").click(function (e) {
        e.stopPropagation();
        if((e.target.nextSibling != null && e.target.nextSibling.classList[2] == 'panel_hide') || 
        (e.target.offsetParent.nextSibling != null && e.target.offsetParent.nextSibling.classList[2] == 'panel_hide')
        ) {          
          $(".add_traveler__open").hide();
        } else {
          $(".add_traveler__open").show();          
        /*   if(e.target.offsetParent.nextSibling != null && e.target.offsetParent.nextSibling.classList[2] == 'panel_hide'){            
            $(".add_traveler__open").hide();
          }  else {
            $(".add_traveler__open").show();          
          } */ 
        }
      $(".add_class_sec_open_").hide();
    });

    $('.add_traveler__open').click(
      function (e) {
        e.stopPropagation();
      }
    );

  }


  toggleTraveller(){
    this.showTraveller=!this.showTraveller;
  }

  btnClickForChange(item) {
    // FOR ADULT
    if (item && item.type === 'minus' && item.label === 'adult') {
      if(this.adultValue === this.infantValue){
        this.infantValue = this.infantValue - 1;
      }
      if(this.adultValue-1 < this.infantValue){
        this.errorMessage="Infant count should be less than Adults.";
        return false;
      }
      else{
        this.errorMessage='';
      }
      
      this.adultValue = this.adultValue - 1;
    } else if (item && item.type === 'plus' && item.label === 'adult') {
      if(this.adultValue+1 + this.childValue  > 9){
        this.errorMessage="Maximum number of passengers all together should not exceed 9 except infants.";
        return ;
      }
      else{
        this.errorMessage='';
      }
      this.adultValue = this.adultValue + 1;

    }
    // FOR CHILD
    if (item && item.type === 'minus' && item.label === 'child') {
      if(this.adultValue + this.childValue-1  < 9){
        this.errorMessage='';
      }
      else{
        this.errorMessage="Maximum number of passengers all together should not exceed 9 except infants.";
        return ;
      }
      this.childValue = this.childValue - 1;
    } else if (item && item.type === 'plus' && item.label === 'child') {
      if(this.adultValue + this.childValue+1  > 9){
        this.errorMessage="Maximum number of passengers all together should not exceed 9 except infants.";
        return ;
      }
      else{
        this.errorMessage='';
      }
      this.childValue = this.childValue + 1;
    }
    // FOR INFANT
    if (item && item.type === 'minus' && item.label === 'infant') {
      
      this.infantValue = this.infantValue - 1;
      if(this.infantValue < this.adultValue){
        this.errorMessage='';
      }
    } else if (item && item.type === 'plus' && item.label === 'infant') {

      if(this.infantValue+1 > this.adultValue){
        this.errorMessage="Infant count should be less than Adults.";
        return false;
      }
      else{
        this.errorMessage='';
      }
      this.infantValue = this.infantValue + 1;
    }

    
    this.totalPerson = this.adultValue + this.childValue + this.infantValue;
    this.travelerLabel = this.totalPerson > 1 ? 'Travelers' : 'Traveler';

    if (item && item.type === 'class' && item.value) {
      this.travellerInfo.class = item.value;
      this.class = item.value;
    }

    this.travellerInfo = {
      adult: this.adultValue,
      child: this.childValue,
      infant: this.infantValue,
      class: this.travellerInfo.class,
      totalPerson: this.totalPerson
    };
    this.changeValue.emit(this.travellerInfo);
  }
}
