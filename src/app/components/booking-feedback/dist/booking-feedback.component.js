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
    function BookingFeedbackComponent(formBuilder, flightService) {
        this.formBuilder = formBuilder;
        this.flightService = flightService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.submitted = false;
        this.is_rating = false;
        this._rating = '';
    }
    BookingFeedbackComponent.prototype.ngOnInit = function () {
        this.feedbackForm = this.formBuilder.group({
            rating: [''],
            comment: ['', forms_1.Validators.required]
        });
    };
    BookingFeedbackComponent.prototype.onSubmit = function () {
        if (this.feedbackForm.invalid) {
            this.submitted = true;
            return;
        }
        else {
            var jsonData = {
                booking_id: 22323,
                rating: 5,
                message: this.feedbackForm.value.comment
            };
            this.flightService.addFeedback(jsonData).subscribe(function (data) {
            }, function (error) {
            });
        }
    };
    BookingFeedbackComponent.prototype.selectRating = function (event, rating) {
        this._rating = '';
        this.is_rating = false;
        if (rating == 'B') {
            this._rating = 'B';
        }
        else if (rating == 'G') {
            this._rating = 'G';
        }
        else if (rating == 'E') {
            this._rating = 'E';
        }
        else {
            this.is_rating = false;
            this._rating = '';
        }
        this.is_rating = true;
    };
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
