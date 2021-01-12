import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../_helpers/common-function';

@Component({
  selector: 'app-price-summary',
  templateUrl: './price-summary.component.html',
  styleUrls: ['./price-summary.component.scss']
})
export class PriceSummaryComponent implements OnInit {

  @Input() priceSummary;
  @Input() priceData=[];
  
  constructor(
    private commonFunction:CommonFunction
  ) { }

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['priceSummary']) {
      this.priceSummary = changes['priceSummary'].currentValue;
    }
  }

}
