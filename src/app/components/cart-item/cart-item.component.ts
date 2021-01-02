import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {

  @Input() totalPassenger:[];
  @Input() moduleType:string;
  @Input() travelers:[];

  constructor() { }

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['travelers']) {
      this.travelers = changes['travelers'].currentValue;
      console.log("this.totalPassenger, cart item",this.travelers)
    }
  }

}
