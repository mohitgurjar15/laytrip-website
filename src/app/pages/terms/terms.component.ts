import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  cmsData;
  loading = false;

  constructor(    
    private genericService: GenericService,
    public commonFunction: CommonFunction
    ) { }

  ngOnInit(): void {
    $('body').addClass('cms-bgColor');
    window.scroll(0, 0);
    const pageType = 'terms';
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
      this.cmsData.enContent = res.enContent.replace('/privacy-policy', '/privacy-policy'+concatUrl);
      this.loading = false;
    });
  }

}
