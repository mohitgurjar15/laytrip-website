import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
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
    private genericService: GenericService
    ) { }

  ngOnInit(): void {
    $('body').addClass('cms-bgColor');
    window.scroll(0, 0);
    const pageType = 'terms';
    this.loading = true;
    this.genericService.getCmsByPageType(pageType).subscribe((res: any) => {
      this.cmsData = res;
      this.loading = false;
    });
  }

}
