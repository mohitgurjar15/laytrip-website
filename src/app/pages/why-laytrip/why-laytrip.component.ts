import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GenericService } from '../../services/generic.service';

@Component({
  selector: 'app-why-laytrip',
  templateUrl: './why-laytrip.component.html',
  styleUrls: ['./why-laytrip.component.scss']
})
export class WhyLaytripComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  loading = false;
  cmsData;

  constructor(
    private genericService: GenericService,
  ) { }

  ngOnInit() {
    const pageType = 'why-laytrip';
    this.loading = true;
    this.genericService.getCmsByPageType(pageType).subscribe((res: any) => {
      this.cmsData = res;
      this.loading = false;
    });
  }

}
