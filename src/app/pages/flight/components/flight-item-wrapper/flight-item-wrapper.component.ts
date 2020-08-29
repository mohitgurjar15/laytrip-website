import { Component, OnInit, Input, AfterContentChecked, OnDestroy } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { LayTripStateStoreService } from '../../../../state/layTripState/layTripState-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flight-item-wrapper',
  templateUrl: './flight-item-wrapper.component.html',
  styleUrls: ['./flight-item-wrapper.component.scss']
})
export class FlightItemWrapperComponent implements OnInit, AfterContentChecked, OnDestroy {

  flightList;
  s3BucketUrl = environment.s3BucketUrl;
  flightListArray = [];
  currency;

  subscriptions: Subscription[] = [];

  constructor(
    private layTripStateStoreService: LayTripStateStoreService
  ) { }

  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.loadJquery();

    this.subscriptions.push(this.layTripStateStoreService.selectFlightSearchResult().subscribe(res => {
      console.log();
      if (res) {
        if (res.items) {
          // FOR FLIGHT LIST & DETAILS
          this.flightList = res.items;
        }
      }
    }));
  }

  loadJquery() {
    $(document).on("click", ".show_detail", function (e) {
      $(this).parents('.listing_block').addClass('add_shadow');
      $(this).parents('.search_block').find('.detail_info_show').slideToggle();
    });

    $(document).on('click', function (event) {
      if (!$(event.target).closest('.search_block').length) {
        $('.detail_info_show').each(function () {
          $(this).slideUp();
          $('.listing_block').removeClass('add_shadow');
        });
      }
    });
  }

  ngAfterContentChecked() {
    this.flightListArray = this.flightList;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
