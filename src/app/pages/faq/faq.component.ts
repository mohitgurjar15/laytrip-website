import { Component, OnInit } from '@angular/core';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
import { GenericService } from '../../services/generic.service';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
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
  noResult = false;

  constructor(
    private genericService: GenericService,
    private commonFunction: CommonFunction

  ) { }

  ngOnInit() {
    $('body').addClass('cms-bgColor');
    window.scroll(0, 0);
    this.loadJquery();
    this.loading = true;
    this.genericService.getFaqData().subscribe((res: any) => {
      this.faqDetail = res.data;
      this.loading = false;
      this.noResult = false;
    },(error:HttpErrorResponse)=>{
      this.loading = false;
      this.noResult = true;
      console.log(this.noResult)
    }
    );
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


}
