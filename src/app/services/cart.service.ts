import { HttpClient } from "@angular/common/http";
import { Injectable, Output, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CommonFunction } from "../_helpers/common-function";
import { environment } from '../../environments/environment';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems = new BehaviorSubject({});
  getCartItems = this.cartItems.asObservable();

  private cartNumber = new BehaviorSubject(0)
  getSelectedCart = this.cartNumber.asObservable();

  private cartTravelers = new BehaviorSubject({
    type0 : {
      adults : []
    },
    type1 : {
      adults : []
    }
  });
  getCartTravelers = this.cartTravelers.asObservable();


  constructor(
    private http: HttpClient,
    private commonFunction: CommonFunction
  ) { }

  setCartItems(cartItem) {
    this.cartItems.next(cartItem);
  }

  getCartList() {
    let headers = {
      currency: 'USD',
      language: 'en'
    }
    return this.http.get(`${environment.apiUrl}v1/cart/list`, this.commonFunction.setHeaders(headers))
      .pipe(
        catchError(this.handleError)
      );
  }

  addCartItem(data) {
    let headers = {
      currency: 'USD',
      language: 'en'
    }
    return this.http.post(`${environment.apiUrl}v1/cart/add`, data, this.commonFunction.setHeaders(headers))
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteCartItem(id) {
    return this.http.delete(environment.apiUrl + 'v1/cart/delete/' + id, this.commonFunction.setHeaders());
  }

  handleError(error) {

    let errorMessage = {};
    if (error.status == 0) {
      console.log("API Server is not responding")
    }
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = { message: error.error.message };
    } else {
      // server-side error
      errorMessage = { status: error.status, message: error.error.message };
    }
    return throwError(errorMessage);
  }

  setCardNumber(cartNumber){
    this.cartNumber.next(cartNumber)
  }

  setCartTravelers(travelers){
    this.cartTravelers.next(travelers);
  }
}
