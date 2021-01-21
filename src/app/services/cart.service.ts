import { Injectable, Output, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems = new BehaviorSubject({});
  getCartItems = this.cartItems.asObservable();

  constructor() { }

  setCartItems(cartItem) {
    this.cartItems.next(cartItem);
  }
}
