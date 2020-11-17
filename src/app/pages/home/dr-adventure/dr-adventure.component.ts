import { Component, OnInit } from '@angular/core';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dr-adventure',
  templateUrl: './dr-adventure.component.html',
  styleUrls: ['./dr-adventure.component.scss']
})
export class DrAdventureComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor() { }

  ngOnInit() {
    this.galleryOptions = [
      {
          width: '100%',
          height: '400px',
          thumbnailsColumns: 5,
          image:false,
          imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
          breakpoint: 500,
          width: '100%',
          height: '600px'
      },
      // max-width 400
      {
          breakpoint: 400,
          preview: false
      }
    ];

    this.galleryImages = [
        {
            small: `${this.s3BucketUrl}assets/images/im-1.webp`,
            medium: `${this.s3BucketUrl}assets/images/img-1-big.webp`,
            big: `${this.s3BucketUrl}assets/images/img-1-big.webp`,
            description : 'Los Tres Ojos'
        },
        {
          small: `${this.s3BucketUrl}assets/images/im-2.webp`,
          medium: `${this.s3BucketUrl}assets/images/im-2-big.png`,
          big: `${this.s3BucketUrl}assets/images/im-2-big.png`,
          description : 'Bahía de las Aguilas'
        },
        {
          small: `${this.s3BucketUrl}assets/images/im-3.webp`,
          medium: `${this.s3BucketUrl}assets/images/im-3-big.jpg`,
          big: `${this.s3BucketUrl}assets/images/im-3-big.jpg`,
          description : 'Santo Domingo’s Colonial City'
        },
        {
          small: `${this.s3BucketUrl}assets/images/im-4.webp`,
          medium: `${this.s3BucketUrl}assets/images/im-4-web.jpg`,
          big: `${this.s3BucketUrl}assets/images/im-4-web.jpg`,
          description : 'Catalina Island'
        },
        {
          small: `${this.s3BucketUrl}assets/images/im-5.webp`,
          medium: `${this.s3BucketUrl}assets/images/im-5-big.jpg`,
          big: `${this.s3BucketUrl}assets/images/im-5-big.jpg`,
          description : 'Pico Duarte'
        }
        
    ];
  }

}
