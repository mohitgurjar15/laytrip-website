"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VacationSearchWidgetComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../../environments/environment");
var moment = require("moment");
var VacationSearchWidgetComponent = /** @class */ (function () {
    function VacationSearchWidgetComponent(genericService, commonFunction, fb, router, route, rentalService) {
        this.genericService = genericService;
        this.commonFunction = commonFunction;
        this.fb = fb;
        this.router = router;
        this.route = route;
        this.rentalService = rentalService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.moduleList = {};
        this.data = [];
        this.loading = false;
        this.destination = '';
        this.rentalForm = {
            id: '',
            name: '',
            type: "city",
            check_in_date: new Date(moment().add(1, 'days').format("MM/DD/YYYY")),
            check_out_date: new Date(moment().add(7, 'days').format("MM/DD/YYYY")),
            number_and_children_ages: [],
            adult_count: 2,
            child: ''
        };
        this.fromDestinationInfo = {
            id: 19492,
            country: 'Spain',
            city: 'Barcelona',
            display_name: 'Barcelona,Spain',
            type: 'city'
        };
        this.totalPerson = 2;
        this.rentalSearchFormSubmitted = false;
        this.error_message = '';
        this.showCommingSoon = false;
        this.searchedValue = [];
        this.rentalSearchForm = this.fb.group({
            fromDestination: ['', [forms_1.Validators.required]]
        });
        this.rentalCheckInMinDate = new Date();
        this.rentalCheckoutMinDate = this.rentalForm.check_in_date;
        this.rangeDates = [this.rentalForm.check_in_date, this.rentalForm.check_out_date];
    }
    VacationSearchWidgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scrollTo(0, 0);
        var host = window.location.origin;
        if (host.includes("staging")) {
            this.showCommingSoon = true;
        }
        this.route.queryParams.subscribe(function (params) {
            if (Object.keys(params).length > 0) {
                var info = JSON.parse(localStorage.getItem('_rental'));
                _this.searchedValue = [];
                _this.rentalForm.city = params.city;
                _this.rentalForm.country = params.country;
                _this.rentalForm.id = params.id;
                _this.rentalForm.name = info.display_name;
                _this.rentalForm.display_name = params.display_name;
                _this.rentalForm.type = params.type;
                _this.rentalForm.adult_count = info.adult_count,
                    _this.rentalForm.child = info.child,
                    _this.rentalForm.number_and_children_ages = info.number_and_children_ages;
                _this.rentalForm.check_in_date = new Date(info.check_in_date);
                _this.rentalForm.check_out_date = new Date(info.check_out_date);
                _this.rangeDates = [_this.rentalForm.check_in_date, _this.rentalForm.check_out_date];
                //Changes
                _this.fromDestinationInfo.city = params.city;
                _this.fromDestinationInfo.country = params.country;
                _this.fromDestinationInfo.id = params.id;
                _this.fromDestinationInfo.display_name = params.display_name;
                _this.fromDestinationInfo.type = params.type;
                _this.searchedValue.push({ key: 'fromSearch1', value: _this.fromDestinationInfo });
            }
            else {
                _this.searchedValue = [];
                //if(this.fromDestinationInfo){
                _this.rentalForm.city = _this.fromDestinationInfo.city;
                _this.rentalForm.country = _this.fromDestinationInfo.country;
                _this.rentalForm.id = _this.fromDestinationInfo.id;
                _this.rentalForm.display_name = _this.fromDestinationInfo.display_name;
                _this.rentalForm.type = _this.fromDestinationInfo.type;
                _this.searchedValue.push({ key: 'fromSearch1', value: _this.fromDestinationInfo });
            }
        });
    };
    //Date Change
    VacationSearchWidgetComponent.prototype.rentalDateUpdate = function (date) {
        //this.rentalForm.check_out_date = new Date(date)
        //this.rentalCheckoutMinDate = new Date(date)
        if (this.rangeDates[1]) { // If second date is selected
            this.dateFilter.hideOverlay();
        }
        ;
        if (this.rangeDates[0] && this.rangeDates[1]) {
            this.rentalCheckInMinDate = new Date();
            this.rentalForm.check_in_date = this.rangeDates[0];
            this.rentalForm.check_out_date = this.rangeDates[1];
        }
    };
    VacationSearchWidgetComponent.prototype.dateChange = function (type, direction) {
        if (type == 'checkIn') {
            if (direction === 'previous') {
                if (moment(this.rentalForm.check_in_date).isAfter(moment(new Date()))) {
                    this.rentalForm.check_in_date = new Date(moment(this.rentalForm.check_in_date).subtract(1, 'days').format('MM/DD/YYYY'));
                }
            }
            else {
                this.rentalForm.check_in_date = new Date(moment(this.rentalForm.check_in_date).add(1, 'days').format('MM/DD/YYYY'));
                if (moment(this.rentalForm.check_in_date).isAfter(this.rentalForm.check_out_date)) {
                    this.rentalForm.check_out_date = new Date(moment(this.rentalForm.check_out_date).add(1, 'days').format('MM/DD/YYYY'));
                }
            }
            this.rentalCheckInMinDate = new Date(this.rentalForm.check_in_date);
        }
        if (type == 'checkOut') {
            if (direction === 'previous') {
                if (moment(this.rentalForm.check_in_date).isBefore(this.rentalForm.check_out_date)) {
                    this.rentalForm.check_out_date = new Date(moment(this.rentalForm.check_out_date).subtract(1, 'days').format('MM/DD/YYYY'));
                }
            }
            else {
                this.rentalForm.check_out_date = new Date(moment(this.rentalForm.check_out_date).add(1, 'days').format('MM/DD/YYYY'));
            }
        }
    };
    //OnSerch Vacation Rental Data
    VacationSearchWidgetComponent.prototype.searchByRental = function (searchItem) {
        var _this = this;
        this.loading = true;
        this.rentalService.searchRentalData(searchItem).subscribe(function (response) {
            _this.data = response.map(function (res) {
                _this.loading = false;
                return {
                    id: res.id,
                    display_name: res.display_name,
                    type: res.type,
                    city: res.city,
                    country: res.country
                };
            });
        }, function (error) {
            _this.loading = false;
        });
    };
    VacationSearchWidgetComponent.prototype.onChangeSearch = function (event) {
        if (event.term.length > 2) {
            this.searchByRental(event.term);
        }
    };
    VacationSearchWidgetComponent.prototype.selectEvent = function (event) {
        this.destination = event;
    };
    VacationSearchWidgetComponent.prototype.onRemove = function (event) {
        this.rentalForm.id = '';
    };
    //Changes Rental Info
    VacationSearchWidgetComponent.prototype.changeRentalInfo = function (event) {
        this.rentalForm.adult_count = event.adult;
        this.rentalForm.child = event.child;
        //this.rentalForm.number_and_children_ages = event.child_age[0].children;
        this.rentalForm.number_and_children_ages = event.child_age;
        this.totalPerson = event.totalPerson;
    };
    VacationSearchWidgetComponent.prototype.destinationChangedValue = function (event) {
        if (event && event.key && event.key === 'fromSearch1') {
            this.searchedValue[0]['value'] = event.value;
            this.fromDestinationTitle = event.value.display_name;
            this.rentalForm.city = event.value.city;
            this.rentalForm.country = event.value.country;
            this.rentalForm.id = event.value.id;
            this.rentalForm.name = event.value.display_name;
            this.rentalForm.display_name = event.value.display_name;
            this.rentalForm.type = event.value.type;
        }
    };
    //Start search Vacation rentals function
    VacationSearchWidgetComponent.prototype.searchRentals = function (formData) {
        var _this = this;
        this.error_message = '';
        this.rentalSearchFormSubmitted = true;
        if (this.rentalSearchForm.invalid) {
            return;
        }
        else if (formData.child != '') {
            if (formData.number_and_children_ages.length !== formData.child) {
                this.error_message = 'please select child age';
                return;
            }
        }
        var queryParams = {};
        queryParams.type = formData.type;
        queryParams.check_in_date = (moment(formData.check_in_date).format('YYYY-MM-DD'));
        queryParams.check_out_date = (moment(formData.check_out_date).format('YYYY-MM-DD'));
        queryParams.adult_count = formData.adult_count;
        queryParams.id = formData.id;
        queryParams.name = this.rentalForm.display_name;
        queryParams.child = formData.child;
        queryParams.number_and_children_ages = formData.number_and_children_ages;
        queryParams.city = this.rentalForm.city;
        queryParams.display_name = this.rentalForm.display_name;
        queryParams.country = this.rentalForm.country;
        localStorage.setItem('_rental', JSON.stringify(queryParams));
        // this.router.navigate(['vacation-rental/search'], {
        //   queryParams: queryParams,
        //   queryParamsHandling: 'merge'
        // });
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
            _this.router.navigate(['vacation-rental/search'], { queryParams: queryParams, queryParamsHandling: 'merge' });
        });
    };
    __decorate([
        core_1.ViewChild('dateFilter', undefined)
    ], VacationSearchWidgetComponent.prototype, "dateFilter");
    VacationSearchWidgetComponent = __decorate([
        core_1.Component({
            selector: 'app-vacation-search-widget',
            templateUrl: './vacation-search-widget.component.html',
            styleUrls: ['./vacation-search-widget.component.scss']
        })
    ], VacationSearchWidgetComponent);
    return VacationSearchWidgetComponent;
}());
exports.VacationSearchWidgetComponent = VacationSearchWidgetComponent;
