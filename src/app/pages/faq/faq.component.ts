import { Component, OnInit } from '@angular/core';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
import { GenericService } from '../../services/generic.service';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  loading = false;
  faqDetail;
  lenguage;
  faqData = []

  constructor(
    private genericService: GenericService,
    private commonFunction: CommonFunction,
    private translate: TranslateService
  ) {
    translate.onLangChange.subscribe(lang => this.setLanguage());
  }

  ngOnInit() {
    $('body').addClass('cms-bgColor');
    window.scroll(0, 0);
    this.loadJquery();
    this.loading = true;
    this.setLanguage();
  }

  loadJquery() {
    $(document).ready(function () {

      $('.faq_callapse').on('shown.bs.collapse', function () {
        $(this).parent().addClass('active');
      });

      $('.faq_callapse').on('hidden.bs.collapse', function () {
        $(this).parent().removeClass('active');
      });

    });
  }

  setLanguage() {
    const userLang: string = JSON.parse(localStorage.getItem('_lang')).iso_1Code;
    this.loading = true;
    this.genericService.getFaqData().subscribe((res: any) => {
      this.faqDetail = res.data;
      this.loading = false;
      this.faqData = []
      switch (userLang) {
        case "es":
          for (let i = 0; i < this.faqDetail.length; i++) {
            for (let j = 0; j < this.faqDetail[i].faqMetas.length; j++) {
              if (this.faqDetail[i].faqMetas[j].language.iso_1Code == "es") {
                this.faqData.push({
                  question: this.faqDetail[i].faqMetas[j].question,
                  answer: this.faqDetail[i].faqMetas[j].answer
                })
              }
            }
          }
          break;
        default:
          for (let i = 0; i < this.faqDetail.length; i++) {
            for (let j = 0; j < this.faqDetail[i].faqMetas.length; j++) {
              if (this.faqDetail[i].faqMetas[j].language.iso_1Code == "en") {
                this.faqData.push({
                  question: this.faqDetail[i].faqMetas[j].question,
                  answer: this.faqDetail[i].faqMetas[j].answer
                })
              }
            }
          }
          break;
      }
      this.loading = false;
    });
  }
}
