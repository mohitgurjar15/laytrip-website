import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
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
export class FilterHotelComponent implements OnInit, OnDestroy, OnChanges {

  @Input() hotelDetailsMain: any;
  @Input() isResetFilter: string;
  @Output() filterHotel = new EventEmitter();
  depatureTimeSlot;
  arrivalTimeSlot;
  flightStops;
  airlineList;
  arrivalTimeSlotCityName;
  departureTimeSlotCityName;
  currency;
  showMinAirline: number = 4;
  airLineCount: number;
  s3BucketUrl = environment.s3BucketUrl;
  form: FormGroup;
  priceSlider: FormGroup = new FormGroup({
    price: new FormControl([20, 80])
  });
  partialPriceSlider: FormGroup = new FormGroup({
    partial_price: new FormControl([20, 80])
  });
  isShowoutbound: boolean = false;
  isShowinbound: boolean = false;

  /* Varibale for filter */
  minPrice: number;
  maxPrice: number;
  airLines = [];
  minPartialPaymentPrice: number;
  maxPartialPaymentPrice: number;
  outBoundDepartureTimeRangeSlots = [];
  outBoundArrivalTimeRangeSlots = [];
  inBoundDepartureTimeRangeSlots = [];
  inBoundArrivalTimeRangeSlots = [];
  outBoundStops = [];
  inBoundStops = [];
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

  people = [
    {
      'id': '5a15b13c36e7a7f00cf0d7cb',
      'index': 2,
      'isActive': true,
      'picture': 'http://placehold.it/32x32',
      'age': 23,
      'name': 'abc Wright',
      'gender': 'female',
      'company': 'ZOLAR',
      'email': 'karynwright@zolar.com',
      'phone': '+1 (851) 583-2547'
    },
    {
      'id': '5a15b13c2340978ec3d2c0ea',
      'index': 3,
      'isActive': false,
      'picture': 'http://placehold.it/32x32',
      'age': 35,
      'name': 'Rochelle Estes',
      'disabled': false,
      'gender': 'female',
      'company': 'EXTRAWEAR',
      'email': 'rochelleestes@extrawear.com',
      'phone': '+1 (849) 408-2029'
    },
  ];
  peopleLoading = false;

  constructor(
  ) { }

  ngOnInit() {
    this.currency = JSON.parse(this._currency);

    console.log(this.hotelDetailsMain);
    if (this.hotelDetailsMain && this.hotelDetailsMain.filter_objects) {
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
    this.loadJquery();
  }


  counter(i: any) {
    return new Array(i);
  }

  toggleOutbound() {
    this.isShowoutbound = !this.isShowoutbound;
  }

  toggleInbound() {
    this.isShowinbound = !this.isShowinbound;
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
    $(".responsive_filter_btn").click(function () {
      $("#responsive_filter_show").slideDown("slow");
      $("body").addClass('overflow-hidden');
    });

    $(".filter_close > a").click(function () {
      $("#responsive_filter_show").slideUp("slow");
      $("body").removeClass('overflow-hidden');
    });
    //Close REsponsive Fliter js
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleAirlines(type) {
    this.showMinAirline = (type === 'more') ? 500 : 4;
  }

  /**
   * Filter by price range
   * @param event 
   */
  fliterByPrice(event) {
    this.minPrice = event.value;
    this.maxPrice = event.highValue;
    this.filterHotels();
  }

  /**
   * Filter by hotel ratings
   * @param event 
   */
  filterByHotelRatings(event, count) {
    if (event.target.checked === true) {
      this.ratingArray.push(parseInt(count));
    }
    else {
      this.ratingArray = this.ratingArray.filter(item => {
        return item != count;
      })
    }
    this.filterHotels();
    console.log('this.ratingArray::', this.ratingArray);
  }

  /**
  * Filter by hotel ratings
  * @param event 
  */
  filterByHotelAmenities(event, value) {
    if (event.target.checked === true) {
      this.amenities.push(value);
    }
    else {
      this.amenities = this.amenities.filter(item => {
        return item.amenities.value !== value;
      })
    }
    this.filterHotels();
  }

  /**
  * Common function to process filtration of hotel
  */
  filterHotels() {
    let filteredHotels = this.hotelDetailsMain.hotels;
    console.log(filteredHotels.length, 'filteredHotels');
    /* Filter hotel, based on min & max price */
    if (this.minPrice && this.maxPrice) {
      filteredHotels = filteredHotels.filter(item => {
        return item.selling.total >= this.minPrice && item.selling.total <= this.maxPrice;
      })
    }

    /* Filter hotels ratings */
    if (this.ratingArray.length) {
      filteredHotels = filteredHotels.filter(item => {
        // console.log(item.rating, 'item.rating');
        return this.ratingArray.includes(item.rating);
      })
    }

    /* Filter hotels amenities */
    if (this.amenitiesArray.length) {
      filteredHotels = filteredHotels.filter(item => {
        // console.log(item);
        return this.amenitiesArray.includes(item.inbound_stop_count);
      })
    }

    console.log(filteredHotels)
    this.filterHotel.emit(filteredHotels);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes:::::::', changes);
    if (typeof changes['hotelDetailsMain'].currentValue != 'undefined') {
      if (typeof this.hotelDetailsMain != 'undefined') {
        this.hotelDetailsMain = changes['hotelDetailsMain'].currentValue;
      }
    }
    if (changes['isResetFilter']) {
      this.isResetFilter = changes['isResetFilter'].currentValue;
      this.minPrice = this.hotelDetailsMain.filter_objects.price.min;
      this.maxPrice = this.hotelDetailsMain.filter_objects.price.max;
      this.ratingArray = [];
      this.minPartialPaymentPrice = 0;
      this.maxPartialPaymentPrice = 0;
      this.outBoundDepartureTimeRangeSlots = [];
      this.outBoundArrivalTimeRangeSlots = [];
      this.inBoundDepartureTimeRangeSlots = [];
      this.inBoundArrivalTimeRangeSlots = [];
      this.outBoundStops = [];
      this.inBoundStops = [];

      //Reset Price
      this.priceSlider.reset({ price: [Math.floor(this.hotelDetailsMain.filter_objects.price.min), Math.ceil(this.hotelDetailsMain.filter_objects.price.max)] });

      //Reset partial payment
      // this.partialPriceSlider.reset({ partial_price: [Math.floor(this.hotelDetailsMain.partial_payment_price_range.min_price), Math.ceil(this.hotelDetailsMain.partial_payment_price_range.max_price)] });

      // Reset ratings
      if (typeof this.ratingArray != 'undefined' && this.ratingArray.length) {

        this.ratingArray.forEach(element => {
          return element.isChecked = false;
        });
      }

      $("input:checkbox").prop('checked', false);
      this.filterHotels();
    }
  }
}
