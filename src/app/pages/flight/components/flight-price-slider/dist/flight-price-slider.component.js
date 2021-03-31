"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightPriceSliderComponent = void 0;
var core_1 = require("@angular/core");
var moment = require("moment");
var FlightPriceSliderComponent = /** @class */ (function () {
    function FlightPriceSliderComponent(commonFunction, route) {
        this.commonFunction = commonFunction;
        this.route = route;
        this.flexibleNotFound = false;
        this.flexibleLoading = true;
        this.dates = [];
        this.departureDate = this.route.snapshot.queryParams['departure_date'];
        this.departureDate = this.commonFunction.convertDateFormat(this.departureDate, 'YYYY-MM-DD');
        this.trip = this.route.snapshot.queryParams['trip'];
        if (this.trip == 'roundtrip') {
            this.arrivalDate = this.route.snapshot.queryParams['arrival_date'];
            this.arrivalDate = this.commonFunction.convertDateFormat(this.arrivalDate, 'YYYY-MM-DD');
        }
        this.departure = this.route.snapshot.queryParams['departure'];
        this.arrival = this.route.snapshot.queryParams['arrival'];
        this["class"] = this.route.snapshot.queryParams['class'];
        this.adult = this.route.snapshot.queryParams['adult'];
        this.child = this.route.snapshot.queryParams['child'];
        this.infant = this.route.snapshot.queryParams['infant'];
    }
    FlightPriceSliderComponent.prototype.ngOnInit = function () {
        this.loadJquery();
    };
    FlightPriceSliderComponent.prototype.loadJquery = function () {
        console.log('here');
        // Start Flight Price By Day slider js
        console.log('before', this.flexibleLoading);
        if (this.dates.length > 0 && !this.flexibleLoading) {
            console.log('after', this.flexibleLoading);
            var count = this.dates.length;
            $('.price_day_slider').slick({
                dots: false,
                infinite: true,
                speed: 300,
                slidesToShow: count >= 7 ? 7 : count,
                slidesToScroll: 1,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: count >= 6 ? 6 : count,
                            slidesToScroll: 1,
                            infinite: true,
                            dots: false
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: count >= 3 ? 3 : count,
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: count >= 1 ? 3 : count,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
            // Close Flight Price By Day slider js
        }
    };
    FlightPriceSliderComponent.prototype.ngOnChanges = function (changes) {
        if (changes['dates'].currentValue.length) {
            // setTimeout(()=>{this.loadJquery();},100)
            /* if(this.trip == 'oneway'){
              this.flipDates(this.dates)
            }
            else{
              if(window.screen.width<=600){
                let targetIndex=2;
                this.dates = this.arrayRotate(this.dates,targetIndex);
                console.log("this.dates",this.dates)
              }
            } */
            this.flipDates(this.dates);
        }
    };
    FlightPriceSliderComponent.prototype.flipDates = function (dates) {
        var _this = this;
        var result = [];
        var sourceIndex = dates.findIndex(function (date) { return moment(date.date, "DD/MM/YYYY").format("YYYY-MM-DD") === _this.route.snapshot.queryParams['departure_date']; });
        var targetIndex = 3;
        if (window.screen.width <= 600) {
            targetIndex = 1;
            /* targetIndex=dates.length-sourceIndex+1;
            this.dates = this.rotateArray1(dates,targetIndex) */
        }
        var startIndex = sourceIndex - targetIndex;
        for (var i = startIndex; i < dates.length; i++) {
            result.push(dates[i]);
        }
        for (var i = 0; i < startIndex; i++) {
            result.push(dates[i]);
        }
        this.dates = result;
        /* else{
          this.dates = this.arrayRotate(this.dates,targetIndex);
        } */
        /* if(targetIndex > sourceIndex){
    
          targetIndex=5;
          for(let i=targetIndex; i < this.dates.length; i++){
            result.push(this.dates[i])
          }
          for(let i=0; i < targetIndex; i++){
            result.push(this.dates[i])
          }
    
        }
        else{
    
          for(let i=targetIndex; i <= sourceIndex; i++){
            
            result.push(this.dates[i])
          }
          
          for(let i=sourceIndex+1; i < this.dates.length; i++){
            result.push(this.dates[i])
          }
          
          for(let i=0; i < targetIndex; i++){
            result.push(this.dates[i])
          }
    
          
        }
        this.dates = result; */
    };
    FlightPriceSliderComponent.prototype.rotateArray1 = function (dates, k) {
        for (var i = 0; i < k; i++) {
            dates.unshift(dates.pop());
        }
        return dates;
    };
    FlightPriceSliderComponent.prototype.arrayRotate = function (arr, count) {
        count -= arr.length * Math.floor(count / arr.length);
        arr.push.apply(arr, arr.splice(0, count));
        return arr;
    };
    FlightPriceSliderComponent.prototype.getPrice = function (item) {
        var price;
        if (item.secondary_start_price > 0) {
            if (item.secondary_start_price < 5) {
                price = '5.00';
            }
            else {
                price = item.secondary_start_price;
            }
        }
        else {
            price = item.price;
        }
        return price;
    };
    FlightPriceSliderComponent.prototype.getFlexibleArivalDate = function (date) {
        var startDate = moment(this.departureDate, 'MMM DD, YYYY');
        var endDate = moment(this.arrivalDate, 'MMM DD, YYYY');
        var intervalDay = endDate.diff(startDate, 'days');
        var arrivalDate = moment(date, "DD/MM/YYYY").add(intervalDay, 'days');
        return this.commonFunction.convertDateFormat(arrivalDate, "DD/MM/YYYY");
    };
    FlightPriceSliderComponent.prototype.checkDateValidation = function (date) {
        var juneDate = moment('2021-06-01').format('YYYY-MM-DD');
        var selectedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
        if (selectedDate < juneDate) {
            return true;
        }
        else {
            return false;
        }
    };
    __decorate([
        core_1.Input()
    ], FlightPriceSliderComponent.prototype, "flexibleLoading");
    __decorate([
        core_1.Input()
    ], FlightPriceSliderComponent.prototype, "dates");
    FlightPriceSliderComponent = __decorate([
        core_1.Component({
            selector: 'app-flight-price-slider',
            templateUrl: './flight-price-slider.component.html',
            styleUrls: ['./flight-price-slider.component.scss']
        })
    ], FlightPriceSliderComponent);
    return FlightPriceSliderComponent;
}());
exports.FlightPriceSliderComponent = FlightPriceSliderComponent;
