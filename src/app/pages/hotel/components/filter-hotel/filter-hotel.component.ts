import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
declare var $: any;
import { Options } from 'ng5-slider';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { environment } from '../../../../../environments/environment';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-filter-hotel',
  templateUrl: './filter-hotel.component.html',
  styleUrls: ['./filter-hotel.component.scss']
})
export class FilterHotelComponent implements OnInit, OnDestroy {

  compact = false;
  invertX = false;
  invertY = false;
  isHotelSearch = false;
  shown = 'native';

  @ViewChild("scrollable", { static: true, read: ElementRef } as any)
  scrollbar: ElementRef;
  contentWrapper: HTMLElement;
  @Input() hotelDetailsMain: any;
  @Input() isResetFilter: string;
  @Output() filterHotel = new EventEmitter();
  currency;
  s3BucketUrl = environment.s3BucketUrl;
  form: FormGroup;
  priceSlider: FormGroup = new FormGroup({
    price: new FormControl([20, 80])
  });
  partialPriceSlider: FormGroup = new FormGroup({
    partial_price: new FormControl([20, 80])
  });

  /* Varibale for filter */
  minPrice: number;
  maxPrice: number;
  airLines = [];
  minPartialPaymentPrice: number;
  maxPartialPaymentPrice: number;
  /* End of filter variable */

  // tslint:disable-next-line: variable-name
  _currency = localStorage.getItem('_curr');

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

  partialPaymentValue = 0;
  partialPaymentHighValue = 0;
  partialPaymentOptions: Options = {
    floor: 0,
    ceil: 0,
    step: 1,
    translate: (value: number): any => {
      const currency = JSON.parse(this._currency);
      return `${currency.symbol}${value}`;
    }
  };

  subscriptions: Subscription[] = [];
  ratingStar = [];
  amenities = [];
  ratingArray = [];
  amenitiesArray = [];
  policyArray = [];

  hotelNamesArray = [];
  hotelname;
  sortType: string = 'filter_total_price';
  lowToHighToggleRating: boolean = false;
  lowToHighToggleAmenities: boolean = false;
  is_open: boolean = false;

  constructor(
  ) { }

  ngOnInit() {
    this.currency = JSON.parse(this._currency);

    if (this.hotelDetailsMain) {
      this.hotelDetailsMain.hotels.forEach(i => {
        this.hotelNamesArray.push({ hotelName: i.name });
      });
      if (this.hotelDetailsMain.filter_objects) {

        // FOR FILTER HOTEL - PRICE
        this.priceValue = this.hotelDetailsMain.filter_objects.price.min ? this.hotelDetailsMain.filter_objects.price.min : 0;
        this.priceHighValue = this.hotelDetailsMain.filter_objects.price.max ? this.hotelDetailsMain.filter_objects.price.max : 0;
        this.priceSlider.controls.price.setValue([Math.floor(this.priceValue), Math.ceil(this.priceHighValue)]);

        this.minPrice = this.priceValue;
        this.maxPrice = this.priceHighValue;

        this.priceOptions.floor = this.hotelDetailsMain.filter_objects.price.min ? this.hotelDetailsMain.filter_objects.price.min : 0;
        this.priceOptions.ceil = this.hotelDetailsMain.filter_objects.price.max ? this.hotelDetailsMain.filter_objects.price.max : 0;

        if (this.hotelDetailsMain.filter_objects && this.hotelDetailsMain.filter_objects.secondary_price && this.hotelDetailsMain.filter_objects.secondary_price.min && this.hotelDetailsMain.filter_objects.secondary_price.max) {
          this.priceValue = this.hotelDetailsMain.filter_objects.secondary_price.min ? this.hotelDetailsMain.filter_objects.secondary_price.min : 0;
          this.priceHighValue = this.hotelDetailsMain.filter_objects.secondary_price.max ? this.hotelDetailsMain.filter_objects.secondary_price.max : 0;
          this.priceSlider.controls.price.setValue([Math.floor(this.priceValue), Math.ceil(this.priceHighValue)]);

          this.priceOptions.floor = this.hotelDetailsMain.filter_objects.price.min ? this.hotelDetailsMain.filter_objects.price.min : 0;
          this.priceOptions.ceil = this.hotelDetailsMain.filter_objects.price.max ? this.hotelDetailsMain.filter_objects.price.max : 0;
        }

        this.amenities = this.hotelDetailsMain.filter_objects.ameneties;
        this.ratingStar = this.hotelDetailsMain.filter_objects.ratings;
      }
    }
    this.loadJquery();
  }

