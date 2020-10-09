import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-full-page-overlay-loader',
  templateUrl: './full-page-overlay-loader.component.html',
  styleUrls: ['./full-page-overlay-loader.component.scss']
})
export class FullPageOverlayLoaderComponent implements OnInit {

  constructor() { }
  @Input() image:string;
  @Input() module:string;
  @Input() type:string;
  s3BucketUrl = environment.s3BucketUrl;

  ngOnInit() {
  }

}
