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
var AdultListComponent = /** @class */ (function () {
    function AdultListComponent(cookieService, genericService, router, cd) {
        this.cookieService = cookieService;
        this.genericService = genericService;
        this.router = router;
        this.cd = cd;
        this.adultsCount = new core_1.EventEmitter();
        this._itinerarySelectionArray = new core_1.EventEmitter();
        this.travelers = [];
        this._adults = [];
        this._childs = [];
        this._infants = [];
        this.counter = 0;
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
        this.countries = [];
        this.countries_code = [];
        this.containers = [];
        this._itinerarySelection = {
            adult: [],
            child: [],
            infant: []
        };
    }
    AdultListComponent.prototype.ngOnInit = function () {
        this.checkUser();
        this.getCountry();
        if (this.type == 'adult' && !this.isLoggedIn) {
            this.showAddAdultForm = true;
        }
    };
    AdultListComponent.prototype.selectTraveler = function (event, traveler) {
        this._itinerary = JSON.parse(this.cookieService.get('_itinerary'));
        if (this._itinerary) {
            if (event.target.checked) {
                var totalTraveler = (Number(this._itinerary.adult) + Number(this._itinerary.child) + Number(this._itinerary.infant));
                var travelerData = {
                    "userId": traveler.userId,
                    "firstName": traveler.firstName,
                    "lastName": traveler.lastName,
                    "email": traveler.email
                };
                this._travelers.push(travelerData);
                this.cookieService.put("_travelers", JSON.stringify(this._travelers));
                if (this.counter + 1 < totalTraveler) {
                    // this.checkBoxDisable = false;
                    this.counter++;
                }
                else {
                    if (this.counter + 1 == totalTraveler) {
                        this.counter++;
                    }
                    // this.checkBoxDisable = true;                
                }
                if (traveler.user_type == 'adult') {
                    this._itinerarySelection.adult.push(traveler.userId);
                }
                else if (traveler.user_type == 'child') {
                    this._itinerarySelection.child.push(traveler.userId);
                }
                else {
                    this._itinerarySelection.infant.push(traveler.userId);
                }
            }
            else {
                this.counter--;
                // this.checkBoxDisable = false;
                this._travelers = this._travelers.filter(function (obj) { return obj.userId !== traveler.userId; });
                this.cookieService.remove('_travelers');
                this.cookieService.put("_travelers", JSON.stringify(this._travelers));
                if (traveler.user_type == 'adult') {
                    this._itinerarySelection.adult = this._itinerarySelection.adult.filter(function (obj) { return obj !== traveler.userId; });
                }
                else if (traveler.user_type == 'child') {
                    this._itinerarySelection.child = this._itinerarySelection.child.filter(function (obj) { return obj !== traveler.userId; });
                }
                else {
                    this._itinerarySelection.infant = this._itinerarySelection.infant.filter(function (obj) { return obj !== traveler.userId; });
                }
            }
        }
        console.log(this.counter);
        this.adultsCount.emit(this.counter);
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
        if (event.user_type === 'adult') {
            this._adults.push(event);
        }
        else if (event.user_type === 'child') {
            this._childs.push(event);
        }
        else {
            this._infants.push(event);
        }
        this.showAddAdultForm = false;
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
    };
    AdultListComponent.prototype.getCountry = function () {
        var _this = this;
        this.genericService.getCountry().subscribe(function (data) {
            _this.countries = data.map(function (country) {
                return {
                    id: country.id,
                    name: country.name,
                    code: country.phonecode
                };
            }),
                _this.countries_code = data.map(function (country) {
                    return {
                        id: country.id,
                        name: country.phonecode + ' (' + country.iso2 + ')',
                        code: country.phonecode
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