  clearHotelSearch() {
    this.hotelname = 'Search Hotel';
    this.filterHotel.emit(this.hotelDetailsMain.hotels);
  }

  searchHotel(event) {
    /* if (event.target.textContent) {
      this.filterHotels({ key: 'searchByHotelName', value: event.target.textContent });
    } */

    if (this.hotelname) {
      this.filterHotels({ key: 'searchByHotelName', value: this.hotelname.hotelName });
    }
  }

  counter(i: any) {
    return new Array(i);
  }

  toggleFilter() {
    this.is_open = !this.is_open;
  }

  loadJquery() {
    //Start REsponsive Fliter js
    $(".responsive_filter_btn").click(function () {
      $("#responsive_filter_show").slideDown("slow");
      $("body").addClass('overflow-hidden');
    });

    $(".filter_close > a").click(function () {
      $("#responsive_filter_show").slideUp("slow");
      $("body").removeClass('overflow-hidden');
    });
    //Close REsponsive Fliter js

    // Start filter Shortby js
    $(document).on('show', '#accordion3', function (e) {
      $(e.target).prev('.accordion-heading').addClass('accordion-opened');
    });

    $(document).on('hide', '#accordion3', function (e) {
      $(this).find('.accordion-heading').not($(e.target)).removeClass('accordion-opened');
    });
  }

  /**
   * Filter by price range
   * @param event 
   */
  fliterByPrice(event) {
    this.minPrice = event.value;
    this.maxPrice = event.highValue;
    this.filterHotels({});
  }

  fliterByPartialPayment(event) {
    this.minPartialPaymentPrice = event.value;
    this.maxPartialPaymentPrice = event.highValue;
    this.filterHotels({});
  }

  /**
   * Filter by hotel ratings
   * @param event 
   */
  filterByHotelRatings(event, count) {
    console.log(event.target.checked,count)
    if (event.target.checked === true) {
      this.ratingArray.push(parseInt(count));
    } else {
      this.ratingArray = this.ratingArray.filter(item => {
        return item != count;
      })
    }
    this.filterHotels({});
  }

  /**
  * Filter by hotel amenities
  * @param event 
  */
  filterByHotelAmenities(event, value) {
    
    if (event.target.checked === true) {
      this.amenitiesArray.push(value);
    }
    else {
      this.amenitiesArray = this.amenitiesArray.filter(item => {
        return item !== value;
      });
    }
    this.filterHotels({});
  }

  /**
  * Filter by hotel policy
  * @param event 
  */
  filterByPolicy(event) {
    if (event.target.checked === true) {
      this.policyArray.push(event.target.value);
    } else {
      this.policyArray = this.policyArray.filter(item => {
        return item !== event.target.value;
      });
    }
    this.filterHotels({});
  }

  /**
   * Filter by price total or weekly
   * @param event 
   */
  filterHotelByPrice(key, name) {
    if (key === 'total') {
      this.sortType = name;
    } else if (key === 'weekly') {
      this.sortType = name;
    }
    this.filterHotels({});
  }

