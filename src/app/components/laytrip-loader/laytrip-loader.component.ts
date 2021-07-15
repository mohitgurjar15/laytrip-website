import { Component, Input, OnInit} from '@angular/core';
//import { NgxSpinnerService } from 'ngx-spinner';

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
  ) { }

  ngOnInit() {
    

    var lottie_path = '';
  }

}
