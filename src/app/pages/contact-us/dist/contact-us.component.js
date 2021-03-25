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
var custom_validators_1 = require("../../_helpers/custom.validators");
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
        this.defaultImage = this.s3BucketUrl + 'assets/images/profile_im.svg';
        this.image = '';
        this.pdfIcon = this.s3BucketUrl + 'assets/images/pdf.svg';
        this.imageFileError = false;
        this.attatchmentArray = [];
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
    ContactUsComponent.prototype.onSubmit = function () {
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
        formdata.append("file", this.fileObj);
        this.genericService.createEnquiry(formdata).subscribe(function (res) {
            $('#contact_modal').modal('hide');
            _this.loading = false;
            _this.submitted = false;
            _this.contactUsForm.reset();
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
        this.submitted = false;
        Object.keys(this.contactUsForm.controls).forEach(function (key) {
            _this.contactUsForm.get(key).markAsUntouched();
        });
        this.contactUsForm.reset();
    };
    ContactUsComponent.prototype.documentFileChange = function (event) {
        var _this = this;
        if (event.target.files && event.target.files[0]) {
            this.fileUploadErrorMessage = '';
            this.imageFileError = false;
            var fileList_1 = event.target.files;
            var fileSize = fileList_1[0].size / 1024 / 1024;
            this.image = '';
            if (fileList_1[0] && fileList_1[0].type === 'image/svg+xml' ||
                fileList_1[0].type == 'image/jpeg' ||
                fileList_1[0].type == 'image/png' ||
                fileList_1[0].type == 'application/pdf' ||
                fileList_1[0].type == 'image/gif') {
                console.log(fileSize);
                if (fileSize > 10000) {
                    this.imageFileError = true;
                    this.fileUploadErrorMessage = 'Maximum upload size is 10MB';
                }
                else {
                    this.fileUploadErrorMessage = '';
                    this.imageFileError = false;
                }
                console.log(this.imageFileError, custom_validators_1.fileSizeValidator(fileList_1[0].size, 10000));
                var reader_1 = new FileReader();
                reader_1.readAsDataURL(event.target.files[0]);
                this.fileObj = event.target.files[0];
                reader_1.onload = function (_event) {
                    _this.defaultImage = '';
                    _this.image = fileList_1[0].type == '' ? _this.pdfIcon : reader_1.result;
                    _this.fileName = fileList_1[0].name;
                    _this.cd.markForCheck();
                    var attatchData = {
                        image: _this.image ? _this.image : _this.defaultImage,
                        errorMsg: _this.imageFileError ? _this.fileUploadErrorMessage : '',
                        fileName: _this.fileName,
                        is_error: _this.imageFileError
                    };
                    _this.attatchmentArray.push(attatchData);
                };
            }
            else {
                this.imageFileError = true;
                var attatchData = {
                    image: this.image ? this.image : this.defaultImage,
                    errorMsg: this.imageFileError ? 'Please upload valid file' : '',
                    fileName: this.fileName,
                    is_error: this.imageFileError
                };
                this.attatchmentArray.push(attatchData);
            }
            /*this.attatchmentArray.push({
              image: this.image ? this.image : this.defaultImage,
              errorMsg:this.fileUploadErrorMessage,
              fileName : this.fileName
            });*/
            console.log(this.attatchmentArray);
        }
    };
    ContactUsComponent.prototype.resetImage = function () {
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
            // this.sendMassCommunicationForm.controls['file'].setValue(null);
            this.image = '';
            // this.defaultImage = 'assets/images/file-upload.svg';
            this.fileName = '';
        }
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