  /**
  * Common function to process filtration of hotel
  */
  filterHotels(hotelname) {
    let filteredHotels = this.hotelDetailsMain.hotels;
    /* Filter hotel, based on min & max price */
    if (this.minPrice && this.maxPrice) {
      filteredHotels = filteredHotels.filter(item => {
        return item.selling.total >= this.minPrice && item.selling.total <= this.maxPrice;
      })
    }

    /* Filter hotels ratings */
    if (this.ratingArray.length) {
      filteredHotels = filteredHotels.filter(item => {
        return this.ratingArray.includes(item.rating);
      });
    }

    /* Filter hotels amenities */
    if (this.amenitiesArray.length) {
      filteredHotels = filteredHotels.filter(item => {
        return this.amenitiesArray.some(r => item.amenities.list.includes(r));
      })
    }

    /* Filter hotels policy */
    if (this.policyArray.length) {
      filteredHotels = filteredHotels.filter(item => {
        return this.policyArray.includes(item.refundable);
      })
    }

    /* Search hotels by name */
    if (hotelname && hotelname.key === 'searchByHotelName') {
      filteredHotels = filteredHotels.filter(item => {
        return item.name === hotelname.value;
      });
    }

    /* Filter by price total or weekly */
    console.log(this.sortType)
    if (this.sortType === 'total') {
      filteredHotels = filteredHotels.filter(item => {
        if (item.secondary_start_price === 0) {
          return item.secondary_start_price === 0;
        }
      });
    } else if (this.sortType === 'weekly') {
      filteredHotels = filteredHotels.filter(item => {
        if (item.secondary_start_price > 0) {
          return item.name === hotelname.value;
        }
      });
    }
    this.filterHotel.emit(filteredHotels);
  }

  resetFilter() {
    this.isResetFilter = (new Date()).toString();
    this.minPrice = this.hotelDetailsMain.filter_objects.price.min;
    this.maxPrice = this.hotelDetailsMain.filter_objects.price.max;

    // Reset Price
    this.priceSlider.reset({ price: [Math.floor(this.hotelDetailsMain.filter_objects.price.min), Math.ceil(this.hotelDetailsMain.filter_objects.price.max)] });

    // Reset price by total or weekly
    this.sortType = 'filter_total_price';

    // Reset ratings
    if (this.ratingArray && this.ratingArray.length) {
      this.ratingArray = [];
      this.filterHotels({});
    }

    // Reset amenities
    if (this.amenitiesArray && this.amenitiesArray.length) {
      this.amenitiesArray = [];
      this.filterHotels({});
    }

    // Reset policy
    if (this.policyArray && this.policyArray.length) {
      this.policyArray = [];
      this.filterHotels({});
    }

    // Reset hotel name search
    this.hotelname = 'Search Hotel';

    $("input:checkbox").prop('checked', false);
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['isResetFilter']) {
  //     this.isResetFilter = changes['isResetFilter'].currentValue;
  //     this.minPrice = this.hotelDetailsMain.filter_objects.price.min;
  //     this.maxPrice = this.hotelDetailsMain.filter_objects.price.max;
  //     // Reset Price
  //     this.priceSlider.reset({ price: [Math.floor(this.hotelDetailsMain.filter_objects.price.min), Math.ceil(this.hotelDetailsMain.filter_objects.price.max)] });

  //     // Reset price by total or weekly
  //     this.sortType = 'filter_total_price';

  //     // Reset ratings
  //     if (this.ratingArray && this.ratingArray.length) {
  //       this.ratingArray = [];
  //       this.filterHotels({});
  //     }

  //     // Reset amenities
  //     if (this.amenitiesArray && this.amenitiesArray.length) {
  //       this.amenitiesArray = [];
  //       this.filterHotels({});
  //     }

  //     // Reset policy
  //     if (this.policyArray && this.policyArray.length) {
  //       this.policyArray = [];
  //       this.filterHotels({});
  //     }

  //     // Reset hotel name search
  //     this.hotelname = 'Search Hotel';

  //     $("input:checkbox").prop('checked', false);
  //   }
  // }

  toggleLowToHighRating() {
    this.lowToHighToggleRating = !this.lowToHighToggleRating;
  }

  toggleLowToHighAmenities() {
    this.lowToHighToggleAmenities = !this.lowToHighToggleAmenities;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  searchHotelName(text){
    // var family = this.hotelNamesArray.filter(f => f.name.indexOf(text.code) > -1);
    // console.log(family)
    this.isHotelSearch = true;
    // this.hotelNamesArray = this.hotelNamesArray;
  }
}
