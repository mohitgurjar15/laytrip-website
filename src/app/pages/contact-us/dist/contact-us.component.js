"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ContactUsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../environments/environment");
var ContactUsComponent = /** @class */ (function () {
    function ContactUsComponent(formBuilder, toastr, genericService, commonFunction, cookieService) {
        this.formBuilder = formBuilder;
        this.toastr = toastr;
        this.genericService = genericService;
        this.commonFunction = commonFunction;
        this.cookieService = cookieService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
        this.countries_code = [];
        this.messageLenght = 0;
    }
    ContactUsComponent.prototype.ngOnInit = function () {
        window.scroll(0, 0);
        this.getCountry();
        var location = this.cookieService.get('__loc');
        try {
            this.location = JSON.parse(location);
        }
        catch (e) { }
        this.contactUsForm = this.formBuilder.group({
            name: ['', [forms_1.Validators.required]],
            country_code: [''],
            phone_no: [''],
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
            message: ['', [forms_1.Validators.required]]
        });
    };
    ContactUsComponent.prototype.getCountry = function () {
        var _this = this;
        this.genericService.getCountry().subscribe(function (data) {
            _this.countries_code = data.map(function (country) {
                return {
                    id: country.id,
                    name: country.phonecode + ' (' + country.iso2 + ')',
                    code: country.phonecode,
                    country_name: country.name + ' ' + country.phonecode,
                    flag: _this.s3BucketUrl + 'assets/images/icon/flag/' + country.iso3.toLowerCase() + '.jpg'
                };
            });
            if (_this.location) {
                var countryCode = _this.countries_code.filter(function (item) { return item.id == _this.location.country.id; })[0];
                _this.contactUsForm.controls.country_code.setValue(countryCode.country_name);
            }
        });
    };
    ContactUsComponent.prototype.onSubmit = function (formValue) {
        var _this = this;
        this.loading = true;
        if (this.contactUsForm.invalid) {
            Object.keys(this.contactUsForm.controls).forEach(function (key) {
                _this.contactUsForm.get(key).markAsTouched();
            });
            this.loading = false;
            return;
        }
        if (formValue.country_code) {
            formValue.country_code = formValue.country_code.id;
        }
        this.genericService.createEnquiry(formValue).subscribe(function (res) {
            $('#contact_modal').modal('hide');
            _this.loading = false;
            // this.toastr.success(res.message, 'Success');
            _this.ngOnInit();
        }, (function (error) {
            _this.loading = false;
            // this.toastr.error(error.message, 'Error');
        }));
    };
    ContactUsComponent.prototype.setMessageLenght = function (value) {
        this.messageLenght = value.toString().length;
    };
    ContactUsComponent = __decorate([
        core_1.Component({
            selector: 'app-contact-us',
            templateUrl: './contact-us.component.html',
            styleUrls: ['./contact-us.component.scss']
        })
    ], ContactUsComponent);
    return ContactUsComponent;
}());
exports.ContactUsComponent = ContactUsComponent;
