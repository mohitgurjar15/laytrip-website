import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { VacationRentalService } from '../../../../services/vacation-rental.service';
import { environment } from '../../../../../environments/environment';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

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
  lat:number;
  long:number;

  constructor(
  	private route: ActivatedRoute,
    private rentalService: VacationRentalService,) { }

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
        this.lat=Number(this.route.snapshot.queryParams.lat);
        this.long=Number(this.route.snapshot.queryParams.long);
      }
    });

     let currency = JSON.parse(localStorage.getItem('_curr'));
     let lang     =JSON.parse(localStorage.getItem('_lang'));
     let info   =JSON.parse(localStorage.getItem('_rental'));
     let payload: any = {};
      payload = {
          id: this.rentalId,
          check_in_date: info.check_in_date,
          check_out_date: info.check_out_date,
          adult_count: parseInt(info.adult_count),
          number_and_children_ages:info.number_and_children_ages,
        }; 
     //Start Service call data
      this.rentalService.getRentalDetail(lang.iso_1Code,currency.code,payload).subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.loading = false;
        this.rentalDetails = {
          name: res.property_name,
          city_name: res.city,
          country_name: res.country,
          description: res.description,
          amenities: res.amenities,
        };
        console.log(this.rentalDetails);
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
      console.log(error);
    });
     //End Service call data
  }

}
