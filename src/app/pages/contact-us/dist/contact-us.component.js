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
    function ContactUsComponent(formBuilder, toastr, genericService, commonFunction, cookieService, cd) {
        this.formBuilder = formBuilder;
        this.toastr = toastr;
        this.genericService = genericService;
        this.commonFunction = commonFunction;
        this.cookieService = cookieService;
        this.cd = cd;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
        this.messageLenght = 0;
        this.submitted = false;
        this.fileUploadErrorMessage = '';
        this.maxUploadError = '';
        this.defaultImage = this.s3BucketUrl + 'assets/images/profile_im.svg';
        this.image = '';
        this.pdfIcon = this.s3BucketUrl + 'assets/images/pdf.jpeg';
        this.imageFileError = false;
        this.attatchmentFiles = [];
        this.files = [];
    }
    ContactUsComponent.prototype.ngOnInit = function () {
        window.scroll(0, 0);
        var location = this.cookieService.get('__loc');
        try {
            this.location = JSON.parse(location);
        }
        catch (e) { }
        this.contactUsForm = this.formBuilder.group({
            name: ['', [forms_1.Validators.required]],
            file: [''],
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
            message: ['', [forms_1.Validators.required]]
        });
    };
    ContactUsComponent.prototype.onSubmit = function (data) {
        var _this = this;
        this.loading = true;
        this.submitted = true;
        if (this.contactUsForm.invalid) {
            this.submitted = true;
            Object.keys(this.contactUsForm.controls).forEach(function (key) {
                _this.contactUsForm.get(key).markAsTouched();
            });
            this.loading = false;
            return;
        }
        var formdata = new FormData();
        formdata.append("name", this.contactUsForm.value.name);
        formdata.append("email", this.contactUsForm.value.email);
        formdata.append("message", this.contactUsForm.value.message);
        for (var i = 0; i < this.files.length; i++) {
            formdata.append("file", this.files[i]);
        }
        this.genericService.createEnquiry(formdata).subscribe(function (res) {
            $('#contact_modal').modal('hide');
            _this.loading = _this.submitted = false;
            _this.contactUsForm.reset();
            _this.attatchmentFiles = _this.files = [];
            _this.maxUploadError = '';
            _this.toastr.show(res.message, '', {
                toastClass: 'custom_toastr',
                titleClass: 'custom_toastr_title',
                messageClass: 'custom_toastr_message'
            });
            _this.ngOnInit();
        }, (function (error) {
            _this.submitted = false;
            _this.loading = false;
            _this.toastr.show(error.message, '', {
                toastClass: 'custom_toastr',
                titleClass: 'custom_toastr_title',
                messageClass: 'custom_toastr_message'
            });
        }));
    };
    ContactUsComponent.prototype.setMessageLenght = function (value) {
        this.messageLenght = value.toString().length;
    };
    ContactUsComponent.prototype.closeModal = function () {
        var _this = this;
        this.messageLenght = 0;
        this.submitted = false;
        Object.keys(this.contactUsForm.controls).forEach(function (key) {
            _this.contactUsForm.get(key).markAsUntouched();
        });
        this.contactUsForm.reset();
        this.attatchmentFiles = [];
        this.maxUploadError = '';
    };
    ContactUsComponent.prototype.documentFileChange = function (event) {
        var _this = this;
        this.maxUploadError = '';
        if (this.attatchmentFiles.length >= 5) {
            $("#contact_modal").scrollTop(100);
            this.maxUploadError = 'Maximum upload of 5 files';
            return;
        }
        if (event.target.files && event.target.files[0]) {
            var reader_1 = new FileReader();
            this.fileUploadErrorMessage = '';
            this.imageFileError = false;
            var fileList_1 = event.target.files;
            var fileSize = Math.floor(fileList_1[0].size / 1000);
            this.image = '';
            if (fileList_1[0] && (fileList_1[0].type == 'image/jpg' ||
                fileList_1[0].type == 'image/png' ||
                fileList_1[0].type == 'application/pdf')) {
                if (fileSize > 10000) {
                    this.imageFileError = true;
                    this.fileUploadErrorMessage = 'Maximum file size is 10MB.';
                }
                reader_1.readAsDataURL(event.target.files[0]);
                this.fileObj = event.target.files[0];
                reader_1.onload = function (_event) {
                    _this.defaultImage = '';
                    _this.image = fileList_1[0].type == 'application/pdf' ? _this.pdfIcon : reader_1.result;
                    _this.fileName = fileList_1[0].name;
                    _this.cd.markForCheck();
                    var attatchData = {
                        image: _this.image ? _this.image : _this.defaultImage,
                        errorMsg: _this.imageFileError ? _this.fileUploadErrorMessage : '',
                        fileName: _this.fileName,
                        is_error: _this.imageFileError
                    };
                    _this.attatchmentFiles.push(attatchData);
                };
                this.files.push(this.fileObj);
            }
            else {
                this.imageFileError = true;
                var attatchData = {
                    image: this.image ? this.image : this.defaultImage,
                    errorMsg: this.imageFileError ? 'Error attaching, try again' : '',
                    fileName: this.fileName,
                    is_error: this.imageFileError
                };
                this.attatchmentFiles.push(attatchData);
            }
        }
    };
    ContactUsComponent.prototype.removeAttatchedFile = function (i) {
        this.attatchmentFiles.splice(i, 1);
    };
    __decorate([
        core_1.ViewChild('fileInput', { static: false })
    ], ContactUsComponent.prototype, "fileInput");
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
