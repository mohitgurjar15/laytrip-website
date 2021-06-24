import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LANDING_PAGE } from "./landing-page.config";
import { HomeService } from "./services/home.service";
import * as jwt_encode from "jwt-encode";

@Injectable()
export class PreloadingService {

    public landingPageData: any = new BehaviorSubject<any>({});
    
    getLandingPageData = this.landingPageData.asObservable();

    constructor(
        private http: HttpClient,
        private homeService : HomeService
        ) {

    }

    load(): Promise<any> {
        const encode = require('jwt-encode');
        localStorage.setItem('__LP_DATA', "")
        return new Promise((resolve, reject) => {
            this.http.get('https://api.icndb.com/jokes/random').subscribe((response: any) => {
                sessionStorage.setItem('__LP_DATA', encode(LANDING_PAGE['AS-410'], 'secret'))
                resolve(true);
            });
        });
    }
}