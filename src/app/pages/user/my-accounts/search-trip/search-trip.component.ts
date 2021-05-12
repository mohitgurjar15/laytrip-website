import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonFunction } from '../../../../_helpers/common-function';
declare var $: any;

@Component({
  selector: 'app-search-trip',
  templateUrl: './search-trip.component.html',
  styleUrls: ['./search-trip.component.scss']
})
export class SearchTripComponent implements OnInit {
  SearchTripForm: FormGroup;
  submitted: boolean = false;
  isTripNotFound = false;
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
    $(document).find('.site_menu').removeClass("show");
    window.scroll(0, 0);
    this.SearchTripForm = this.formBuilder.group({
      tripId: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.SearchTripForm.invalid) {
      this.submitted = true;
      return;
    } else {
      let queryParam: any = {};
      if (this.commonFunction.isRefferal()) {
        let parms = this.commonFunction.getRefferalParms();
        queryParam.utm_source = parms.utm_source ? parms.utm_source : '';
        queryParam.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        this.router.navigate(['/account/trip/' + this.SearchTripForm.value.tripId], { queryParams: queryParam });
      } else {
        this.router.navigate(['/account/trip/' + this.SearchTripForm.value.tripId]);
      }
    }
  }

}
