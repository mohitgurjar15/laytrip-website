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
    console.log(this.module,this.loading)
    if(this.module == 'flight'){
      lottie_path = 'assets/lottie-json/flight/data.json';   
    } else if(this.module == 'hotel'){
      lottie_path = 'assets/lottie-json/hotel/data.json'; 
    } else {
      lottie_path = 'assets/lottie-json/flight/data.json';
    }
    this.lottieConfig = {
      path: lottie_path,
      autoplay: true,
      loop: true
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.module)
  }
}
