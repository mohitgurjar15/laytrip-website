import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { HotelService } from '../../../../services/hotel.service';
import { environment } from '../../../../../environments/environment';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':leave', [
          stagger(10, [
            animate('0.001s', style({ opacity: 0 }))
          ])
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(50, [
            animate('0.5s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ],
})
export class HotelDetailComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  hotelId;
  hotelToken;
  hotelDetails;
  hotelRoomArray = [];
  imageTemp = [];
  loading = false;
  showRoomDetails = [];
  showFareDetails: number = 0;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
  ) { }

  ngOnInit() {
    this.loading = true;
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
        this.hotelToken = params.token;
      }
    });
    this.hotelService.getHotelDetail(`${this.hotelId}`, this.hotelToken).subscribe((res: any) => {
      console.log(res);
      if (res && res.data) {
        this.loading = false;
        this.hotelDetails = {
          name: res.data.name,
          city_name: res.data.address.city_name,
          state_code: res.data.address.state_code,
          country_name: res.data.address.country_name,
          rating: res.data.rating,
          review_rating: res.data.review_rating,
          description: res.data.description,
          amenities: res.data.amenities,
          hotelLocations: res.data.geocodes,
          hotelReviews: res.data.reviews
        };
        console.log(this.hotelDetails);
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
      this.loading = false;
      console.log(error);
    });
    this.hotelService.getRoomDetails(`${this.hotelId}`, this.hotelToken).subscribe((res: any) => {
      if (res) {
        console.log(res);
        // this.hotelRoomArray = res;
      }
    });
  }

  counter(i: any) {
    return new Array(i);
  }

  showDetails(index, flag = null) {
    if (typeof this.showRoomDetails[index] === 'undefined') {
      this.showRoomDetails[index] = true;
    } else {
      this.showRoomDetails[index] = !this.showRoomDetails[index];
    }

    if (flag == 'true') {
      this.showFareDetails = 1;
    }
    else {

      this.showFareDetails = 0;
    }

    this.showRoomDetails = this.showRoomDetails.map((item, i) => {
      return ((index === i) && this.showRoomDetails[index] === true) ? true : false;
    });
  }

  closeHotelDetail() {
    this.showFareDetails = 0;
    this.showRoomDetails = this.showRoomDetails.map(item => {
      return false;
    });
  }

  logAnimation(event) {
    // console.log(event);
  }
}
