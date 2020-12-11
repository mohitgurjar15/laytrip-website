import { Component, OnInit } from '@angular/core';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss']
})
export class HotelDetailComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  calenderPrices: [] = [];
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor() { }

  ngOnInit() {

    this.galleryOptions = [
      {
        width: '100%',
        height: '400px',
        thumbnailsColumns: 1,
        image: false,
        imageAnimation: NgxGalleryAnimation.Slide,
      },
      {
        thumbnailsColumns: 3,
        thumbnailsRows: 1,
        thumbnailsPercent: 30,
        imagePercent: 100,
        thumbnailMargin: 3,
        thumbnailsMargin: 3
      },
      {
        breakpoint: 500,
        width: '100%',
        height: '600px'
      },
    ];

    this.galleryImages = [
      {
        small: 'http://farm9.staticflickr.com/8242/8558295633_f34a55c1c6_b.jpg',
        medium: 'http://farm9.staticflickr.com/8242/8558295633_f34a55c1c6_b.jpg',
        big: 'http://farm9.staticflickr.com/8242/8558295633_f34a55c1c6_b.jpg',
        description: 'Los Tres Ojos'
      },
      {
        small: 'http://farm9.staticflickr.com/8382/8558295631_0f56c1284f_b.jpg',
        medium: 'http://farm9.staticflickr.com/8382/8558295631_0f56c1284f_b.jpg',
        big: 'http://farm9.staticflickr.com/8382/8558295631_0f56c1284f_b.jpg',
        description: 'Bahía de las Aguilas'
      },
      {
        small: 'http://farm9.staticflickr.com/8225/8558295635_b1c5ce2794_b.jpg',
        medium: 'http://farm9.staticflickr.com/8225/8558295635_b1c5ce2794_b.jpg',
        big: 'http://farm9.staticflickr.com/8225/8558295635_b1c5ce2794_b.jpg',
        description: 'Bahía de las Aguilas'
      },
      {
        small: 'http://farm9.staticflickr.com/8383/8563475581_df05e9906d_b.jpg',
        medium: 'http://farm9.staticflickr.com/8383/8563475581_df05e9906d_b.jpg',
        big: 'http://farm9.staticflickr.com/8383/8563475581_df05e9906d_b.jpg',
        description: 'Bahía de las Aguilas'
      }
    ];

    // this.galleryImages = [
    //   {
    //     small: `${this.s3BucketUrl}assets/images/im-1.webp`,
    //     medium: `${this.s3BucketUrl}assets/images/img-1-big.webp`,
    //     big: `${this.s3BucketUrl}assets/images/img-1-big.webp`,
    //     description: 'Los Tres Ojos'
    //   },
    //   {
    //     small: `${this.s3BucketUrl}assets/images/im-2.webp`,
    //     medium: `${this.s3BucketUrl}assets/images/im-2-big.png`,
    //     big: `${this.s3BucketUrl}assets/images/im-2-big.png`,
    //     description: 'Bahía de las Aguilas'
    //   },
    //   {
    //     small: `${this.s3BucketUrl}assets/images/im-3.webp`,
    //     medium: `${this.s3BucketUrl}assets/images/im-3-big.jpg`,
    //     big: `${this.s3BucketUrl}assets/images/im-3-big.jpg`,
    //     description: 'Santo Domingo’s Colonial City'
    //   },
    //   {
    //     small: `${this.s3BucketUrl}assets/images/im-4.webp`,
    //     medium: `${this.s3BucketUrl}assets/images/im-4-web.jpg`,
    //     big: `${this.s3BucketUrl}assets/images/im-4-web.jpg`,
    //     description: 'Catalina Island'
    //   },
    //   {
    //     small: `${this.s3BucketUrl}assets/images/im-5.webp`,
    //     medium: `${this.s3BucketUrl}assets/images/im-5-big.jpg`,
    //     big: `${this.s3BucketUrl}assets/images/im-5-big.jpg`,
    //     description: 'Pico Duarte'
    //   }

    // ];
  }

  getSearchItem(event) {
    console.log(event);
  }
}
