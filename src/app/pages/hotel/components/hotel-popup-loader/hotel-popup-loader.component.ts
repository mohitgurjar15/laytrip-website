import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-hotel-popup-loader',
  templateUrl: './hotel-popup-loader.component.html',
  styleUrls: ['./hotel-popup-loader.component.scss']
})
export class HotelPopupLoaderComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
    this.loadJquery();
  }

  loadJquery() {
    //Start popup page loader Js
    $(function () {
      var progressbar = $("#Loader_progressbar"),
        progressLabel = $(".progress-label");
      progressbar.progressbar({
        value: false,
        change: function () {
          progressLabel.text(progressbar.progressbar("value") + "%");
        },
        complete: function () {
          progressLabel.text("Complete!");
          $(".page_load").hide();
        }
      });

      function progress() {
        var val = progressbar.progressbar("value") || 0;
        progressbar.progressbar("value", val + 2);
        if (val < 99) {
        }
      }
    });
  }


}
