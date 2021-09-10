import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
declare var $: any;
import { Options } from 'ng5-slider';
import { from, Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { HotelService } from '../../../../services/hotel.service';
import { HotelSearchComponent } from '../../hotel-search/hotel-search.component';
import { translateAmenities } from '../../../../_helpers/generic.helper';

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
  searchHotel = '';
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
  distanceSlider: FormGroup = new FormGroup({
    distance: new FormControl([19])
  })
  value: number = 19;
  options: Options = {
    floor: 0,
    ceil: 19,
    showSelectionBar: true,
    selectionBarGradient: {
      from: '#FFAA00',
      to: '#FFAA00'
    }
  };
  rating_number: any = 0;

  /* Varibale for filter */
  minPrice: number;
  maxPrice: number;
  airLines = [];
  minPartialPaymentPrice: number;
  maxPartialPaymentPrice: number;
  distance = 19;
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
  filterHotelNames = [];
  hotelname;
  sortType: string = 'filter_total_price';
  lowToHighToggleRating: boolean = false;
  lowToHighToggleAmenities: boolean = false;
  is_open: boolean = false;
  translateAmenities;

  constructor(
    private eRef: ElementRef,
    private hotelService: HotelService,
    public hotelSearchComp: HotelSearchComponent,
  ) { }

  ngOnInit() {
    this.currency = JSON.parse(this._currency);
    this.translateAmenities = translateAmenities;

    if (this.hotelDetailsMain) {
      this.hotelDetailsMain.hotels.forEach(i => {
        this.hotelNamesArray.push({ hotelName: i.name });
      });
      if (this.hotelDetailsMain.filter_objects) {

        // FOR FILTER HOTEL - PRICE
        this.priceValue = this.hotelDetailsMain.filter_objects.price.min ? this.hotelDetailsMain.filter_objects.price.min : 0;
        this.priceHighValue = this.hotelDetailsMain.filter_objects.price.max ? this.hotelDetailsMain.filter_objects.price.max : 0;
        this.priceSlider.controls.price.setValue([Math.floor(this.priceValue), Math.ceil(this.priceHighValue)]);
        this.partialPaymentValue = this.hotelDetailsMain.filter_objects.secondary_price.min ? this.hotelDetailsMain.filter_objects.secondary_price.min : 0;
        this.partialPaymentHighValue = this.hotelDetailsMain.filter_objects.secondary_price.max ? this.hotelDetailsMain.filter_objects.secondary_price.max : 0;

        this.minPrice = this.priceValue;
        this.maxPrice = this.priceHighValue;

        this.priceOptions.floor = this.hotelDetailsMain.filter_objects.price.min ? this.hotelDetailsMain.filter_objects.price.min : 0;
        this.priceOptions.ceil = this.priceHighValue;//this.hotelDetailsMain.filter_objects.price.max ? this.hotelDetailsMain.filter_objects.price.max : 0;

        if (this.hotelDetailsMain.filter_objects && this.hotelDetailsMain.filter_objects.secondary_price && this.hotelDetailsMain.filter_objects.secondary_price.min && this.hotelDetailsMain.filter_objects.secondary_price.max) {
          this.partialPriceSlider.controls.partial_price.setValue([Math.floor(this.partialPaymentValue), Math.ceil(this.partialPaymentHighValue)]);

          this.partialPaymentOptions.floor = this.hotelDetailsMain.filter_objects.secondary_price.min ? this.hotelDetailsMain.filter_objects.secondary_price.min : 0;
          this.partialPaymentOptions.ceil = this.hotelDetailsMain.filter_objects.secondary_price.max;//this.hotelDetailsMain.filter_objects.price.max ? this.hotelDetailsMain.filter_objects.price.max : 0;
        }

        this.amenities = this.hotelDetailsMain.filter_objects.ameneties;
        this.ratingStar = this.hotelDetailsMain.filter_objects.ratings;
      }
    }
    this.loadJquery();
  }

  closeModal() {
    $('#filter_mob_modal').modal('hide');
  }
  clearHotelSearch() {
    this.isHotelSearch = false;
    this.hotelname = 'Search';
    $('.searchHotelName').val('');
    this.filterHotel.emit(this.hotelDetailsMain.hotels);
  }

  clickHotelFilterName(event) {
    this.isHotelSearch = false;
    $('.searchHotelName').val(event.target.textContent)
    this.searchHotel = event.target.textContent ? event.target.textContent : '';
    if (event.target.textContent) {
      this.filterHotels({ key: 'searchByHotelName', value: this.searchHotel });
    }
  }

  onBlurMethod(event){      
  }

  counter(i: any) {
    return new Array(i);
  }

  toggleFilter() {
    this.is_open = !this.is_open;
  }

  loadJquery() {
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
   * Filter By distance
   * @param event
   */
  fliterByDistance(event) {
    this.distance = event.value
    this.filterHotels({});
  }


  /**
   * Filter by hotel ratings
   * @param event 
   */
  filterByHotelRatings(event, count) {
    this.ratingArray = [];
    if (event.target.checked === true) {
      this.rating_number = parseInt(count);
      this.ratingArray.push(parseInt(count));
    } else {
      this.ratingArray = this.ratingArray.filter(item => {
        return item != count;
      });
    }
    this.filterHotels({});
  }

  starRating(rating) {
    this.ratingArray = [];
    if (this.rating_number == rating) {
      this.rating_number = 0;
      this.ratingArray = this.ratingArray.filter(item => {
        return item != rating;
      });
    }
    else {
      this.rating_number = parseInt(rating);
      this.ratingArray.push(parseInt(rating));
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
        if(item.offer_data.applicable){
          return  item.selling.discounted_total >= this.minPrice && item.selling.discounted_total <= this.maxPrice;
        }
        else{
          return item.selling.total >= this.minPrice && item.selling.total <= this.maxPrice;
        }
      })
    }
    
    /* Filter hotel, based on min & max price Payment Price*/
    if (this.minPartialPaymentPrice && this.maxPartialPaymentPrice) {
      filteredHotels = filteredHotels.filter(item => {
        if(item.offer_data.applicable){
          return item.discounted_secondary_start_price >= this.minPartialPaymentPrice && item.discounted_secondary_start_price <= this.maxPartialPaymentPrice;
        }
        else{
          return item.secondary_start_price >= this.minPartialPaymentPrice && item.secondary_start_price <= this.maxPartialPaymentPrice;
        }
      })
    }
    /* Filter Hotel, based on distance*/
    if (typeof this.distance != 'undefined' && this.distance != null) {
      filteredHotels = filteredHotels.filter(item => {
        return this.distance >= item.distance;
      })
      // console.log(filteredHotels)
    }
    /* Filter hotels ratings */
    if (this.ratingArray.length) {
      filteredHotels = filteredHotels.filter(item => {
        return this.ratingArray.includes(item.rating);
      });
      console.log('filteredHotels',filteredHotels)
    }

    /* Filter hotels amenities */
    if (this.amenitiesArray.length) {
      filteredHotels = filteredHotels.filter(item => {
        return this.amenitiesArray.every(r => item.amenities.list.includes(r));
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
        return item.name.toLowerCase().toString() == hotelname.value.trim().toLowerCase().toString();
      });
    }

    /* Filter by price total or weekly */
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
    this.hotelService.getSortFilter.subscribe(hotelInfo => {
      if (typeof hotelInfo != 'undefined' && Object.keys(hotelInfo).length > 0) {
        var sortFilter: any = hotelInfo;        
        if (sortFilter.key == 'rating') {
          filteredHotels = this.ratingSortFilter(filteredHotels, sortFilter.key, sortFilter.order);
        } else if (sortFilter.key == 'name') {
          filteredHotels = this.sortByHotelName(filteredHotels, sortFilter.key, sortFilter.order);
        } else if (sortFilter.key == 'total') {
          filteredHotels = this.sortPriceJSON(filteredHotels, sortFilter.key, sortFilter.order);
        }
      }
      console.log('filteredHotels rat',filteredHotels)
    })
    this.filterHotel.emit(filteredHotels);
  }

  resetFilter() {
    this.isResetFilter = (new Date()).toString();
    this.minPrice = this.hotelDetailsMain.filter_objects.price.min;
    this.maxPrice = this.hotelDetailsMain.filter_objects.price.max;

    this.minPartialPaymentPrice = this.hotelDetailsMain.filter_objects.secondary_price.min;
    this.maxPartialPaymentPrice = this.hotelDetailsMain.filter_objects.secondary_price.max;

    // Reset Distance
    this.distance = 19;
    this.value = 19;

    // Reset Price
    this.priceSlider.reset({ price: [Math.floor(this.hotelDetailsMain.filter_objects.price.min), Math.ceil(this.hotelDetailsMain.filter_objects.price.max)] });
    this.partialPriceSlider.reset({ partial_price: [Math.floor(this.minPartialPaymentPrice), Math.ceil(this.maxPartialPaymentPrice)] });

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
    this.hotelname = 'Search';
    this.filterHotels({});
    $('.searchHotelName').val('')
    $("input:checkbox").prop('checked', false);
  }

  toggleLowToHighRating() {
    this.lowToHighToggleRating = !this.lowToHighToggleRating;
  }

  toggleLowToHighAmenities() {
    this.lowToHighToggleAmenities = !this.lowToHighToggleAmenities;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  searchHotelName(searchValue) {
    this.isHotelSearch = true;
    var result = [];
    for (let i = 0; i < this.hotelNamesArray.length; i++) {
      if (this.hotelNamesArray[i].hotelName.toLowerCase().toString().includes(searchValue.target.value.toLowerCase())) {
        result.push(this.hotelNamesArray[i]);
      }
    }
    if (this.hotelNamesArray.length > 0 && searchValue.target.value.length > 0) {
      this.filterHotelNames = result.length > 0 ? result : [{ hotelName: 'No result!' }];
      return this.filterHotelNames;
    } else {
      if (searchValue.target.value.length <= 0) {
        this.isHotelSearch = false;
        this.hotelname = 'Search';
        this.filterHotel.emit(this.hotelDetailsMain.hotels);
        this.filterHotels({});
      } else {
        return this.filterHotelNames = [{ hotelName: 'No result!' }]
      }
    }
  }


  ratingSortFilter(filteredHotels, key, order) {
    return filteredHotels.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      if (order === 'ASC') {
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      }
      if (order === 'DESC') {
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
      }
    });
  }

  sortByHotelName(data, key, order) {
    if (typeof data === "undefined") {
      return data;
    } else {
      return data.sort(function (a, b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        if (order === 'ASC') {
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (order === 'DESC') {
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
      });
    }
  }

  sortPriceJSON(data, key, order) {
    if (typeof data === "undefined") {
      return data;
    } else {
      return data.sort(function (a, b) {
        var x = a.secondary_start_price > 0 ? a.secondary_start_price : a.selling[key];
        var y = b.secondary_start_price > 0 ? b.secondary_start_price : b.selling[key];
        if (order === 'ASC') {
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        } else if (order === 'DESC') {
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
      });
    }
  }
}
