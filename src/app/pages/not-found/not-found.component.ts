import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonFunction } from './../../_helpers/common-function';
import { environment } from '../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  constructor(
    public router: Router,
    private commonFunction: CommonFunction
  ) { }
  ngOnInit(): void {
    window.scroll(0, 0);
    document.getElementById('loader_full_page').style.display = 'block' ? 'none' : 'block';
  }

  closeModal() {
    $('#not_found_modal').modal('hide');

    // Wouldn't it be easier to just window.history.go(-1) ?
    if (this.commonFunction.isRefferal()) {
      let parms = this.commonFunction.getRefferalParms();
      var queryParams: any = {};
      queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
      if (parms.utm_medium) {
        queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
      }
      if (parms.utm_campaign) {
        queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
      }
      this.router.navigate(['/'], { queryParams: queryParams });
    } else {
      this.router.navigate(['/']);
    }
  }
}