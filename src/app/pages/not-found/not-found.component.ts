import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor() { }
  s3BucketUrl = environment.s3BucketUrl;
  ngOnInit(): void {
    window.scroll(0,0);
    document.getElementById('page_loader').style.display = 'block' ? 'none' : 'block';
  }

}
