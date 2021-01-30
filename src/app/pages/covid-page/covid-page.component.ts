import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { environment } from '../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-covid-page',
  templateUrl: './covid-page.component.html',
  styleUrls: ['./covid-page.component.scss']
})
export class CovidPageComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  loading = false;
  cmsData;

  constructor(
    private genericService: GenericService,
  ) { }

  ngOnInit() {
    $('body').addClass('cms-bgColor');
    window.scroll(0, 0);
    const pageType = 'covid';
    this.loading = true;
    this.genericService.getCmsByPageType(pageType).subscribe((res: any) => {
      this.cmsData = res;
      this.loading = false;
    });
  }

}
