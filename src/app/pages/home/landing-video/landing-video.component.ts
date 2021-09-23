import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// declare var $: any;
@Component({
  selector: 'app-landing-video',
  templateUrl: './landing-video.component.html',
  styleUrls: ['./landing-video.component.scss']
})
export class LandingVideoComponent implements OnInit {
  landingPageName;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.landingPageName = this.route.snapshot.queryParams['utm_source']
    // $(window).scroll(function () {
    //   $('video').each(function () {
    //     if ($(this).visible(true)) {
    //       $(this)[0].play();
    //     } else {
    //       $(this)[0].pause();
    //     }
    //   })
    // });
  }

}
