import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { HotelService } from '../../../../services/hotel.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss']
})
export class HotelDetailComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  hotelId;
  hotelDetails;
  imageTemp = [];

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
  ) { }

  ngOnInit() {

    this.galleryOptions = [
      {
        width: '100%',
        height: '400px',
        thumbnailsColumns: 1,
        image: false,
        imageAnimation: NgxGalleryAnimation.Slide,
        spinnerIcon: 'fa fa-spinner fa-pulse fa-3x fa-fw',
        imageArrows: false,
        thumbnailsArrows: false,
        imageAutoPlay: true,
        thumbnailsRemainingCount: true
      },
      {
        thumbnailsColumns: 5,
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

    this.route.params.subscribe(params => {
      if (params) {
        this.hotelId = params.id;
      }
    });
    this.hotelService.getHotelDetail(`${this.hotelId}`).subscribe((res: any) => {
      console.log(res);
      if (res && res.data) {
        this.hotelDetails = {
          name: res.data.name,
          city_name: res.data.address.city_name,
          state_code: res.data.address.state_code,
          country_name: res.data.address.country_name,
          rating: res.data.rating,
          review_rating: res.data.review_rating,
          description: res.data.description
        };
        if (res.data.images) {
          res.data.images.forEach(imageUrl => {
            this.imageTemp.push({
              small: `${imageUrl}`,
              medium: `${imageUrl}`,
              big: `${imageUrl}`,
              description: `${this.hotelDetails.name}`
            });
            this.galleryImages = this.imageTemp;
          });
        }
      }
    }, error => {
      console.log(error);
    });
  }

  counter(i: any) {
    return new Array(i);
  }

  getSearchItem(event) {
    console.log(event);
  }
}
