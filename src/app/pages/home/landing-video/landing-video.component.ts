import { Component, OnInit } from '@angular/core';

// declare var $: any;

@Component({
  selector: 'app-landing-video',
  templateUrl: './landing-video.component.html',
  styleUrls: ['./landing-video.component.scss']
})
export class LandingVideoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
