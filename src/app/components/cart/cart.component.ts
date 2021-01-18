import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  @Input() carts;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes:SimpleChanges){

    if(changes['carts']){
      this.carts = changes['carts'].currentValue;
    }
  }

}
