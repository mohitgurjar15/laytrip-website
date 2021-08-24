import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-sort-hotel',
  templateUrl: './sort-hotel.component.html',
  styleUrls: ['./sort-hotel.component.scss']
})
export class SortHotelComponent implements OnInit {

  @ViewChild("scrollable", { static: true, read: ElementRef } as any)
  scrollbar: ElementRef;
  contentWrapper: HTMLElement;
  @Output() sortHotel = new EventEmitter<{ key: string, order: string }>();
  @Input() hotelDetails;
  locationName;
  s3BucketUrl = environment.s3BucketUrl;
  sortType: string = 'lh_price';
  lowToHighToggle: boolean = false;

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    if (this.route.snapshot.queryParams['location']) {
      const info = JSON.parse(decodeURIComponent(atob(this.route.snapshot.queryParams['location'])));
      if (info) {
        this.locationName = info.city;
      }
    }
    this.loadJquery();
  }

  loadJquery() {
    // Start filter Shortby js
    $(document).on('show', '#accordion', function (e) {
      $(e.target).prev('.accordion-heading').addClass('accordion-opened');
    });

    $(document).on('hide', '#accordion', function (e) {
      $(this).find('.accordion-heading').not($(e.target)).removeClass('accordion-opened');
    });
  }

  sortHotelData(key, order, name) {
    this.sortType = name;
    this.sortHotel.emit({ key, order });
  }
  closeModal() {
    $('#sort_mob_modal').modal('hide');
  }
  resetSorting(key, order) {
    this.sortType = 'lh_price';
    this.sortHotel.emit({ key, order });
  }

  toggleLowToHigh() {
    this.lowToHighToggle = !this.lowToHighToggle;
  }

}
