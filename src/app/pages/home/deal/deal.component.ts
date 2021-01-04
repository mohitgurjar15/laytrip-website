import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.scss']
})
export class DealComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Output() toString = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit() {
  }

  btnDealClick(code : string){
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    this.toString.emit(code);
  }
}
