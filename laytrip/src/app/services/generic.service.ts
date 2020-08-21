import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { throwError } from "rxjs";
import {Observable, of} from 'rxjs';
import {catchError,retry, debounceTime, distinctUntilChanged, map, tap, switchMap, filter} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class GenericService{
  
    constructor(
        private http:HttpClient
    ){

    }

    test(){
      return this.http.post(`http://3.127.150.220/Webservice/streetParkingList`,{})
        .pipe(
            retry(1),
            catchError(this.handleError)
          );
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