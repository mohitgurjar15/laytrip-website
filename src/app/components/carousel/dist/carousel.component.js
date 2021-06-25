"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CarouselComponent = void 0;
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
var CarouselComponent = /** @class */ (function () {
    function CarouselComponent(homeService) {
        this.homeService = homeService;
        this.currentChangeCounter = 0;
        this.activeSlide = new core_1.EventEmitter();
        this.previousChangeCounter = 0;
        this.currentSlide = 0;
        this.activityWatcher();
    }
    CarouselComponent.prototype.onPreviousClick = function () {
        var previous = this.currentSlide - 1;
        this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
        var slide = "#slide_" + this.currentSlide;
        $(document).ready(function () {
            $(slide).attr('src', $(slide).attr('data'));
            $(slide).removeAttr('data');
        });
        this.activeSlide.emit(this.currentSlide);
    };
    CarouselComponent.prototype.onNextClick = function () {
        var next = this.currentSlide + 1;
        this.currentSlide = next === this.slides.length ? 0 : next;
        var slide = "#slide_" + this.currentSlide;
        $(document).ready(function () {
            $(slide).attr('src', $(slide).attr('data'));
            $(slide).removeAttr('data');
        });
        this.activeSlide.emit(this.currentSlide);
    };
    CarouselComponent.prototype.activityWatcher = function () {
        var secondsSinceLastActivity = 0;
        var maxInactivity = 4;
        var self = this;
        setInterval(function () {
            if (self.currentChangeCounter != self.previousChangeCounter) {
                secondsSinceLastActivity = 0;
                self.previousChangeCounter = self.currentChangeCounter;
                return;
            }
            secondsSinceLastActivity++;
            if (secondsSinceLastActivity > maxInactivity) {
                self.onNextClick();
                secondsSinceLastActivity = 0;
            }
        }, 1000);
        var activityEvents = [];
        //register the activity function as the listener parameter.
        activityEvents.forEach(function (eventName) {
            document.addEventListener(eventName, function () {
                secondsSinceLastActivity = 0;
            }, true);
        });
    };
    CarouselComponent.prototype.ngOnChanges = function (change) {
        if (typeof change['currentChangeCounter'].currentValue != 'undefined') {
            this.currentChangeCounter = change['currentChangeCounter'].currentValue;
            this.previousChangeCounter = change['currentChangeCounter'].previousValue;
        }
    };
    CarouselComponent.prototype.booletsClick = function (isCurrentSlideClick, currentSlide, i) {
        if (isCurrentSlideClick) {
            return;
        }
        else if (currentSlide > i) {
            console.log('less');
            this.onPreviousClick();
        }
        else if (currentSlide < i) {
            console.log('greater');
            this.onNextClick();
        }
    };
    __decorate([
        core_1.Input()
    ], CarouselComponent.prototype, "slides");
    __decorate([
        core_1.Input()
    ], CarouselComponent.prototype, "currentChangeCounter");
    __decorate([
        core_1.Output()
    ], CarouselComponent.prototype, "activeSlide");
    CarouselComponent = __decorate([
        core_1.Component({
            selector: 'carousel',
            templateUrl: './carousel.component.html',
            styleUrls: ['./carousel.component.scss'],
            animations: [
                animations_1.trigger('carouselAnimation', [
                    animations_1.transition('void => *', [
                        animations_1.style({ opacity: 0 }),
                        animations_1.animate('300ms', animations_1.style({ opacity: 1 }))
                    ]),
                    animations_1.transition('* => void', [
                        animations_1.animate('300ms', animations_1.style({ opacity: 0 }))
                    ])
                ])
            ]
        })
    ], CarouselComponent);
    return CarouselComponent;
}());
exports.CarouselComponent = CarouselComponent;
