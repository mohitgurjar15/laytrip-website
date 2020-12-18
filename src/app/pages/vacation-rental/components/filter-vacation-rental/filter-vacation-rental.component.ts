import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, SimpleChanges, OnChanges, SimpleChange } from '@angular/core';
declare var $: any;
import { Options } from 'ng5-slider';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { environment } from '../../../../../environments/environment';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter-vacation-rental',
  templateUrl: './filter-vacation-rental.component.html',
  styleUrls: ['./filter-vacation-rental.component.scss']
})
export class FilterVacationRentalComponent implements OnInit,OnDestroy {

  @Input() rentalFilterDetails: any;
  @Input() isResetFilter: string;
  @Output() filterRental = new EventEmitter();
  sortType: string = 'filter_total_price';

  minPrice: number;
  maxPrice: number;
  _currency = localStorage.getItem('_curr');
  amenitiesArray = [];
  form: FormGroup;
  priceSlider: FormGroup = new FormGroup({
    price: new FormControl([20, 80])
  });
  priceValue = 0;
  priceHighValue = 0;
  priceOptions: Options = {
    floor: 0,
    ceil: 0,
    step: 1,
    translate: (value: number): any => {
      const currency = JSON.parse(this._currency);
      return `${currency.symbol}${value}`;
    }
  };
  amenities = [];
  homeData = [];
  rentalname;
  currency;
  subscriptions: Subscription[] = [];

  constructor() { }

  ngOnInit() {
  	this.currency = JSON.parse(this._currency);

  	 if (this.rentalFilterDetails) {
      this.rentalFilterDetails.items.forEach(i => {
        this.homeData.push({ rentalName: i.property_name });
      });
      if (this.rentalFilterDetails) {

        // FOR FILTER- PRICE
        this.priceValue = this.rentalFilterDetails.price_range.min_price ? this.rentalFilterDetails.price_range.min_price : 0;
        this.priceHighValue = this.rentalFilterDetails.price_range.max_price ? this.rentalFilterDetails.price_range.max_price : 0;
        this.priceSlider.controls.price.setValue([Math.floor(this.priceValue), Math.ceil(this.priceHighValue)]);

        this.minPrice = this.priceValue;
        this.maxPrice = this.priceHighValue;

        this.priceOptions.floor = this.rentalFilterDetails.price_range.min_price ? this.rentalFilterDetails.price_range.min_price : 0;
        this.priceOptions.ceil = this.rentalFilterDetails.price_range.max_price ? this.rentalFilterDetails.price_range.max_price : 0;

        if (this.rentalFilterDetails && this.rentalFilterDetails.partial_payment_price_range && this.rentalFilterDetails.partial_payment_price_range.min_price && this.rentalFilterDetails.partial_payment_price_range.min_price) {
          this.priceValue = this.rentalFilterDetails.partial_payment_price_range.min_price ? this.rentalFilterDetails.partial_payment_price_range.min_price : 0;
          this.priceHighValue = this.rentalFilterDetails.partial_payment_price_range.max_price ? this.rentalFilterDetails.partial_payment_price_range.max_price : 0;
          this.priceSlider.controls.price.setValue([Math.floor(this.priceValue), Math.ceil(this.priceHighValue)]);

          this.priceOptions.floor = this.rentalFilterDetails.price_range.min_price ? this.rentalFilterDetails.price_range.min_price : 0;
          this.priceOptions.ceil = this.rentalFilterDetails.price_range.max_price ? this.rentalFilterDetails.price_range.max_price : 0;
        }

        this.amenities = this.rentalFilterDetails.amenties;
      }
    }

  }


   clearRentalSearch() {
    this.rentalname = 'Search Home';
    this.filterRental.emit(this.rentalFilterDetails.items);
  }

  searchRental() {
    if (this.rentalname) {
      this.filterRentals({ key: 'searchByRental', value: this.rentalname.rentalName });
    }
  }

   ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

   filterRentalByPrice(key, name) {
    console.log(key, name);
    if (key === 'total') {
      this.sortType = name;
    } else if (key === 'weekly') {
      this.sortType = name;
    }
    this.filterRentals({});
  }

  fliterByPrice(event) {
    this.minPrice = event.value;
    this.maxPrice = event.highValue;
    this.filterRentals({});
  }

   filterByAmenities(event, value) {
     console.log(event);
     console.log(value);
    if (event.target.checked === true) {
      this.amenities.push(value);
    }
    else {
      this.amenities = this.amenities.filter(item => {
        return item !== value;
      });
    }
    this.filterRentals({});
  }


  filterRentals(rentalname) {
    let filteredRentals = this.rentalFilterDetails.items;
    /* Filter hotel, based on min & max price */
    if (this.minPrice && this.maxPrice) {
      filteredRentals = filteredRentals.filter(item => {
        return item.selling_price >= this.minPrice && item.selling_price <= this.maxPrice;
      })
    }

    /* Filter hotels amenities */
    if (this.amenitiesArray.length) {
      filteredRentals = filteredRentals.filter(item => {
        return this.amenitiesArray.includes(item);
      })
    }

    /* Search hotels by name */
    if (rentalname && rentalname.key === 'searchByRental') {
      filteredRentals = filteredRentals.filter(item => {
        return item.property_name === rentalname.value;
      });
    }

    /* Filter by price total or weekly */
    if (this.sortType === 'total') {
      filteredRentals = filteredRentals.filter(item => {
        
      });
    } else if (this.sortType === 'weekly') {
      filteredRentals = filteredRentals.filter(item => {
      
      });
    }
    this.filterRental.emit(filteredRentals);
  }

  

   ngOnChanges(changes: SimpleChanges) {
    if (changes['isResetFilter']) {
      this.isResetFilter = changes['isResetFilter'].currentValue;
      this.minPrice = this.rentalFilterDetails.price_range.min_price;
      this.maxPrice = this.rentalFilterDetails.price_range.max_price;

      // Reset Price
      this.priceSlider.reset({ price: [Math.floor(this.rentalFilterDetails.price_range.min_price), Math.ceil(this.rentalFilterDetails.price_range.max_price)] });

      // Reset price by total or weekly
      this.sortType = 'filter_total_price';

      // Reset amenities
      if (typeof this.amenities != 'undefined' && this.amenities.length) {
        this.amenities.forEach(element => {
          return element.isChecked = false;
        });
      }

      // Reset hotel name search
      this.rentalname = 'Search Home';

      $("input:checkbox").prop('checked', false);
      this.filterRentals({});
    }
  }

}
