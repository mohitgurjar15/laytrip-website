import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-airport-suggestion',
  templateUrl: './airport-suggestion.component.html',
  styleUrls: ['./airport-suggestion.component.scss']
})
export class AirportSuggestionComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
  }

}
