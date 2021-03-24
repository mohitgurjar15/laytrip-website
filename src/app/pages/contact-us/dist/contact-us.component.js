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
        this.defaultImage = 'assets/images/file-upload.svg';
        this.pdfIcon = 'assets/images/pdf.svg';
        this.csvIcon = 'assets/images/csv.svg';
        this.xlsxIcon = 'assets/images/xls.svg';
        this.wordIcon = 'assets/images/word.svg';
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
    ContactUsComponent.prototype.onSubmit = function (formValue) {
        var _this = this;
        console.log('sdsd');
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
        this.contactUsForm.controls.file.setValue(this.fileObj ? this.fileObj : '');
        console.log(this.contactUsForm.controls.value);
        this.genericService.createEnquiry(formValue).subscribe(function (res) {
            console.log('sdsd');
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
            var fileList_1 = event.target.files;
            if (fileList_1[0] && fileList_1[0].type === 'image/svg+xml' ||
                fileList_1[0].type === 'image/jpeg' ||
                fileList_1[0].type === 'image/png' ||
                fileList_1[0].type === 'image/gif') {
                var reader_1 = new FileReader();
                reader_1.readAsDataURL(event.target.files[0]);
                this.fileObj = event.target.files[0];
                reader_1.onload = function (_event) {
                    _this.defaultImage = '';
                    _this.image = reader_1.result;
                    _this.fileName = fileList_1[0].name;
                    _this.cd.markForCheck();
                    _this.fileUploadErrorMessage = '';
                };
            }
            else if (fileList_1[0] && fileList_1[0].type === 'application/pdf') {
                var reader = new FileReader();
                reader.readAsDataURL(event.target.files[0]);
                this.fileObj = event.target.files[0];
                reader.onload = function (_event) {
                    _this.defaultImage = '';
                    _this.image = _this.pdfIcon;
                    _this.fileName = fileList_1[0].name;
                    _this.cd.markForCheck();
                    // this.sendMassCommunicationForm.controls['file'].setValue(fileList[0].name);
                    _this.fileUploadErrorMessage = '';
                };
            }
            else if (fileList_1[0] && fileList_1[0].type === 'application/vnd.ms-excel') {
                var reader = new FileReader();
                reader.readAsDataURL(event.target.files[0]);
                this.fileObj = event.target.files[0];
                reader.onload = function (_event) {
                    _this.defaultImage = '';
                    _this.image = _this.csvIcon;
                    _this.fileName = fileList_1[0].name;
                    // this.sendMassCommunicationForm.controls['file'].setValue(fileList[0].name);
                    _this.fileUploadErrorMessage = '';
                    _this.cd.markForCheck();
                };
            }
            else if (fileList_1[0] && fileList_1[0].name.substring(fileList_1[0].name.indexOf('xlsx')) &&
                fileList_1[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                var reader = new FileReader();
                reader.readAsDataURL(event.target.files[0]);
                this.fileObj = event.target.files[0];
                reader.onload = function (_event) {
                    _this.defaultImage = '';
                    _this.image = _this.xlsxIcon;
                    _this.fileName = fileList_1[0].name;
                    // this.sendMassCommunicationForm.controls['file'].setValue(fileList[0].name);
                    _this.fileUploadErrorMessage = '';
                    _this.cd.markForCheck();
                };
            }
            else if (fileList_1[0] && fileList_1[0].name.substring(fileList_1[0].name.indexOf('doc') || fileList_1[0].name.indexOf('docx'))
                && fileList_1[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                || fileList_1[0].type === 'application/doc'
                || fileList_1[0].type === 'application/ms-doc'
                || fileList_1[0].type === 'application/msword') {
                var reader = new FileReader();
                reader.readAsDataURL(event.target.files[0]);
                this.fileObj = event.target.files[0];
                reader.onload = function (_event) {
                    _this.defaultImage = '';
                    _this.image = _this.wordIcon;
                    _this.fileName = fileList_1[0].name;
                    _this.cd.markForCheck();
                    // this.sendMassCommunicationForm.controls['file'].setValue(fileList[0].name);
                    _this.fileUploadErrorMessage = '';
                };
            }
            else {
                this.fileUploadErrorMessage = 'Please upload valid file';
            }
        }
    };
    ContactUsComponent.prototype.resetImage = function () {
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
            // this.sendMassCommunicationForm.controls['file'].setValue(null);
            this.image = '';
            this.defaultImage = 'assets/images/file-upload.svg';
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
