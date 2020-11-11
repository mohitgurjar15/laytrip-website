import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dr-adventure',
  templateUrl: './dr-adventure.component.html',
  styleUrls: ['./dr-adventure.component.scss']
})
export class DrAdventureComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
  }

}
