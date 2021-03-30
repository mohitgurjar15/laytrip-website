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
  maxUploadError = '';
  fileObj;
  defaultImage = this.s3BucketUrl +'assets/images/profile_im.svg';
  image :any= '';
  fileName;
  pdfIcon = this.s3BucketUrl + 'assets/images/pdf.jpeg';
  public imageFileError = false;
  attatchmentFiles : any = [];
  files : any = [];

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


  onSubmit(data) {
    this.loading = true;
    this.submitted = true;

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
    formdata.append("file",this.files ? this.files : []);
    this.genericService.createEnquiry(formdata).subscribe((res: any) => {
      $('#contact_modal').modal('hide');
      this.loading = this.submitted = false;
      this.contactUsForm.reset();
      this.attatchmentFiles = this.files= [];
      this.maxUploadError = '';
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
    this.attatchmentFiles = [];
    this.maxUploadError = '';
  }


  documentFileChange(event: any) {
    this.maxUploadError = '';
    if(this.attatchmentFiles.length >= 5){
      $("#contact_modal").scrollTop(100);      
      this.maxUploadError = 'Maximum upload of 5 files';
      return;
    }
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      this.fileUploadErrorMessage = '';
      this.imageFileError = false;      
      const fileList: FileList = event.target.files;
      var fileSize  = Math.floor(fileList[0].size / 1000);
      this.image = '';
      if (fileList[0] && (
        fileList[0].type == 'image/jpg' ||
        fileList[0].type == 'image/png' ||
        fileList[0].type == 'application/pdf')) {          

        if (fileSize > 10000) {
          this.imageFileError = true;
          this.fileUploadErrorMessage = 'Maximum file size is 10MB.';
        }
        
        reader.readAsDataURL(event.target.files[0]);
        this.fileObj = event.target.files[0];
        
        reader.onload = (_event) => {
          this.defaultImage = '';
          this.image = fileList[0].type == 'application/pdf' ? this.pdfIcon : reader.result;
          this.fileName = fileList[0].name;
          this.cd.markForCheck();
          var attatchData = {
            image: this.image ? this.image : this.defaultImage,
            errorMsg: this.imageFileError ? this.fileUploadErrorMessage : '',
            fileName : this.fileName,
            is_error : this.imageFileError
          };
          this.attatchmentFiles.push(attatchData);
        };
        this.files.push(this.fileObj);
        
      } else {
        this.imageFileError = true;
        
        var attatchData = {
          image: this.image ? this.image : this.defaultImage,
          errorMsg: this.imageFileError ? 'Error attaching, try again' : '',
          fileName : this.fileName,
          is_error : this.imageFileError
        };
        this.attatchmentFiles.push(attatchData);
      }     
    }
  }

  removeAttatchedFile(i) {
    this.attatchmentFiles.splice(i,1);
  }
}
