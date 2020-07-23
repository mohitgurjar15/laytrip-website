import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
declare var $ : any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit(): void {
    
     this.loadJquery();
  } 

  loadJquery(){
    $(".features-discover").slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      dots: false,
      centerMode: false,
      focusOnSelect: false,
      arrows: false
    });
  }
}
