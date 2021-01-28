import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { throwError } from "rxjs";
import {catchError,retry, } from 'rxjs/operators';
import { CommonFunction } from "../_helpers/common-function";


@Injectable({
    providedIn: 'root'
})

export class TravelerService{
  
    constructor(
        private http:HttpClient,
        private commonFunction:CommonFunction
    ){

    }

    setHeaders(params='') {      
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

    getTravelers(){
        return this.http.get(environment.apiUrl+'v1/traveler/list-traveler',this.setHeaders());
    }

    addAdult(data) {
        let userToken = localStorage.getItem('_lay_sess');
        if (userToken) {
            return this.http.post(`${environment.apiUrl}v1/traveler/save`, data, this.commonFunction.setHeaders());
        } else {
            return this.http.post(`${environment.apiUrl}v1/traveler/save`, data);
        }
    }

    updateAdult(data, id) {
        return this.http.put(`${environment.apiUrl}v1/traveler/${id}`, data, this.commonFunction.setHeaders());
    }


    handleError(error) { 
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

    delete(id){
        return this.http.delete(environment.apiUrl +'v1/traveler/'+ id, this.setHeaders());
    }

    getEarnedPoint(pageNumber,limit){        
        return this.http.get(environment.apiUrl+`v1/laytrip-point/earned?limit=${limit}&page_no=${pageNumber}`,this.setHeaders())
        .pipe(
            retry(1),
            catchError(this.handleError)
          );
    }
    
    getRedeemedPoint(pageNumber,limit){
        
        return this.http.get(environment.apiUrl+ `v1/laytrip-point/redeemed?limit=${limit}&page_no=${pageNumber}`,this.setHeaders())
        .pipe(
            retry(1),
            catchError(this.handleError)
          );
    }
    
    getTotalAvailablePoints(pageNumber,limit){
        
        return this.http.get(environment.apiUrl+`v1/laytrip-point/total-available-points`,this.setHeaders())
        .pipe(
            retry(1),
            catchError(this.handleError)
          );
    }
    
}