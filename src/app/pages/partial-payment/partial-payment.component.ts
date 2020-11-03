import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-partial-payment',
  templateUrl: './partial-payment.component.html',
  styleUrls: ['./partial-payment.component.scss']
})
export class PartialPaymentComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  loading = false;
  cmsData;

  constructor(
    private genericService: GenericService,
  ) { }

  ngOnInit() {
    const pageType = 'partial-payment';
    this.loading = true;
    this.genericService.getCmsByPageType(pageType).subscribe((res: any) => {
      console.log(res);
      this.cmsData = res;
      this.loading = false;
    });
  }

}
