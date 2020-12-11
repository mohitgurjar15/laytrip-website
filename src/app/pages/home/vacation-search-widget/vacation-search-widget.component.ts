import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Module } from '../../../model/module.model';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { GenericService } from '../../../services/generic.service';
import { CommonFunction } from '../../../_helpers/common-function';
import { Router } from '@angular/router';
import { VacationRentalService } from '../../../services/vacation-rental.service';

@Component({
  selector: 'app-vacation-search-widget',
  templateUrl: './vacation-search-widget.component.html',
  styleUrls: ['./vacation-search-widget.component.scss']
})
export class VacationSearchWidgetComponent implements OnInit {

 s3BucketUrl = environment.s3BucketUrl;
 rentalSearchForm: FormGroup;
 modules: Module[];
 moduleList: any = {};

 locale = {
    format: 'MM/DD/YYYY',
    displayFormat: 'MM/DD/YYYY'
  };

  rentalCheckInMinDate;
  rentalCheckoutMinDate; 
  data = [];
  loading = false;
  destination:any='';

  rentalForm:any= {
    id:'',
    type:"city",
    check_in_date:new Date(moment().add(1, 'days').format("MM/DD/YYYY")),
    check_out_date:new Date(moment().add(7, 'days').format("MM/DD/YYYY")),
    number_and_children_ages:'',
    adult_count:1,
    child:'',
  }
  totalPerson: number = 1;
  rentalSearchFormSubmitted: boolean = false;
  error_message='';
  showCommingSoon:boolean=false;
  constructor( private genericService: GenericService,
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    public router: Router,
    private rentalService: VacationRentalService,
    private renderer: Renderer2) { 

    this.rentalSearchForm = this.fb.group({   
      fromDestination: ['', [Validators.required]],
      check_in_date: [[Validators.required]],
      check_out_date: [[Validators.required]],
    });

    this.rentalCheckInMinDate = new Date();
    this.rentalCheckoutMinDate = this.rentalForm.check_in_date;
   }

  ngOnInit() {
    window.scrollTo(0, 0);
    let host = window.location.origin;
    if(host.includes("staging")){
      this.showCommingSoon=true;
    }
  }


  //Date Change
   rentalDateUpdate(date) {
    this.rentalForm.check_out_date = new Date(date)
    this.rentalCheckoutMinDate = new Date(date)
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

  //OnSerch Vacation Rental Data

   searchByRental(searchItem) {
    this.loading = true;
    this.rentalService.searchRentalData(searchItem).subscribe((response: any) => {
      console.log(response);
      this.data = response.map(res => {

        console.log(res);
        this.loading = false;
        return {
          id: res.id,
          display_name: res.display_name,
          type: res.type,
          city: res.city,
          country: res.country,
        };
      });
    },
      error => {
        this.loading = false;
      }
    );
  }

  onChangeSearch(event) {
    if (event.term.length > 2) {
      this.searchByRental(event.term);
    }
  }

   selectEvent(event) {
    this.destination=event;
    console.log(this.destination);
  }

  onRemove(event) {
    this.rentalForm.id='';
  }

  //Changes Rental Info
  changeRentalInfo(event){
    this.rentalForm.adult_count = event.adult;
    this.rentalForm.child = event.child;
    //this.rentalForm.number_and_children_ages = event.child_age[0].children;
    this.rentalForm.number_and_children_ages = event.child_age;
    this.totalPerson = event.totalPerson;
  }

  //Start search Vacation rentals function
  searchRentals(formData){
    this.error_message='';
    this.rentalSearchFormSubmitted = true;
    if(this.rentalSearchForm.invalid) 
    {
        return;
    }
    else if(formData.child !=''){
      if(formData.number_and_children_ages.length !== formData.child){
        this.error_message='please select child age';
        return ;
    }
   }
    let queryParams: any = {};
    queryParams.id=formData.id;
    queryParams.type=formData.type;
    queryParams.check_in_date=(moment(formData.check_in_date).format('YYYY-MM-DD'));
    queryParams.check_out_date=(moment(formData.check_out_date).format('YYYY-MM-DD'));
    queryParams.adult_count=formData.adult_count;
    queryParams.child=formData.child;
    queryParams.number_and_children_ages=formData.number_and_children_ages;
    queryParams.city=this.destination.city;
    queryParams.display_name=this.destination.display_name;
    queryParams.country=this.destination.country;
    console.log(queryParams);
    localStorage.setItem('_rental', JSON.stringify(queryParams));
      this.router.navigate(['vacation-rental/search'], {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });
  }
  //End search Vacation rentals function
}
