import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { retry, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class GenericService{
    constructor(
        private http:HttpClient
    ){

    }
    getAllLangunage(){
        return this.http.get(`${environment.apiUrl}v1/langunage`)
        .pipe(
            retry(1),
            catchError(this.handleError)
          );
    }

    getCurrencies(){
      return this.http.get(`${environment.apiUrl}v1/langunage`)
        .pipe(
            retry(1),
            catchError(this.handleError)
          );
    }

    handleError(error) { 
        console.log(error);
        let errorMessage = {};
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