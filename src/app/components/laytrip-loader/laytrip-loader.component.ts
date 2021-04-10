import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-laytrip-loader',
  templateUrl: './laytrip-loader.component.html',
  styleUrls: ['./laytrip-loader.component.scss']
})
export class LaytripLoaderComponent implements OnInit {

  public lottieConfig: Object;
  @Input() loading;
  @Input() module;

  constructor(
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    var lottie_path = '';
    /* 
    this.lottieConfig = {
      path: lottie_path,
      autoplay: true,
      loop: true
    }; */
  }

}
