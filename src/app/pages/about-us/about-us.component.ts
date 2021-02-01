import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { environment } from '../../../environments/environment';
import { CommonFunction } from 'src/app/_helpers/common-function';
declare var $: any;

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  loading = false;
  cmsData;

  constructor(    
    private genericService: GenericService,
    private commonFunction: CommonFunction
    ) { }

  ngOnInit() {
    $('body').addClass('cms-bgColor');
    window.scroll(0, 0);
    const pageType = 'about';
    this.loading = true;
    this.genericService.getCmsByPageType(pageType).subscribe((res: any) => {
      this.cmsData = res;
      this.loading = false;
    });
  }



}
