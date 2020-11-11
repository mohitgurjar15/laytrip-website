import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl
  constructor() { }

  ngOnInit() {
    window.scroll(0, 0);
  }

}
