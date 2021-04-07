import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import * as moment from 'moment';
import { CheckOutService } from '../../../../../services/checkout.service';
import { GenericService } from '../../../../../services/generic.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../../environments/environment';
import { AccountService } from '../../../../../services/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { travlerLabels } from 'src/app/_helpers/traveller.helper';
declare var window : any;

@Component({
  selector: 'app-booking-traveler',
  templateUrl: './booking-traveler.component.html',
  styleUrls: ['./booking-traveler.component.scss']
})
export class BookingTravelerComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() travelers : any = {};
  @Input() cartItem : any = {};
  @Input() isPassportRequired=false;
  baggageDescription: string = '';
  moduleInfo : any ={};
  countries=[];
  @Input() laytrip_cart_id='';
  closeResult = '';
  bookingId = '';
  @Output() laytripCartId = new EventEmitter();
  moduleId;
  bookingStatus;
  
  constructor(   
    private commonFunction: CommonFunction,   
    private checkOutService: CheckOutService,   
    private modalService: NgbModal,  
    private accountService: AccountService

    ) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {

    if(typeof changes['cartItem'].currentValue!='undefined'){
      this.travelers = changes['cartItem'].currentValue.travelers;          
      this.moduleInfo = changes['cartItem'].currentValue.moduleInfo;
      this.cartItem = changes['cartItem'].currentValue;
      

      this.bookingStatus = changes['cartItem'].currentValue.bookingStatus;
      this.moduleId = changes['cartItem'].currentValue.moduleId;
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

  open(content,bookingId) {
    this.bookingId = bookingId;
    this.modalService.open(content, {
      windowClass: 'delete_account_window', centered: true, backdrop: 'static',
      keyboard: false
    }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  cancelBooking(){
    // this.upCommingloadingValue.emit(true);
    this.accountService.cancelBooking(this.bookingId).subscribe((data: any) => {
      this.laytripCartId.emit(this.bookingId);
      // this.upCommingloadingValue.emit(false);
      this.modalService.dismissAll();
    }, (error: HttpErrorResponse) => {
      // this.upCommingloadingValue.emit(false);
      this.modalService.dismissAll();
    });
  }

  openChat(){
    window.fcWidget.open();
    this.modalService.dismissAll();
  }

  getUserType(traveler){

    if(typeof traveler.travelerInfo.user_type!='undefined'){
      return travlerLabels.en[traveler.travelerInfo.user_type];
    }
    else{
      let user_type='';
      let ageDiff = moment(new Date()).diff(moment(traveler.travelerInfo.dob,'MM/DD/YYYY').format('YYYY-MM-DD'),"years");
      if(ageDiff>0 && ageDiff<=2){
        user_type='infant';
      }
      if(ageDiff>2 && ageDiff<=12){
        user_type='child';
      }
      if(ageDiff>12){
        user_type='adult';
      }
      return travlerLabels.en[user_type];
    }
  }
}
