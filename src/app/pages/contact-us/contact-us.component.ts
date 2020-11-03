import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GenericService } from '../../services/generic.service';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  contactUsForm: FormGroup;
  loading = false;
  countries_code: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private genericService: GenericService,
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
    window.scroll(0,0);
    this.contactUsForm = this.formBuilder.group({
      name: ['',[ Validators.required,Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
      country_code: ['Select'],
      phone_no: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      message: ['', [Validators.required]],
    });
    this.getCountry();
  }

  getCountry() {
    this.genericService.getCountry().subscribe((data: any) => {
      this.countries_code = data.map(country => {
        return {
          id: country.id,
          name: country.phonecode + ' (' + country.iso2 + ')',
          code: country.phonecode,
          flag: this.s3BucketUrl+'assets/images/icon/flag/'+ country.iso3.toLowerCase()+'.jpg'
        };
      });
    });
  }

  onSubmit(formValue) {
    this.loading = true;
    if (this.contactUsForm.invalid) {
      Object.keys(this.contactUsForm.controls).forEach(key => {
        this.contactUsForm.get(key).markAsTouched();
      });
      this.loading = false;
      return;
    }
    formValue.country_code = formValue.country_code.code;
    this.genericService.createEnquiry(formValue).subscribe((res: any) => {
      this.loading = false;
      this.toastr.success(res.message, 'Success');
      this.ngOnInit();
    }, (error => {
      this.loading = false;
      this.toastr.error(error.message, 'Error');
    }));
  }
}
