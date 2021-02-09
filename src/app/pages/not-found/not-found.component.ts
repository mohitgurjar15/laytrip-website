import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }
  ngOnInit(): void {
    window.scroll(0, 0);
    document.getElementById('loader_full_page').style.display = 'block' ? 'none' : 'block';
  }

}
