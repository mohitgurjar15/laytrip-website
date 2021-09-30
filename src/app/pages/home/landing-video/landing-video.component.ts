import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

// declare var $: any;
@Component({
  selector: 'app-landing-video',
  templateUrl: './landing-video.component.html',
  styleUrls: ['./landing-video.component.scss']
})
export class LandingVideoComponent implements OnInit {
  landingPageName;
  image: any;
  s3BucketUrl=environment.s3BucketUrl
  constructor(
     private route: ActivatedRoute,   
     private translate: TranslateService
    ) { 
    translate.onLangChange.subscribe(lang => this.setLanguage());
  }

  ngOnInit(): void {
    this.landingPageName = this.route.snapshot.queryParams['utm_source']
    this.setLanguage();
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

  setLanguage() {
    const userLang: string = JSON.parse(localStorage.getItem('_lang')).iso_1Code;
    switch (userLang) {
      case "es":
        this.image = 'assets/images/infographic.jpg'
        break;
        default:
        this.image = 'assets/images/infographicEnglish.jpg'
        break;
    }
    console.log(this.image)
  }

}
