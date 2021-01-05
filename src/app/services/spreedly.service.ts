import { Injectable } from '@angular/core';
import { Event } from '@angular/router';

declare var Spreedly: any;

@Injectable()
export class SpreedlyService {

  constructor() { }

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

  lifeCycle(transaction: any) {
    var lifecycle = new Spreedly.ThreeDS.Lifecycle({
      environmentKey: "9KGMvRTcGfbQkaHQU0fPlr2jnQ8",
      // The environmentKey field is required, but if omitted, you will receive a console warning message and the transaction will still succeed.
      hiddenIframeLocation: 'device-fingerprint',
      // The DOM node that you'd like to inject hidden iframes
      challengeIframeLocation: 'challenge',
      // The DOM node that you'd like to inject the challenge flow
      transactionToken: transaction.token
      // The token for the transaction - used to poll for state
      // The css classes that you'd like to apply to the challenge iframe.
      //
      // Note: This is where you'll change the height and width of the challenge
      //       iframe. You'll need to match the height and width option that you
      //       selected when collecting browser data with `Spreedly.ThreeDS.serialize`.
      //       For instance if you selected '04' for browserSize you'll need to have a
      //       CSS class that has width and height of 600px by 400px.
    });

    let status3ds = Spreedly.on('3ds:status', this.statusUpdates);

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
      redirect_url: 'http://localhost:4200/flight/confirmation',
      // redirect_url: 'https://demo.eztoflow.com/',
      // The challenge url that is loaded when there is no challenge form
    };

    console.log("transaction data");
    console.log(transactionData);

    console.log("Start lifecycle");
    lifecycle.start(transactionData);
  }

  statusUpdates ($event) {
    console.log("event data");
    console.log($event.action);
    // if (event.action === 'succeeded') {

    //   // finish your checkout and redirect to success page

    // } else if (event.action === 'error') {
    //   // present an error to the user to retry
    // } else if (event.action === 'challenge') {
    //   console.log('in');
    //   // Show your modal containing the div provided in `challengeIframeLocation` when
    //   // creating the lifecycle event.
    //   //
    //   // Example HTML on your page:
    //   //
    //   // <head>
    //   //   <style>
    //   //     .hidden {
    //   //       display: none;
    //   //     }
    //   //
    //   //     #challenge-modal {
    //   //       <!-- style your modal here -->
    //   //     }
    //   //   </style>
    //   // </head>
    //   // <body>
    //   //   <div id="device-fingerprint" class="hidden">
    //   //     <!-- Spreedly injects content into this div,
    //   //          do not nest the challenge div inside of it -->
    //   //   </div>
    //   //   <div id="challenge-modal" class="hidden">
    //   //     <div id="challenge">
    //   //     </div>
    //   //   </div>
    //   // </body>
    //   //
    //   //  Example lifecycle object from step 6:
    //   //
    //   //  var lifecycle = new Spreedly.ThreeDS.Lifecycle({
    //   //    hiddenIframeLocation: 'device-fingerprint',
    //   //    challengeIframeLocation: 'challenge',
    //   //    ...
    //   //  })
    //   //
    //   //  and then we show the challenge-modal
    //   //

    // } else if (event.action === 'trigger-completion') {
    //   // 1. make a request to your backend to do an authenticated call to Spreedly to complete the request
    //   //    The completion call is `https://core.spreedly.com/v1/transactions/[transaction-token]/complete.json (or .xml)`
    //   // 2a. if the transaction is marked as "succeeded" finish your checkout and redirect to success page
    //   // 2b. if the transaction is marked "pending" you'll need to call finalize `event.finalize(transaction)` with the transaction data from the authenticated completion call.

    //   // This is an example of the authenticated call that you'd make
    //   // to your service.
    //   // fetch(`https://your-service/complete/${purchaseToken}.json`, { method: 'POST' })
    //   //   .then(response => response.json())
    //   //   .then((data) => {
    //   //     if (data.state === 'succeeded') {

    //   //       // finish your checkout and redirect to success page

    //   //     }

    //   //     if (data.state === 'pending') {
    //   //       event.finalize(data);
    //   //     }
    //   // })
    // }
  }
}
