import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { throwError } from "rxjs";
import {catchError,retry, } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class FlightService{
  
    constructor(
        private http:HttpClient
    ){

    }

    private setHeaders(params='') {      
        const accessToken = localStorage.getItem('_lay_sess');
        const reqData = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        };
        if(params) {
            let reqParams = {};        
            Object.keys(params).map(k =>{
                reqParams[k] = params[k];
            });
            reqData['params'] = reqParams;
        }
        return reqData;
    } 

    searchAirport(searchItem){
        return this.http.get(`${environment.apiUrl}v1/flight/search-airport/${searchItem}`)
        .pipe(
            retry(1),
            catchError(this.handleError)
          );
    }

    airRevalidate(routeCode){

        const headers = {
            headers: {
                language : 'en',
                currency : 'USD' 
            },
        };

        return this.http.post(`${environment.apiUrl}v1/flight/air-revalidate/`,routeCode,headers)
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

    updateAdult(data,id) {
       
        return this.http.put(`${environment.apiUrl}v1/traveler/${id}`, data, this.setHeaders());

    }
}