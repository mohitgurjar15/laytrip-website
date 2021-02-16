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

  private cartItems = new BehaviorSubject([]);
  getCartItems = this.cartItems.asObservable();

  private cartNumber = new BehaviorSubject(0)
  getSelectedCart = this.cartNumber.asObservable();

  private cartId = new BehaviorSubject(0)
  getCartId = this.cartId.asObservable();

  private cartPrices = new BehaviorSubject([])
  getCartPrice = this.cartPrices.asObservable();

  private cartDeletedItem = new BehaviorSubject(-1)
  getCartDeletedItem = this.cartDeletedItem.asObservable();

  private cartTravelers = new BehaviorSubject({
    type0 : {
      adults : []
    },
    type1 : {
      adults : []
    },
    type2 : {
      adults : []
    },
    type3 : {
      adults : []
    },
    type4 : {
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

  getCartList(live_availiblity='no',guestUserId='') {
    let headers = {
      currency: 'USD',
      language: 'en'
    }
    let httpHeaders;
    if(guestUserId){
      httpHeaders = 
      {
        headers :headers
      }
    }
    else{
      httpHeaders = this.commonFunction.setHeaders(headers)
    }
    console.log("httpHeaders",httpHeaders)

    return this.http.get(`${environment.apiUrl}v1/cart/list?live_availiblity=${live_availiblity}&guest_id=${guestUserId}`, httpHeaders)
      .pipe(
        catchError(this.handleError)
      );
  }

  addCartItem(data) {

    let httpHeaders;
    let headers = {
      currency: 'USD',
      language: 'en'
    }
    if(data.guest_id){
      httpHeaders = 
      {
        headers :headers
      }
    }
    else{
      httpHeaders = this.commonFunction.setHeaders(headers)
    }
    return this.http.post(`${environment.apiUrl}v1/cart/add`, data, httpHeaders)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteCartItem(id,guestUserId=null) {
    return this.http.delete(`${environment.apiUrl}v1/cart/delete/${id}?guest_id=${guestUserId}`);
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

  setCartNumber(cartNumber){
    this.cartNumber.next(cartNumber);
  }

  setCardId(cartId){
    this.cartId.next(cartId)
  }

  setCartTravelers(travelers){
    this.cartTravelers.next(travelers);
  }

  updateCart(data){
    return this.http.put  (`${environment.apiUrl}v1/cart/update`, data, this.commonFunction.setHeaders())
  }

  setCartPrices(cartPrices){
    this.cartPrices.next(cartPrices)
  }

  setDeletedCartItem(cartDeletedItem){
    this.cartDeletedItem.next(cartDeletedItem);
  }

  bookCart(data){
    let headers = {
      currency: 'USD',
      language: 'en'
    }
    return this.http.post(`${environment.apiUrl}v1/cart/book`, data, this.commonFunction.setHeaders(headers))
  }

  getBookingDetails(bookingId){
    let headers = {
      currency: 'USD',
      language: 'en'
    }
    return this.http.get(`${environment.apiUrl}v1/booking/cart-detail/${bookingId}`, this.commonFunction.setHeaders(headers))
  }
}
