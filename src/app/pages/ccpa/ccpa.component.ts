import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-ccpa',
  templateUrl: './ccpa.component.html',
  styleUrls: ['./ccpa.component.scss']
})
export class CcpaComponent implements OnInit {
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
    const userLang: string = JSON.parse(localStorage.getItem('_lang')).iso_1Code;
    const pageType = 'ccpa';
    this.loading = true;
    this.genericService.getCmsByPageType(pageType).subscribe((res: any) => {
      switch(userLang) {
        case "es":
          this.cmsData = res.esContent;
          break;
        default:
          this.cmsData = res.enContent;
          break;
      }
      this.loading = false;
    });
  }
}