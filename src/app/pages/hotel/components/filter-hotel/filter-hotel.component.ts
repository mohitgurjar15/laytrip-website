import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, SimpleChanges, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
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
  shown = 'native';

  @ViewChild("scrollable", { static: true, read: ElementRef } as any)
  scrollbar: ElementRef;
  contentWrapper: HTMLElement;
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
  policyArray = [];

  hotelNamesArray = [];
  hotelname;
  sortType: string = 'filter_total_price';

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

  autoHeight() {
    if (!this.contentWrapper) {
      this.contentWrapper = document.querySelector(".ng-scroll-content");
    }
    if (this.scrollbar) {
      this.scrollbar.nativeElement.style.height =
        this.contentWrapper.clientHeight + "px";
    }
  }

  clearHotelSearch() {
    this.hotelname = 'Search Hotel';
    this.filterHotel.emit(this.hotelDetailsMain.hotels);
  }

  searchHotel() {
    if (this.hotelname) {
      this.filterHotels({ key: 'searchByHotelName', value: this.hotelname.hotelName });
    }
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
    if (event.target.checked === true) {
      this.ratingArray.push(parseInt(count));
    }
    else {
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
    console.log(key, name);
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
      console.log(this.amenitiesArray);
      filteredHotels = filteredHotels.filter(item => {
        return this.amenitiesArray.some(r => item.amenities.list.includes(r));
        // return this.amenitiesArray.includes(item.amenities.list);
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
    if (this.sortType === 'total') {
      filteredHotels = filteredHotels.filter(item => {
        // if (item.secondary_start_price === 0) {
        //   // return item.secondary_start_price === 0;
        // }
      });
    } else if (this.sortType === 'weekly') {
      filteredHotels = filteredHotels.filter(item => {
        // if (item.secondary_start_price > 0) {
        //   // return item.name === hotelname.value;
        // }
      });
    }
    this.filterHotel.emit(filteredHotels);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isResetFilter']) {
      console.log(changes['isResetFilter']);
      this.isResetFilter = changes['isResetFilter'].currentValue;
      this.minPrice = this.hotelDetailsMain.filter_objects.price.min;
      this.maxPrice = this.hotelDetailsMain.filter_objects.price.max;
      // Reset Price
      this.priceSlider.reset({ price: [Math.floor(this.hotelDetailsMain.filter_objects.price.min), Math.ceil(this.hotelDetailsMain.filter_objects.price.max)] });

      // Reset price by total or weekly
      this.sortType = 'filter_total_price';

      // Reset ratings
      if (this.ratingArray && this.ratingArray.length) {
        return this.ratingArray = [];
      }

      // Reset amenities
      if (this.amenitiesArray.length) {
        return this.amenitiesArray = [];
      }

      // Reset policy
      if (this.policyArray.length) {
        return this.policyArray = [];
      }

      // Reset hotel name search
      this.hotelname = 'Search Hotel';

      $("input:checkbox").prop('checked', false);
      this.filterHotels({});
    }
  }
}
