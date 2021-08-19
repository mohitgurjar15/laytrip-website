import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { environment } from '../../../environments/environment';
import { CommonFunction } from '../../_helpers/common-function';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  loading = false;
  cmsDataContent: string;

  constructor(    
    private genericService: GenericService,
    public commonFunction: CommonFunction,
    private translate: TranslateService
    ) { 
      translate.onLangChange.subscribe(lang => {
        this.setLanguage();
      });
    }

  ngOnInit() {
    $('body').addClass('cms-bgColor');
    window.scroll(0, 0);
    this.setLanguage();
  }

  setLanguage() {
    const userLang: string = JSON.parse(localStorage.getItem('_lang')).iso_1Code;
    const pageType = 'about';
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
