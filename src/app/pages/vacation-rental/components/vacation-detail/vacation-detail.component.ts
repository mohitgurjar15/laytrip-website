import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { VacationRentalService } from '../../../../services/vacation-rental.service';
import { environment } from '../../../../../environments/environment';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CommonFunction } from '../../../../_helpers/common-function';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vacation-detail',
  templateUrl: './vacation-detail.component.html',
  styleUrls: ['./vacation-detail.component.scss']
})
export class VacationDetailComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  loading = false;
  rentalId;
  rentalDetails;
  imageTemp = [];
  rentalRoomData = [];
  lat: number;
  long: number;
  currency;
  lang;
  info;
  roomData;
  dataLoading = false;
  constructor(
    private route: ActivatedRoute,
    private rentalService: VacationRentalService,
    private commonFunction: CommonFunction,
    private toastr: ToastrService,
    public router: Router) { }

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
        this.rentalId = params.id;
        this.lat = Number(this.route.snapshot.queryParams.lat);
        this.long = Number(this.route.snapshot.queryParams.long);
      }
    });

    this.currency = JSON.parse(localStorage.getItem('_curr'));
    this.lang = JSON.parse(localStorage.getItem('_lang'));
    this.info = JSON.parse(localStorage.getItem('_rental'));
    let payload: any = {};
    payload = {
      id: this.rentalId,
      check_in_date: this.info.check_in_date,
      check_out_date: this.info.check_out_date,
      adult_count: parseInt(this.info.adult_count),
      number_and_children_ages: this.info.number_and_children_ages,
    };
    //Start Service call data
    this.rentalService.getRentalDetail(this.lang.iso_1Code, this.currency.code, payload).subscribe((res: any) => {
      if (res) {
        this.loading = false;
        this.rentalDetails = {
          name: res.property_name,
          city_name: res.city,
          country_name: res.country,
          description: res.description,
          amenities: res.amenities,
        };
        if (res.rooms) {
          this.rentalRoomData = res.rooms;
          this.roomData = res.rooms[0];
        }
        if (res.images) {
          res.images.forEach(imageUrl => {
            this.imageTemp.push({
              small: `${imageUrl.url}`,
              medium: `${imageUrl.url}`,
              big: `${imageUrl.url}`,
              description: `${this.rentalDetails.name}`
            });
            this.galleryImages = this.imageTemp;
          });
        }
      }

    }, error => {
      this.loading = false;
      this.toastr.error('session is expired', 'Error');
      this.router.navigate(['/']);
    });
    //End Service call data
  }

  counter(i: any) {
    return new Array(i);
  }

  showRoomDetails(roomInfo) {
    this.dataLoading = true;
    setTimeout(() => {
      this.roomData = roomInfo;
      this.dataLoading = false;
    }, 1000);
  }

}
