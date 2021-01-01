import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {

  @Input() totalPassenger:[];
  constructor() { }

  ngOnInit(): void {
    //console.log("this.totalPassenger",this.totalPassenger)
  }

}
