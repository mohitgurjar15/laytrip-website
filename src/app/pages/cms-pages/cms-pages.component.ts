import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../services/generic.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cms-pages',
  templateUrl: './cms-pages.component.html',
  styleUrls: ['./cms-pages.component.scss']
})
export class CmsPagesComponent implements OnInit {

  pageType;
  s3BucketUrl = environment.s3BucketUrl;
  loading = false;
  cmsData;

  constructor(
    private route: ActivatedRoute,
    private genericService: GenericService,
    public router: Router

  ) { }

  ngOnInit() {
    this.route.queryParams.forEach(params => {
      if (params && params.preview) {      
        this.pageType = params.preview;
        this.preview();
      } else {
        this.router.navigate(['/not-found']);
      }
    });   
  }

  preview(){
    this.loading = true;
    this.genericService.getCmsByPageType(this.pageType).subscribe((res:any)=>{
      this.cmsData = res;
      this.loading = false;
    },(err)=>{
      this.router.navigate(['/not-found'])
    })
  }

}
