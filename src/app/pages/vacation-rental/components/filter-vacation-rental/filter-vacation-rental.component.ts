import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, SimpleChanges, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
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
export class FilterVacationRentalComponent implements OnInit, OnDestroy {

  compact = false;
  invertX = false;
  invertY = false;
  shown = 'native';

  @ViewChild("scrollable", { static: true, read: ElementRef } as any)
  scrollbar: ElementRef;
  contentWrapper: HTMLElement;

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
  lowToHighToggleAmenities: boolean = false;
  is_open: boolean = false;

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
    this.loadJquery();

  }

  loadJquery() {
    //Start REsponsive Fliter js
    $(window).on("scroll", function () {
      if ($(window).width() < 1200) {
        if ($(this).scrollTop() < 10) {
          $('#responsive_filter').slideUp("slow");
        }

        if ($(this).scrollTop() > 10) {
          $('#responsive_filter').slideDown("slow");
        }

        var scrollHeight = $(document).height();
        var scrollPosition = $(window).height() + $(window).scrollTop();
        if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
          $('#responsive_filter').slideUp("slow");
        }
      } else {
        $('#responsive_filter').hide("slow");
      }
    });
    var sheight = $(window).scrollTop();
    var swidth = $(window).width();
    if (sheight > 10 && swidth < 991) {
      $('#responsive_filter').slideDown("slow");
    }
    /* $(".responsive_filter_btn").click(function () {
      $("#responsive_filter_show").slideDown("slow");
      $("body").addClass('overflow-hidden');
    });

    $(".filter_close > a").click(function () {
      $("#responsive_filter_show").slideUp("slow");
      $("body").removeClass('overflow-hidden');
    }); */
    //Close REsponsive Fliter js

    // Start filter Shortby js
    $(document).on('show', '#accordion-filteredtby', function (e) {
      $(e.target).prev('.accordion-heading').addClass('accordion-opened');
    });

    $(document).on('hide', '#accordion-filteredtby', function (e) {
      $(this).find('.accordion-heading').not($(e.target)).removeClass('accordion-opened');
    });
  }

  toggleFilter() {
    this.is_open = !this.is_open;
  }

  toggleLowToHighAmenities() {
    this.lowToHighToggleAmenities = !this.lowToHighToggleAmenities;
  }


  clearRentalSearch() {
    if (this.rentalname !== 'Search Home') {
      this.rentalname = 'Search Home';
      this.filterRental.emit(this.rentalFilterDetails.items);
    }
  }

  searchRental() {
    if (this.rentalname !== 'Search Home') {
      this.filterRentals({ key: 'searchByRental', value: this.rentalname.rentalName });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  filterRentalByPrice(key, name) {
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
    if (event.target.checked === true) {
      this.amenitiesArray.push(value);
    }
    else {
      this.amenitiesArray = this.amenitiesArray.filter(item => {
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
        return this.amenitiesArray.some(r => item.amenities.includes(r));
        // filteredRentals = filteredRentals.filter(item => {
        //   return this.amenitiesArray.includes(item);
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


  resetFilter() {
    this.minPrice = this.rentalFilterDetails.price_range.min_price;
    this.maxPrice = this.rentalFilterDetails.price_range.max_price;

    // Reset Price
    this.priceSlider.reset({ price: [Math.floor(this.rentalFilterDetails.price_range.min_price), Math.ceil(this.rentalFilterDetails.price_range.max_price)] });

    // Reset price by total or weekly
    this.sortType = 'filter_total_price';

    // Reset amenities
    // if (typeof this.amenities != 'undefined' && this.amenities.length) {
    //   this.amenities.forEach(element => {
    //     return element.isChecked = false;
    //   });
    // }
    if (this.amenitiesArray.length) {
      return this.amenitiesArray = [];
    }

    // Reset hotel name search
    this.rentalname = 'Search Home';

    $("input:checkbox").prop('checked', false);
    this.filterRentals({});
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
      // if (typeof this.amenities != 'undefined' && this.amenities.length) {
      //   this.amenities.forEach(element => {
      //     return element.isChecked = false;
      //   });
      // }
      if (this.amenitiesArray.length) {
        return this.amenitiesArray = [];
      }

      // Reset hotel name search
      this.rentalname = 'Search Home';

      $("input:checkbox").prop('checked', false);
      this.filterRentals({});
    }
  }

}
