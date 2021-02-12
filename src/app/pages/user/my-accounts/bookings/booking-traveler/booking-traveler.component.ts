import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';

@Component({
  selector: 'app-booking-traveler',
  templateUrl: './booking-traveler.component.html',
  styleUrls: ['./booking-traveler.component.scss']
})
export class BookingTravelerComponent implements OnInit {

  @Input() travelers={};
  baggageDescription: string = '';
  moduleInfo={};

  constructor(    private commonFunction: CommonFunction
    ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {

    if(typeof changes['travelers'].currentValue!='undefined'){
      this.travelers = changes['travelers'].currentValue.travelers;
      this.moduleInfo = changes['travelers'].currentValue.moduleInfo;
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
}
