"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdultListComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var AdultListComponent = /** @class */ (function () {
    function AdultListComponent(cookieService, genericService, router, cd) {
        this.cookieService = cookieService;
        this.genericService = genericService;
        this.router = router;
        this.cd = cd;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.adultsCount = new core_1.EventEmitter();
        this._itinerarySelectionArray = new core_1.EventEmitter();
        this.travelers = [];
        this._adults = [];
        this._childs = [];
        this._infants = [];
        this.counter = 0;
        this.adultCounter = 0;
        this.childCounter = 0;
        this.infantCounter = 0;
        this.totalTravelerCount = 0;
        this._travelers = [];
        this._selectedId = [];
        this.loader = true;
        this.checked = false;
        this.loading = true;
        this.checkBoxDisable = false;
        this.isLoggedIn = false;
        this.showAddAdultForm = false;
        this.showAddChildForm = false;
        this.showAddInfantForm = false;
        this.adultFormStatus = false;
        this.infantCollapse = false;
        this.childCollapse = false;
        this.adultCollapse = false;
        this.count = 0;
        this.random = 0;
        this._itinerary = [];
        this.countries = [];
        this.countries_code = [];
        this.containers = [];
        this._itinerarySelection = {
            adult: [],
            child: [],
            infant: []
        };
        this.totalAdult = 0;
        this.countChild = 0;
    }
    AdultListComponent.prototype.ngOnInit = function () {
        this.checkUser();
        this.getCountry();
        var _itinerary = sessionStorage.getItem('_itinerary');
        try {
            this._itinerary = _itinerary ? JSON.parse(_itinerary) : this._itinerary;
        }
        catch (e) { }
        if (this.type == 'adult' && !this.isLoggedIn) {
            this.showAddAdultForm = true;
        }
    };
    AdultListComponent.prototype.selectItinerary = function (event, traveler) {
        var totalAdult = Number(this._itinerary.adult);
        var totalChild = Number(this._itinerary.child);
        var totalInfant = Number(this._itinerary.infant);
        if (this._itinerary) {
            if (event.target.checked) {
                var travelerData = {
                    "userId": traveler.userId,
                    "firstName": traveler.firstName,
                    "lastName": traveler.lastName,
                    "email": traveler.email
                };
                this._travelers.push(travelerData);
                this.cookieService.put("_travelers", JSON.stringify(this._travelers));
                console.log(this.childCounter + 1, totalChild);
                if (this.adultCounter + 1 < totalAdult && traveler.user_type == 'adult') {
                    this.adultCounter++;
                    // this.checkBoxDisable = false;
                }
                else {
                    if (this.adultCounter + 1 == totalAdult && traveler.user_type == 'adult') {
                        this.adultCounter++;
                        // this.checkBoxDisable = true;                
                    }
                }
                if (this.childCounter + 1 < totalChild && traveler.user_type == 'child') {
                    this.childCounter++;
                    // this.checkBoxDisable = false;
                }
                else {
                    if (this.childCounter + 1 == totalChild && traveler.user_type == 'child') {
                        this.childCounter++;
                        // this.checkBoxDisable = true;                
                    }
                }
                if (this.infantCounter + 1 < totalInfant && traveler.user_type == 'infant') {
                    this.infantCounter++;
                }
                else {
                    if (this.infantCounter + 1 == totalInfant && traveler.user_type == 'infant') {
                        this.infantCounter++;
                    }
                }
                if (traveler.user_type == 'adult') {
                    this._itinerarySelection.adult.push(traveler.userId);
                }
                else if (traveler.user_type == 'child') {
                    this._itinerarySelection.child.push(traveler.userId);
                }
                else if (traveler.user_type == 'infant') {
                    this._itinerarySelection.infant.push(traveler.userId);
                }
            }
            else {
                // this.checkBoxDisable = false;
                this._travelers = this._travelers.filter(function (obj) { return obj.userId !== traveler.userId; });
                this.cookieService.remove('_travelers');
                this.cookieService.put("_travelers", JSON.stringify(this._travelers));
                if (traveler.user_type == 'adult') {
                    if (this.adultCounter >= totalAdult || this.adultCounter <= totalAdult) {
                        this.adultCounter--;
                    }
                    this._itinerarySelection.adult = this._itinerarySelection.adult.filter(function (obj) { return obj !== traveler.userId; });
                }
                else if (traveler.user_type == 'child') {
                    if (this.childCounter >= totalChild || this.childCounter <= totalChild) {
                        this.childCounter--;
                    }
                    this._itinerarySelection.child = this._itinerarySelection.child.filter(function (obj) { return obj !== traveler.userId; });
                }
                else if (traveler.user_type == 'infant') {
                    if (this.infantCounter >= totalInfant || this.infantCounter <= totalInfant) {
                        this.infantCounter--;
                    }
                    this._itinerarySelection.child = this._itinerarySelection.infant.filter(function (obj) { return obj !== traveler.userId; });
                }
            }
        }
        this._itinerarySelectionArray.emit(this._itinerarySelection);
    };
    AdultListComponent.prototype.getRandomNumber = function (i) {
        var random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    };
    AdultListComponent.prototype.ngOnChanges = function (changes) {
        if (changes['traveler']) {
            this.travelers = this.travelers;
        }
    };
    AdultListComponent.prototype.ngDoCheck = function () {
        this.checkUser();
        this.containers = this.containers;
        if (this.travelers.length >= 0) {
            this.loader = false;
        }
    };
    AdultListComponent.prototype.addForms = function (type) {
        if (type == 'adult') {
            this.showAddAdultForm = !this.showAddAdultForm;
        }
        else if (type == 'child') {
            this.showAddChildForm = !this.showAddChildForm;
        }
        else if (type == 'infant') {
            this.showAddInfantForm = !this.showAddInfantForm;
        }
    };
    AdultListComponent.prototype.checkUser = function () {
        var userToken = localStorage.getItem('_lay_sess');
        if (userToken) {
            this.isLoggedIn = true;
        }
    };
    AdultListComponent.prototype.pushTraveler = function (event) {
        var travellerKeys = ["firstName", "lastName", "email", "dob", "gender"];
        var _itinerary;
        var _itineraryJson;
        _itinerary = sessionStorage.getItem('_itinerary');
        try {
            _itineraryJson = JSON.parse(_itinerary);
        }
        catch (e) { }
        if (event.user_type === 'adult') {
            var index = this._adults.indexOf(event.userId, 0);
            this._adults = this._adults.filter(function (item) { return item.userId != event.userId; });
            this.showAddAdultForm = false;
            var adultTravellerKeys = ["firstName", "lastName", "email", "dob", "gender", "countryCode", "phoneNo"];
            if (_itineraryJson && _itineraryJson.is_passport_required) {
                adultTravellerKeys = ["firstName", "lastName", "email", "dob", "gender", "countryCode", "phoneNo", "passportNumber", "passportExpiry"];
            }
            event.isComplete = this.checkObj(event, adultTravellerKeys);
            this._adults.push(event);
        }
        else if (event.user_type === 'child') {
            this._childs = this._childs.filter(function (item) { return item.userId != event.userId; });
            event.isComplete = this.checkObj(event, travellerKeys);
            this._childs.push(event);
            this.showAddChildForm = false;
        }
        else {
            this._infants = this._infants.filter(function (item) { return item.userId != event.userId; });
            event.isComplete = this.checkObj(event, travellerKeys);
            this._infants.push(event);
            this.showAddInfantForm = false;
        }
    };
    AdultListComponent.prototype.checkObj = function (obj, travellerKeys) {
        var isComplete = true;
        var userStr = JSON.stringify(obj);
        JSON.parse(userStr, function (key, value) {
            if (!value && travellerKeys.indexOf(key) !== -1) {
                return isComplete = false;
            }
        });
        return isComplete;
    };
    AdultListComponent.prototype.getFormStatus = function (status) {
        this.adultFormStatus = status;
    };
    AdultListComponent.prototype.infantCollapseClick = function () {
        this.infantCollapse = !this.infantCollapse;
    };
    AdultListComponent.prototype.childCollapseClick = function () {
        this.childCollapse = !this.childCollapse;
    };
    AdultListComponent.prototype.adultCollapseClick = function () {
        this.adultCollapse = !this.adultCollapse;
        console.log(this.adultCollapse);
    };
    AdultListComponent.prototype.getCountry = function () {
        var _this = this;
        this.genericService.getCountry().subscribe(function (data) {
            _this.countries = data.map(function (country) {
                return {
                    id: country.id,
                    name: country.name,
                    code: country.phonecode,
                    flag: _this.s3BucketUrl + 'assets/images/icon/flag/' + country.iso3.toLowerCase() + '.jpg'
                };
            }),
                _this.countries_code = data.map(function (country) {
                    return {
                        id: country.id,
                        name: country.phonecode + ' (' + country.iso2 + ')',
                        code: country.phonecode,
                        country_name: country.name + ' ' + country.phonecode,
                        flag: _this.s3BucketUrl + 'assets/images/icon/flag/' + country.iso3.toLowerCase() + '.jpg'
                    };
                });
        }, function (error) {
            if (error.status === 401) {
                _this.router.navigate(['/']);
            }
        });
    };
    __decorate([
        core_1.Output()
    ], AdultListComponent.prototype, "adultsCount");
    __decorate([
        core_1.Output()
    ], AdultListComponent.prototype, "_itinerarySelectionArray");
    __decorate([
        core_1.Input()
    ], AdultListComponent.prototype, "travelers");
    __decorate([
        core_1.Input()
    ], AdultListComponent.prototype, "username");
    __decorate([
        core_1.Input()
    ], AdultListComponent.prototype, "type");
    __decorate([
        core_1.Input()
    ], AdultListComponent.prototype, "age");
    __decorate([
        core_1.Input()
    ], AdultListComponent.prototype, "_adults");
    __decorate([
        core_1.Input()
    ], AdultListComponent.prototype, "_childs");
    __decorate([
        core_1.Input()
    ], AdultListComponent.prototype, "_infants");
    AdultListComponent = __decorate([
        core_1.Component({
            selector: 'app-adult-list',
            templateUrl: './adult-list.component.html',
            styleUrls: ['./adult-list.component.scss']
        })
    ], AdultListComponent);
    return AdultListComponent;
}());
exports.AdultListComponent = AdultListComponent;
