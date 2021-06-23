import { HttpClient } from "@angular/common/http";
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Event, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonFunction } from "../_helpers/common-function";
import { throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { GenericService } from "./generic.service";

declare var Spreedly: any;
declare var env: any;

@Injectable()
export class SpreedlyService {
  eventData: any;
  environmentKey:string='';
  constructor(
    private router:Router,
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
    private commonFunction: CommonFunction,
    private genericService:GenericService
  ) {
    this.genericService.getPaymentDetails().subscribe((result:any)=>{
      this.environmentKey = result.credentials.environment;
    })
   }

  browserInfo() {

    var browser_size = '01';
    // The accept header from your server side rendered page. You'll need to inject it into the page. Below is an example.
    var acceptHeader = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
    // The request should include the browser data collected by using `Spreedly.ThreeDS.serialize().

    let browser_info = Spreedly.ThreeDS.serialize(
      browser_size,
      acceptHeader
    );

    return browser_info;

  }

  lifeCycle(res: any) {

    let transaction = res.transaction;

    let accessToken = localStorage.getItem('_lay_sess');
    env.init(environment, accessToken, res.redirection);

    var lifecycle = new Spreedly.ThreeDS.Lifecycle({
      environmentKey: this.environmentKey,
      // The environmentKey field is required, but if omitted, you will receive a console warning message and the transaction will still succeed.
      hiddenIframeLocation: 'device-fingerprint',
      // The DOM node that you'd like to inject hidden iframes
      challengeIframeLocation: 'challenge',
      // The DOM node that you'd like to inject the challenge flow
      transactionToken: transaction.token,
      // The token for the transaction - used to poll for state
      // The css classes that you'd like to apply to the challenge iframe.
      challengeIframeClasses: 'challangeIframe'
      // Note: This is where you'll change the height and width of the challenge
      //       iframe. You'll need to match the height and width option that you
      //       selected when collecting browser data with `Spreedly.ThreeDS.serialize`.
      //       For instance if you selected '04' for browserSize you'll need to have a
      //       CSS class that has width and height of 600px by 400px.
    });
    // Spreedly.on('3ds:status', spreedlyStatus.updates);
    // let status3ds = Spreedly.on('3ds:status', this.statusUpdates);

    var transactionData = {
      state: transaction.state,
      // The current state of the transaction. 'pending', 'succeeded', etc
      required_action: transaction.required_action,
      // The next action to be performed in the 3D Secure workflow
      device_fingerprint_form: transaction.device_fingerprint_form,
      // Available when the required_action is on the device fingerprint step
      checkout_form: transaction.checkout_form,
      // Available when the required_action is on the 3D Secure 1.0 fallback step
      checkout_url: transaction.checkout_url,
      // Available when the required_action is on the 3D Secure 1.0 fallback step
      challenge_form: transaction.challenge_form,
      // The challenge form that is injected when the user is challenged
      challenge_url: transaction.challenge_url,
      // redirect_url: 'http://localhost:4200/flight/confirmation',
      redirect_url: res.redirection,
      // The challenge url that is loaded when there is no challenge form
    };
    lifecycle.start(transactionData);
  }


}
