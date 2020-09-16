"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CrudCoAccountComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../../../../environments/environment");
var moment = require("moment");
var CrudCoAccountComponent = /** @class */ (function () {
    function CrudCoAccountComponent(formBuilder, genericService, router, commonFunction) {
        this.formBuilder = formBuilder;
        this.genericService = genericService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.countries = [];
        this.countries_code = [];
        this.isLoggedIn = false;
        this.submitted = false;
        this.loading = false;
        this.travellerId = '';
        this.dobMaxDate = moment();
        this.expiryMinDate = moment().add(2, 'days');
        this.subscriptions = [];
        this.locale = {
            format: 'DD/MM/YYYY',
            displayFormat: 'DD/MM/YYYY'
        };
    }
    CrudCoAccountComponent.prototype.ngOnInit = function () {
        this.checkUser();
        this.getCountry();
        this.coAccountForm = this.formBuilder.group({
            title: [''],
            gender: ['', forms_1.Validators.required],
            firstName: ['', forms_1.Validators.required],
            lastName: ['', forms_1.Validators.required],
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
            country_code: ['', [forms_1.Validators.required]],
            phone_no: ['', [forms_1.Validators.required]],
            country_id: ['', forms_1.Validators.required],
            dob: ['', forms_1.Validators.required],
            passport_expiry: ['', forms_1.Validators.required],
            /*  dob: [{
               startDate: typeof this.traveler.dob !== 'undefined' ?
                 moment(this.traveler.dob, 'YYYY-MM-DD').format('DD/MM/YYYY') : this.dobMaxDate
             }, Validators.required],
             passport_expiry: [{
               startDate: typeof this.traveler.passportExpiry !== 'undefined' ?
                 moment(this.traveler.passportExpiry, 'YYYY-MM-DD').format('DD/MM/YYYY') : this.expiryMinDate
             },], */
            passport_number: [''],
            frequently_no: [''],
            user_type: ['']
        });
    };
    CrudCoAccountComponent.prototype.checkUser = function () {
        var userToken = localStorage.getItem('_lay_sess');
        if (userToken) {
            this.isLoggedIn = true;
        }
    };
    CrudCoAccountComponent.prototype.getCountry = function () {
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
    CrudCoAccountComponent.prototype.onSubmit = function () {
        this.submitted = this.loading = true;
        if (this.coAccountForm.invalid) {
            this.submitted = true;
            this.loading = false;
            return;
        }
        else {
            var country_id = this.coAccountForm.value.country_id.id;
            if (!Number(country_id)) {
                country_id = this.coAccountForm.value.country.id;
            }
            var jsonData = {
                title: this.coAccountForm.value.title,
                first_name: this.coAccountForm.value.firstName,
                last_name: this.coAccountForm.value.lastName,
                frequently_no: this.coAccountForm.value.frequently_no,
                passport_number: this.coAccountForm.value.passport_number,
                dob: typeof this.coAccountForm.value.dob.startDate === 'object' ? moment(this.coAccountForm.value.dob.startDate).format('YYYY-MM-DD') : moment(this.commonFunction.stringToDate(this.coAccountForm.value.dob.startDate, '/')).format('YYYY-MM-DD'),
                gender: this.coAccountForm.value.gender,
                country_id: country_id ? country_id : '',
                passport_expiry: typeof this.coAccountForm.value.passport_expiry.startDate === 'object' ? moment(this.coAccountForm.value.dob.passport_expiry).format('YYYY-MM-DD') : moment(this.commonFunction.stringToDate(this.coAccountForm.value.passport_expiry.startDate, '/')).format('YYYY-MM-DD')
            };
            console.log(jsonData);
            if (this.travellerId) {
            }
            else {
                console.log(jsonData);
            }
        }
    };
    CrudCoAccountComponent = __decorate([
        core_1.Component({
            selector: 'app-crud-co-account',
            templateUrl: './crud-co-account.component.html',
            styleUrls: ['./crud-co-account.component.scss']
        })
    ], CrudCoAccountComponent);
    return CrudCoAccountComponent;
}());
exports.CrudCoAccountComponent = CrudCoAccountComponent;
