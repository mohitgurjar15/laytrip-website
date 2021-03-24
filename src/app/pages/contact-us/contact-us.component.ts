import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GenericService } from '../../services/generic.service';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie';
import { fileSizeValidator} from '../../_helpers/custom.validators';

declare var $: any;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  @ViewChild('fileInput', { static: false } as any) fileInput;
  s3BucketUrl = environment.s3BucketUrl;
  contactUsForm: FormGroup;
  loading = false;
  location;
  messageLenght = 0;
  submitted = false;
  fileUploadErrorMessage = '';
  fileObj;
  defaultImage = 'assets/images/file-upload.svg';
  image;
  fileName;
  pdfIcon = 'assets/images/pdf.svg';
  csvIcon = 'assets/images/csv.svg';
  xlsxIcon = 'assets/images/xls.svg';
  wordIcon = 'assets/images/word.svg';
  public imageFileError = false;
  attatchmentArray = [];


  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private genericService: GenericService,
    public commonFunction: CommonFunction,
    private cookieService: CookieService,
    private cd: ChangeDetectorRef

  ) { }

  ngOnInit() {
    window.scroll(0, 0);

    let location: any = this.cookieService.get('__loc');
    try {
      this.location = JSON.parse(location);
    } catch (e) { }

    this.contactUsForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      file: [''],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      message: ['', [Validators.required]],
    });
  }


  onSubmit() {
    this.loading = true;
    this.submitted = true;
    if (!fileSizeValidator(this.fileObj,10000)) {
      this.imageFileError = this.submitted = true;
      this.toastr.show("File is too large", '', {
        toastClass: 'custom_toastr',
        titleClass: 'custom_toastr_title',
        messageClass: 'custom_toastr_message',
      });
      this.loading = false;
      return;
    }

    if (this.contactUsForm.invalid) {
      this.submitted = true;
      Object.keys(this.contactUsForm.controls).forEach(key => {
        this.contactUsForm.get(key).markAsTouched();
      });
      this.loading = false;
      return;
    }
   
    let formdata = new FormData();
    formdata.append("name",this.contactUsForm.value.name);
    formdata.append("email",this.contactUsForm.value.email);
    formdata.append("message",this.contactUsForm.value.message);
    formdata.append("file",this.fileObj);

    this.genericService.createEnquiry(formdata).subscribe((res: any) => {
      $('#contact_modal').modal('hide');
      this.loading = false;
      this.submitted = false;
      this.contactUsForm.reset();
      this.toastr.show(res.message, '', {
        toastClass: 'custom_toastr',
        titleClass: 'custom_toastr_title',
        messageClass: 'custom_toastr_message',
      });
      this.ngOnInit();
    }, (error => {
      this.submitted = false;
      this.loading = false;
      this.toastr.show(error.message, '', {
        toastClass: 'custom_toastr',
        titleClass: 'custom_toastr_title',
        messageClass: 'custom_toastr_message',
      });
    }));
  }

  setMessageLenght(value) {
    this.messageLenght = value.toString().length;
  }

  closeModal() {
    this.submitted = false;
    Object.keys(this.contactUsForm.controls).forEach(key => {
      this.contactUsForm.get(key).markAsUntouched();
    });
    this.contactUsForm.reset();
  }

  
  documentFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const fileList: FileList = event.target.files;
      if (fileList[0] && fileList[0].type === 'image/svg+xml' ||
        fileList[0].type === 'image/jpeg' ||
        fileList[0].type === 'image/png' ||
        fileList[0].type === 'image/gif') {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        this.fileObj = event.target.files[0];
        reader.onload = (_event) => {
          this.defaultImage = '';
          this.image = reader.result;
          this.fileName = fileList[0].name;
          this.cd.markForCheck();
          this.fileUploadErrorMessage = '';
        };
      } else if (fileList[0] && fileList[0].type === 'application/pdf') {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        this.fileObj = event.target.files[0];
        reader.onload = (_event) => {
          this.defaultImage = '';
          this.image = this.pdfIcon;
          this.fileName = fileList[0].name;
          this.cd.markForCheck();
          // this.sendMassCommunicationForm.controls['file'].setValue(fileList[0].name);
          this.fileUploadErrorMessage = '';
        };
      } else {
        this.fileUploadErrorMessage = 'Please upload valid file';
      }
      this.attatchmentArray.push({ image :  this.fileObj });
      console.log('dfdf')

      console.log(this.attatchmentArray)
    }
  }


  resetImage() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
      // this.sendMassCommunicationForm.controls['file'].setValue(null);
      this.image = '';
      this.defaultImage = 'assets/images/file-upload.svg';
      this.fileName = '';
    }
  }
}
