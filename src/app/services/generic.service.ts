import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { throwError } from "rxjs";
import {catchError,retry} from 'rxjs/operators';
import { CommonFunction } from './../_helpers/common-function'


@Injectable({
    providedIn: 'root'
})

export class GenericService{
  
    constructor(
        private http:HttpClient,
        private commonFunction: CommonFunction
    ){

    }

    
    getAllLangunage(){
        return this.http.get(`${environment.apiUrl}v1/language`)
        .pipe(
            retry(1),
            catchError(this.handleError)
          );
    }

    getCurrencies(){
      return this.http.get(`${environment.apiUrl}v1/currency`)
        .pipe(
            retry(1),
            catchError(this.handleError)
          );
    }

    getModules(){
      return this.http.get(`${environment.apiUrl}v1/modules`)
        .pipe(
            retry(1),
            catchError(this.handleError)
          );
    }

    saveCard(cardData){
      return this.http.post(`${environment.apiUrl}v1/payment`,cardData)
        .pipe(
            retry(1),
            catchError(this.handleError)
          );
    }

    getCardlist(){
      
      return this.http.get(`${environment.apiUrl}v1/payment`,this.commonFunction.setHeaders())
        .pipe(
            retry(1),
            catchError(this.handleError)
          );
    }


    handleError(error) { 
        console.log("====",error);
        let errorMessage = {};
        if(error.status==0){
            console.log("API Server is not responding")
        }
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = {message:error.error.message};
        } else {
          // server-side error
          errorMessage = {status:error.status,message:error.error.message};
        }
        return throwError(errorMessage);
    }
}