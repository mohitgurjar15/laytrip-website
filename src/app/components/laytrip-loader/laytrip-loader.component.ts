import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
var json = require('./data.json');

@Component({
  selector: 'app-laytrip-loader',
  templateUrl: './laytrip-loader.component.html',
  styleUrls: ['./laytrip-loader.component.scss']
})
export class LaytripLoaderComponent implements OnInit {

  public lottieConfig: Object;
  @Input() loading;

  constructor(
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.lottieConfig = {
      path: 'assets/data.json',
      autoplay: true,
      loop: true
    };
  }
}
