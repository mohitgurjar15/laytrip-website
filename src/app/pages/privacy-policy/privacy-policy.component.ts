import { Component, OnInit } from '@angular/core';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
import { GenericService } from '../../services/generic.service';
declare var $: any;
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  loading = false;
  cmsData;

  constructor(
    private genericService: GenericService,
    public commonFunction: CommonFunction
  ) { }

  ngOnInit() {
    window.scroll(0,0);
    $('body').addClass('cms-bgColor');
    const pageType = 'privacy-policy';
    this.loading = true;
    this.genericService.getCmsByPageType(pageType).subscribe((res: any) => {
      this.cmsData = res;
      var concatUrl = '';
      if (this.commonFunction.isRefferal()) {
        var parms = this.commonFunction.getRefferalParms();
        concatUrl = parms.utm_source ? '?utm_source='+parms.utm_source : '';
        if (parms.utm_medium) {
            concatUrl += parms.utm_medium ? '&utm_medium='+parms.utm_medium : '';
        }
        if (parms.utm_campaign) {
            concatUrl += parms.utm_campaign ? '&utm_campaign='+parms.utm_campaign : '';
        }
      }
      this.cmsData.enContent = res.enContent.replace('laytrip.com/', 'laytrip.com/'+concatUrl);
      this.loading = false;
    });
  }

}
