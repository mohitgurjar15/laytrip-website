import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import * as moment from 'moment';
import { CheckOutService } from 'src/app/services/checkout.service';
import { GenericService } from 'src/app/services/generic.service';

@Component({
  selector: 'app-booking-traveler',
  templateUrl: './booking-traveler.component.html',
  styleUrls: ['./booking-traveler.component.scss']
})
export class BookingTravelerComponent implements OnInit {

  @Input() travelers : any = {};
  @Input() isPassportRequired=false;
  baggageDescription: string = '';
  moduleInfo : any ={};
  countries=[];

  constructor(   
    private commonFunction: CommonFunction,   
    private checkOutService: CheckOutService,   
    private genericService: GenericService,   

    ) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {

    if(typeof changes['travelers'].currentValue!='undefined'){
      this.travelers = changes['travelers'].currentValue.travelers;          
console.log(changes['travelers'].currentValue)
      this.moduleInfo = changes['travelers'].currentValue.moduleInfo;
      if(this.travelers.length > 0){
        this.travelers[0].is_passport_required = this.moduleInfo[0].is_passport_required ? this.moduleInfo[0].is_passport_required : false;  
      }      
    }
    
    
  }

  formatBaggageDescription(cabbinBaggage, checkInBaggage) {
    let cabbinBaggageWight;
    let checkInBaggageWight;
    let description = '';
    if (typeof(cabbinBaggage) != 'undefined' && cabbinBaggage != "" && cabbinBaggage.includes("KG") == true) {
      cabbinBaggageWight = this.convertKgToLB(cabbinBaggage.replace("KG", ""))
      description = `Cabin bag upto ${cabbinBaggageWight} lbs (${cabbinBaggage})`;
    }
    else if (typeof(cabbinBaggage) != 'undefined' && cabbinBaggage != '') {
      description = `Cabin bag upto ${cabbinBaggage}`;
    }

    if (typeof(checkInBaggage) != 'undefined' && checkInBaggage != "" && checkInBaggage.includes("KG") == true) {
      checkInBaggageWight = this.convertKgToLB(checkInBaggage.replace("KG", ""))
      if (description != '') {
        description += ` and checkin bag upto ${checkInBaggageWight} lbs (${checkInBaggage})`;
      }
      else {
        description += `checkin bag upto ${checkInBaggageWight} lbs (${checkInBaggage})`;

      }
    }
    else if (typeof(checkInBaggage) != 'undefined' &&  checkInBaggage != '') {
      if (description != '') {
        description += ` and checkin bag upto ${checkInBaggage}`;
      }
      else {
        description += `checkin bag upto ${checkInBaggage}`;
      }
    }

    return description;
  }

  convertKgToLB(weight) {
    return (2.20462 * Number(weight)).toFixed(2);
  }

  getGender(type){
    if(type=='M')
    return 'Male';
    else if(type=='F')
      return 'Female';
    else 
      return 'Other';
  }

  checkIsChild(dob){
    // console.log(dob);
    var adult12YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
    var child2YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
    var travellerDob = moment(dob).format('YYYY-MM-DD');
    if(travellerDob  <  adult12YrPastDate){ 
      return true;
    } else if(travellerDob < child2YrPastDate) {
      return false;      
    } else {
      return false;
    }
  }
  getPhoneNoInMaskFormat(phNum,countryCode){
    return countryCode+' '+phNum.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

  getContryName(id){
    this.checkOutService.getCountries.subscribe(res => {
      this.countries = res;
    });
    var countryObj = this.countries.filter(item => item.id == id );
    return countryObj[0].name ? countryObj[0].name : '';
  }
}
