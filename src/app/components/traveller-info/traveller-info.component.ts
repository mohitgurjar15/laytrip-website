import { Component, OnInit, Output, EventEmitter, Input, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonFunction } from '../../_helpers/common-function';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-traveller-info',
  templateUrl: './traveller-info.component.html',
  styleUrls: ['./traveller-info.component.scss']
})
export class TravellerInfoComponent implements OnInit {

  @Output() changeValue = new EventEmitter<any>();
  @Output() currentChangeCounter = new EventEmitter();
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
  progressInterval;
  counterChangeVal=0;

  travellerInfo = {
    adult: 0,
    child: 0,
    infant: 0,
    class: 'Economy',
    totalPerson: 0,
  };
  toggle = 0;

  constructor(
    private route: ActivatedRoute,
    private commonFunction:CommonFunction,
    private eRef: ElementRef,
    private translate: TranslateService
  ) {
    this.adultValue = parseInt(this.route.snapshot.queryParams['adult']) ? parseInt(this.route.snapshot.queryParams['adult']) : 1;
    this.childValue = parseInt(this.route.snapshot.queryParams['child']) ? parseInt(this.route.snapshot.queryParams['child']) : 0;
    this.infantValue = parseInt(this.route.snapshot.queryParams['infant']) ? parseInt(this.route.snapshot.queryParams['infant']) : 0;
    this.totalPerson = this.adultValue + this.childValue + this.infantValue;
    this.class = this.route.snapshot.queryParams['class'] ? this.route.snapshot.queryParams['class'] : 'Economy';

    this.countryCode = this.commonFunction.getUserCountry()
  }

  ngOnInit() {
    this.totalPerson = this.adultValue + this.childValue + this.infantValue;
    this.setTravelerLabel();
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
      $(".add_class_sec_open_").hide();
    } else {
      this.showTraveller = false;
    }
  }

  toggleTraveller(){
    $(".add_class_sec_open_").hide();
    this.showTraveller=!this.showTraveller;
    if(this.commonFunction.isRefferal()){
      this.progressInterval = setInterval(() => {
        if(this.showTraveller){
          this.currentChangeCounter.emit(this.counterChangeVal += 1);
        } else {
          clearInterval(this.progressInterval);
        }
      }, 1000); 
    }
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
    this.setTravelerLabel();

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

  // Author: xavier | 2021/7/26
  // Description: Update traverller label using the appropiate translation key
  setTravelerLabel() {
    this.translate.
      get(this.totalPerson > 1 ? 'travelers' : 'traveler').
      subscribe((res: string) => this.travelerLabel = res);
  }
}
