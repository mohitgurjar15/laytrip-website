import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-ccpa',
  templateUrl: './ccpa.component.html',
  styleUrls: ['./ccpa.component.scss']
})
export class CcpaComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  cmsDataContent;
  loading = false;

  constructor(
    private genericService: GenericService,
    public commonFunction: CommonFunction,
    private translate: TranslateService
    ) { 
      translate.onLangChange.subscribe(lang => this.setLanguage());
  }

  ngOnInit(): void {
    $('body').addClass('cms-bgColor');
    window.scroll(0, 0);
    this.setLanguage();
  }

  setLanguage() {
    const userLang: string = JSON.parse(localStorage.getItem('_lang')).iso_1Code;
    const pageType = 'ccpa';
    this.loading = true;
    this.genericService.getCmsByPageType(pageType).subscribe((res: any) => {
      switch(userLang) {
        case "es":
          this.cmsDataContent = res.esContent;
          break;
        default:
          this.cmsDataContent = res.enContent;
          break;
      }
      this.loading = false;
    });
  }
}