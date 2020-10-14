"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BookingFeedbackComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../environments/environment");
var BookingFeedbackComponent = /** @class */ (function () {
    function BookingFeedbackComponent(formBuilder, flightService, toastr) {
        this.formBuilder = formBuilder;
        this.flightService = flightService;
        this.toastr = toastr;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.submitted = false;
        this.is_rating = true;
        this.ratingValue = 1;
        this._rating = 'Terrible';
        this.feedbackValueChange = new core_1.EventEmitter();
    }
    BookingFeedbackComponent.prototype.ngOnInit = function () {
        this.feedbackForm = this.formBuilder.group({
            rating: [''],
            comment: ['', forms_1.Validators.required]
        });
    };
    BookingFeedbackComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.feedbackForm.invalid) {
            this.submitted = true;
            return;
        }
        else {
            var jsonData = {
                booking_id: this.bookingId,
                rating: this.ratingValue,
                message: this.feedbackForm.value.comment
            };
            this.flightService.addFeedback(jsonData).subscribe(function (data) {
                _this.feedbackValueChange.emit(true);
            }, function (error) {
                _this.toastr.error(error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
            });
        }
    };
    BookingFeedbackComponent.prototype.selectRating = function (event, rating) {
        if (rating == 'Terrible') {
            this._rating = 'Terrible';
            this.ratingValue = 1;
        }
        else if (rating == 'Bad') {
            this._rating = 'Bad';
            this.ratingValue = 2;
        }
        else if (rating == 'Okay') {
            this._rating = 'Okay';
            this.ratingValue = 3;
        }
        else if (rating == 'Good') {
            this._rating = 'Good';
            this.ratingValue = 4;
        }
        else if (rating == 'Excllent') {
            this.ratingValue = 5;
            this._rating = 'Excllent';
        }
    };
    BookingFeedbackComponent.prototype.close = function () {
        this.feedbackValueChange.emit(true);
    };
    __decorate([
        core_1.Input()
    ], BookingFeedbackComponent.prototype, "bookingId");
    __decorate([
        core_1.Output()
    ], BookingFeedbackComponent.prototype, "feedbackValueChange");
    BookingFeedbackComponent = __decorate([
        core_1.Component({
            selector: 'app-booking-feedback',
            templateUrl: './booking-feedback.component.html',
            styleUrls: ['./booking-feedback.component.scss']
        })
    ], BookingFeedbackComponent);
    return BookingFeedbackComponent;
}());
exports.BookingFeedbackComponent = BookingFeedbackComponent;
