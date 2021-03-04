"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ListTravellerComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var moment = require("moment");
var traveller_form_component_1 = require("./traveller-form/traveller-form.component");
var ListTravellerComponent = /** @class */ (function () {
    function ListTravellerComponent(travelerService, router, modalService, toastr, genericService, cookieService) {
        this.travelerService = travelerService;
        this.router = router;
        this.modalService = modalService;
        this.toastr = toastr;
        this.genericService = genericService;
        this.cookieService = cookieService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.travelers = [];
        this.closeResult = '';
        this.countries = [];
        this.countries_code = [];
        this.loading = true;
        this.loops = [0, 1, 2, 3, 4, 5];
        this.dataPassToChild = null;
        this.notFound = false;
        this.perPageLimitConfig = [10, 25, 50, 100];
        this.pageSize = 10;
        this.showPaginationBar = false;
        this.traveller = [];
        this.loadingValue = new core_1.EventEmitter();
        this.isMasterSel = false;
    }
    ListTravellerComponent.prototype.ngOnInit = function () {
        var location = this.cookieService.get('__loc');
        try {
            this.location = JSON.parse(location);
        }
        catch (e) {
        }
        window.scroll(0, 0);
        this.getCountry();
        this.pageNumber = 1;
        this.limit = this.perPageLimitConfig[0];
        this.loading = true;
        this.getTravelers();
        this.getCheckedItemList();
    };
    ListTravellerComponent.prototype.pageChange = function (event) {
        this.loading = false;
        this.pageNumber = event;
    };
    ListTravellerComponent.prototype.getTravelers = function () {
        var _this = this;
        this.travelerService.getTravelers().subscribe(function (data) {
            _this.travelers = data.data;
            _this.loading = false;
            _this.showPaginationBar = true;
            if (_this.travelers.length === 0) {
                _this.notFound = true;
            }
        }, function (error) {
            _this.loading = _this.showPaginationBar = false;
            _this.notFound = true;
            if (error.status === 401) {
                _this.router.navigate(['/']);
            }
        });
    };
    ListTravellerComponent.prototype.calculateAge = function (birthdate) {
        return moment().diff(birthdate, 'years') ? moment().diff(birthdate, 'years') + " yrs, " : "";
    };
    ListTravellerComponent.prototype.openDeleteModal = function (content, userId) {
        var _this = this;
        if (userId === void 0) { userId = ''; }
        this.modalReference = this.modalService.open(content, { windowClass: 'cmn_delete_modal', centered: true });
        this.userId = userId;
        this.modalReference.result.then(function (result) {
            _this.closeResult = "Closed with: " + result;
        }, function (reason) {
            // this.getTravelers();
            // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    };
    ListTravellerComponent.prototype.getCountry = function () {
        var _this = this;
        this.genericService.getCountry().subscribe(function (data) {
            _this.countries = data.map(function (country) {
                return {
                    id: country.id,
                    name: country.name,
                    countryCode: country.phonecode,
                    flag: _this.s3BucketUrl + 'assets/images/icon/flag/' + country.iso3.toLowerCase() + '.jpg'
                };
            });
            _this.countries_code = data.map(function (country) {
                return {
                    id: country.id,
                    name: country.phonecode + ' (' + country.iso2 + ')',
                    countryCode: country.phonecode,
                    country_name: country.name + ' ' + country.phonecode,
                    flag: _this.s3BucketUrl + 'assets/images/icon/flag/' + country.iso3.toLowerCase() + '.jpg'
                };
            });
            _this.setUSCountryInFirstElement(_this.countries);
        }, function (error) {
            if (error.status === 401) {
                _this.router.navigate(['/']);
            }
        });
    };
    ListTravellerComponent.prototype.setUSCountryInFirstElement = function (countries) {
        var usCountryObj = countries.find(function (x) { return x.id === 233; });
        var removedUsObj = countries.filter(function (obj) { return obj.id !== 233; });
        // this.countries = [];
        removedUsObj.unshift(usCountryObj);
        this.countries = [];
        removedUsObj.sort(function (a, b) {
            return (b['name'] > a['name']) ? 1 : ((b['name'] < a['name']) ? -1 : 0);
        });
        this.countries = removedUsObj;
    };
    ListTravellerComponent.prototype.checkUncheckAll = function () {
        var checkboxes = document.getElementsByClassName('travelerCheckbox');
        for (var i = 0; i < checkboxes.length; i++) {
            this.travelers[i].isSelected = this.isMasterSel;
        }
        this.getCheckedItemList();
    };
    ListTravellerComponent.prototype.isAllSelected = function () {
        this.isMasterSel = this.travelers.every(function (item) {
            return item.isSelected == true;
        });
        this.getCheckedItemList();
    };
    ListTravellerComponent.prototype.getCheckedItemList = function () {
        this.checkedCategoryList = [];
        for (var i = 0; i < this.travelers.length; i++) {
            if (this.travelers[i].isSelected)
                this.checkedCategoryList.push(this.travelers[i]);
        }
        this.checkedCategoryList = JSON.stringify(this.checkedCategoryList);
    };
    ListTravellerComponent.prototype.submitTravellerForm = function () {
        var _this = this;
        this.loadingValue.emit(true);
        var formData = this.childComponent.travellerForm;
        if (formData.invalid) {
            Object.keys(formData.controls).forEach(function (controlName) {
                return formData.controls[controlName].markAsTouched();
            });
            this.loadingValue.emit(false);
            return;
        }
        else {
            var country_id = formData.value.country_id.id;
            if (!Number(country_id)) {
                if (this.traveller.country) {
                    country_id = (this.traveller.country.id) ? this.traveller.country.id : '';
                }
                else {
                    country_id = 233;
                }
            }
            var jsonData = {
                first_name: formData.value.firstName,
                last_name: formData.value.lastName,
                dob: typeof formData.value.dob === 'object' ? moment(formData.value.dob).format('YYYY-MM-DD') : moment(this.stringToDate(formData.value.dob, '/')).format('YYYY-MM-DD'),
                gender: formData.value.gender ? formData.value.gender : 'M',
                country_id: country_id ? country_id : '',
                passport_expiry: typeof formData.value.passport_expiry === 'object' ? moment(formData.value.passport_expiry).format('YYYY-MM-DD') : null,
                passport_number: formData.value.passport_number,
                country_code: formData.value.country_code ? formData.value.country_code : '',
                phone_no: formData.value.phone_no
            };
            var emailObj = { email: formData.value.email ? formData.value.email : '' };
            this.travelerService.addAdult(jsonData).subscribe(function (data) {
                _this.getTravelers();
                _this.childComponent.travellerForm.reset();
                _this.loadingValue.emit(false);
            }, function (error) {
                _this.loadingValue.emit(false);
                if (error.status === 401) {
                    _this.router.navigate(['/']);
                }
                else {
                }
            });
        }
    };
    ListTravellerComponent.prototype.stringToDate = function (string, saprator) {
        var dateArray = string.split(saprator);
        return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
    };
    ListTravellerComponent.prototype.getLoadingValue = function (event) {
        this.loadingValue.emit(event ? event : false);
    };
    ListTravellerComponent.prototype.getTravellerIdFromChild = function (travelerId) {
        this.openDeleteModal('deleteContent', travelerId);
    };
    ListTravellerComponent.prototype.pushTraveler = function (traveler) {
        if (typeof traveler == 'string') {
            this.travelers = this.travelers.filter(function (obj) { return obj.userId !== traveler; });
        }
        else {
            this.travelers = this.travelers.filter(function (obj) { return obj.userId !== traveler.userId; });
            this.travelers.push(traveler);
        }
    };
    __decorate([
        core_1.ViewChild(traveller_form_component_1.TravellerFormComponent, { static: false })
    ], ListTravellerComponent.prototype, "childComponent");
    __decorate([
        core_1.Output()
    ], ListTravellerComponent.prototype, "loadingValue");
    ListTravellerComponent = __decorate([
        core_1.Component({
            selector: 'app-list-traveller',
            templateUrl: './list-traveller.component.html',
            styleUrls: ['./list-traveller.component.scss']
        })
    ], ListTravellerComponent);
    return ListTravellerComponent;
}());
exports.ListTravellerComponent = ListTravellerComponent;
