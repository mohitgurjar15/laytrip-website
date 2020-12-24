import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Input, SimpleChanges,ViewChild } from '@angular/core';
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

  @ViewChild('dateFilter', undefined) private dateFilter: any;
  @Output() searchBarInfo = new EventEmitter<any>();
  @Input() calenderPrices:any=[];
  s3BucketUrl = environment.s3BucketUrl;
  rentalSearchForm: FormGroup;
  countryCode:string='';
  loading = false;
  error_message='';
  rentalForm:any= {
    id:'',
    type:"",
    check_in_date:new Date(moment().add(1, 'days').format("MM/DD/YYYY")),
    check_out_date:new Date(moment().add(1, 'days').format("MM/DD/YYYY")),
    number_and_children_ages:undefined,
    adult_count:undefined,
    child:undefined,
  }
  rangeDates: Date[];
  totalPerson: number = 1;
  rentalCheckInMinDate;
  rentalCheckoutMinDate;
  destination:any='';
  data:any=[];
  defaultData:any;
  defaultCity:'';
  defaultCountry:'';
  rentalDefaultDestValue;
  destinationRental: any = {};
  placeHolder:'Barcelona';
  defaultSelected:any='Barcelona';
  itemIconArray = {
    hotel: `${this.s3BucketUrl}assets/images/hotels/hotel.svg`,
    city: `${this.s3BucketUrl}assets/images/hotels/city.svg`,
  };
  constructor( public fb: FormBuilder,
    private rentalService: VacationRentalService,
    public commonFunction: CommonFunction,
    public cd: ChangeDetectorRef,
    private route: ActivatedRoute) { 

  	
    this.rentalSearchForm = this.fb.group({   
      fromDestination: ['', [Validators.required]],
      //check_in_date: [[Validators.required]],
      //check_out_date: [[Validators.required]],
    });
  }

  ngOnInit() {
    const info = JSON.parse(localStorage.getItem('_rental'));
    console.log(info);

    this.data=[{
          id: info.id,
          title: info.display_name,
          type: info.type,
          city: info.city,
          country: info.country,
          adult_count: info.adult_count,
          child: info.child,
          number_and_children_ages: info.number_and_children_ages,
    }];
     this.defaultCity    = info.city;
     this.defaultCountry = info.country;
      
    console.log(this.data);
    this.rentalForm.check_in_date=new Date(info.check_in_date); 
    this.rentalForm.check_out_date=new Date(info.check_out_date);   
    this.rangeDates = [this.rentalForm.check_in_date, this.rentalForm.check_out_date];

  }



  rentalDateUpdate(date) {
    // this.rentalForm.check_out_date = new Date(date)
    // this.rentalCheckoutMinDate = new Date(date)
     if (this.rangeDates[1]) { // If second date is selected
      this.dateFilter.hideOverlay();
    };
    if (this.rangeDates[0] && this.rangeDates[1]) {
      this.rentalCheckInMinDate = this.rangeDates[0];
      this.rentalForm.check_in_date  = this.rentalCheckInMinDate;
      this.rentalForm.check_out_date = this.rangeDates[1];
      
   }
  }

   changeRentalInfo(event){
     console.log(event);
    this.rentalForm.adult_count = event.adult;
    this.rentalForm.child = event.child;
    //this.rentalForm.number_and_children_ages = event.child_age[0].children;
    this.rentalForm.number_and_children_ages = event.child_age;
    this.totalPerson = event.totalPerson;
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

   searchByRental(searchItem) {
    this.loading = true;
    this.rentalService.searchRentalData(searchItem).subscribe((response: any) => {
      console.log(response);
      this.data = response.map(res => {

        console.log(res);
        this.loading = false;
        return {
          id: res.id,
          title: res.display_name,
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
     console.log(event);
     if (!event) {
      this.placeHolder = this.placeHolder;
      this.defaultSelected = this.defaultSelected;
    }
    this.defaultSelected = '';
    this.defaultCity = '';
    this.defaultCountry = '';
    this.defaultSelected = event;
    this.defaultCity =this.defaultSelected.city;
    this.defaultCountry =this.defaultSelected.country;
  }

  onRemove(event) {
    //if (item.key === 'fromSearch1') {
      this.defaultCity = Object.create(null);
    //}
  }

  searchRentals(formData){
    this.error_message='';
    formData.id=this.defaultSelected.id == undefined ? this.data[0].id:this.defaultSelected.id;
    formData.city=this.defaultSelected.city == undefined ? this.data[0].id:this.defaultSelected.city;
    formData.country=this.defaultSelected.country == undefined ? this.data[0].id:this.defaultSelected.country;
    formData.display_name=this.defaultSelected.title == undefined ? this.data[0].id:this.defaultSelected.title;
    formData.type=this.defaultSelected.type == undefined ? this.data[0].type:this.defaultSelected.type;
    formData.check_in_date=moment(formData.check_in_date).format("YYYY-MM-DD");
    formData.check_out_date=moment(formData.check_out_date).format("YYYY-MM-DD");
    formData.adult_count=this.rentalForm.adult_count == undefined ? this.data[0].adult_count:this.rentalForm.adult_count;
    formData.child=this.rentalForm.child == undefined ? this.data[0].child:this.rentalForm.child;
    formData.number_and_children_ages=formData.number_and_children_ages == undefined ? this.data[0].number_and_children_ages:formData.number_and_children_ages;
    console.log(formData);
    if(formData.child !== "")
    {
      if(formData.number_and_children_ages.length !== formData.child)
      {
        this.error_message='please select child age';
        return;
      }
    }
    console.log(formData);
    //return false;
    localStorage.setItem('_rental', JSON.stringify(formData));
    this.searchBarInfo.emit(formData);
  }


}
