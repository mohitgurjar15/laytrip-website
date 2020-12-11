import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-vacation-loader',
  templateUrl: './vacation-loader.component.html',
  styleUrls: ['./vacation-loader.component.scss']
})
export class VacationLoaderComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {

 //  	var progressbar = $("#Loader_progressbar"),
	// 	progressLabel = $(".progress-label");
	// progressbar.progressbar({
	// 	value: false,
	// 	change: function () {
	// 		progressLabel.text(progressbar.progressbar("value") + "%");
	// 	},
	// 	complete: function () {
	// 		progressLabel.text("Complete!");
	// 		$(".page_load").hide();
	// 	}
	// });

	// function progress() {
	// 	var val = progressbar.progressbar("value") || 0;
	// 	progressbar.progressbar("value", val + 2);
	// 	if (val < 99) {
	// 		setTimeout(progress, 80);
	// 	}
	// }
	// setTimeout(progress, 2000);
  }

}
