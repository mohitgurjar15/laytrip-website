import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Input, SimpleChanges } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CommonFunction } from '../../../../_helpers/common-function';
import { VacationRentalService } from '../../../../services/vacation-rental.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vacation-rental-search-bar',
  templateUrl: './vacation-rental-search-bar.component.html',
  styleUrls: ['./vacation-rental-search-bar.component.scss']
})
export class VacationRentalSearchBarComponent implements OnInit {
  
  @Output() searchBarInfo = new EventEmitter<any>();
  s3BucketUrl = environment.s3BucketUrl;
  rentalSearchForm: FormGroup;
  countryCode:string='';

  rentalForm:any= {
    id:'',
    type:"city",
    check_in_date:new Date(moment().add(1, 'days').format("MM/DD/YYYY")),
    check_out_date:new Date(moment().add(1, 'days').format("MM/DD/YYYY")),
    number_and_children_ages:'',
    adult_count:1,
    child:'',
  }
  totalPerson: number = 1;
  rentalCheckInMinDate;
  rentalCheckoutMinDate;
  destination:any='';
  data:any=[];
  defaultData:any;
  constructor( public fb: FormBuilder,
    private rentalService: VacationRentalService,
    public commonFunction: CommonFunction,
    public cd: ChangeDetectorRef,
    private route: ActivatedRoute) { 

  	
    this.rentalSearchForm = this.fb.group({   
      fromDestination: ['', [Validators.required]],
      check_in_date: [[Validators.required]],
      check_out_date: [[Validators.required]],
    });
  }

  ngOnInit() {
    const info = JSON.parse(localStorage.getItem('_rental'));
    console.log(info);
    this.data=[{
          id: info.id,
          display_name: info.display_name,
          type: info.type,
          city: info.city,
          country: info.country,
    }];
    this.defaultData=info.display_name;
    console.log(this.data);
    // this.rentalForm.id = this.route.snapshot.queryParams['id'];
    // //this.rentalForm.check_in_date= this.route.snapshot.queryParams['check_in_date'];
    // this.rentalForm.check_in_date=this.commonFunction.convertDateFormat(this.route.snapshot.queryParams['check_in_date'], 'YYYY-MM-DD');
    // this.rentalForm.check_out_date= this.commonFunction.convertDateFormat(this.route.snapshot.queryParams['check_out_date'], 'YYYY-MM-DD');
    // this.rentalForm.number_and_children_ages= this.route.snapshot.queryParams['number_and_children_ages'];
    // this.rentalForm.child= this.route.snapshot.queryParams['child'];
    // this.rentalForm.adult_count= this.route.snapshot.queryParams['adult_count'];
    // this.data=[{id: 19, type: "city", display_name: "Barcelona,Spain", city: "Barcelona", country: "Spain"}];
    // console.log(this.rentalForm);
  }


  rentalDateUpdate(date) {
    this.rentalForm.check_out_date = new Date(date)
    this.rentalCheckoutMinDate = new Date(date)
  }

   changeRentalInfo(event){
    this.rentalForm.adult_count = event.adult;
    this.rentalForm.child = event.child;
    //this.rentalForm.number_and_children_ages = event.child_age[0].children;
    this.rentalForm.number_and_children_ages = event.child_age;
    this.totalPerson = event.totalPerson;
  }

    onChangeSearch(event) {
    if (event.term.length > 2) {
      //this.searchByRental(event.term);
    }
  }

   selectEvent(event) {
    this.destination=event;
    console.log(this.destination);
  }

  onRemove(event) {
    this.rentalForm.id='';
  }

  dateChange(type, direction) {

     if (type == 'checkIn') {
      if (direction === 'previous') {
        if (moment(this.rentalForm.check_in_date).isAfter(moment(new Date()))) {
          this.rentalForm.check_in_date = new Date(moment(this.rentalForm.check_in_date).subtract(1, 'days').format('MM/DD/YYYY'))
        }
      }

      else {
        this.rentalForm.check_in_date = new Date(moment(this.rentalForm.check_in_date).add(1, 'days').format('MM/DD/YYYY'))
        if (moment(this.rentalForm.check_in_date).isAfter(this.rentalForm.check_out_date)) {
          this.rentalForm.check_out_date = new Date(moment(this.rentalForm.check_out_date).add(1, 'days').format('MM/DD/YYYY'))
        }
      }
      this.rentalCheckInMinDate = new Date(this.rentalForm.check_in_date)
    }

    if (type == 'checkOut') {

      if (direction === 'previous') {
        if (moment(this.rentalForm.check_in_date).isBefore(this.rentalForm.check_out_date)) {
          this.rentalForm.check_out_date = new Date(moment(this.rentalForm.check_out_date).subtract(1, 'days').format('MM/DD/YYYY'))
        }
      }
      else {
        this.rentalForm.check_out_date = new Date(moment(this.rentalForm.check_out_date).add(1, 'days').format('MM/DD/YYYY'))
      }
    }

  }


}
