import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { VacationRentalService } from '../../../services/vacation-rental.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-vacation-search',
  templateUrl: './vacation-search.component.html',
  styleUrls: ['./vacation-search.component.scss']
})
export class VacationSearchComponent implements OnInit, AfterViewChecked {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() label: string;
  @Input() tabIndex: number;
  @Input() placeHolder: string;
  @Input() defaultSelected;
  @Input() id;
  @Input() form: FormGroup;
  @Input() controlName: FormControl;
  @Output() changeValue = new EventEmitter<any>();
  @Input() defaultCity: string;
  defaultSelectedTemp;
  selectedRental: any = {};
  loading = false;
  data = [];
  recentSearchInfo:any = [];
  itemIconArray = {
    hotel: `${this.s3BucketUrl}assets/images/hotels/hotel.svg`,
    city: `${this.s3BucketUrl}assets/images/hotels/city.svg`,
  };

  constructor(  
  	private rentalService: VacationRentalService,
    public cd: ChangeDetectorRef,
    public cookieService: CookieService,) { }

  ngOnInit() {

  	if (this.defaultSelected) {
      this.data.push({
        city: this.defaultSelected.city,
        country: this.defaultSelected.country,
        id: this.defaultSelected.id,
        display_name: this.defaultSelected.display_name,
        type: this.defaultSelected.type,
      });
    }
    if (localStorage.getItem('_rental_recent')) {
      this.recentSearchInfo = JSON.parse(localStorage.getItem('_rental_recent'));
      this.data = this.recentSearchInfo.map(item => {
        return {
          city: item.city,
          country: item.country,
          id: item.id,
          display_name: item.display_name,
          type: item.type,
          recentSearches: 'Recent Searches',
          isRecentSearch: true
        }
      });
    } else {
    }

  }

  ngDocheck() {
  }

  ngAfterViewChecked() {

  }

  searchByRental(searchItem) {
    this.loading = true;
    this.rentalService.searchRentalData(searchItem).subscribe((response: any) => {
      this.data = response.map(res => {
        this.loading = false;
        return {
          id: res.id,
          display_name: res.display_name,
          type: res.type,
          city: res.city,
          country: res.country,
        };
      });
    },
      error => {
        this.loading = false;
      }
    );
  }

  onChangeSearch(event) {
    if (event.term.length > 2) {
      this.searchByRental(event.term);
    }
  }

    selectEvent(event, index) {
    if (!event) {
      this.placeHolder = this.placeHolder;
      this.defaultSelected = this.defaultSelected;
    }
    //this.selectedHotel = event;
    this.defaultSelected = [];
    this.defaultSelected = event;
    if (event && index && index === 'fromSearch1') {
      this.changeValue.emit({ key: 'fromSearch1', value: event });
      if (this.recentSearchInfo && this.recentSearchInfo.length < 3) {
        const check=this.recentSearchInfo.some(temp =>temp.id == this.defaultSelected.id)
        if(!check)
        {
         this.recentSearchInfo.unshift({id:event.id,city:event.city,country:event.country,display_name:event.display_name,type:event.type});
          localStorage.setItem('_rental_recent', JSON.stringify(this.recentSearchInfo));
        }
      }
      else{
         const check=this.recentSearchInfo.some(temp =>temp.id == this.defaultSelected.id)
        if(!check){
          this.recentSearchInfo.pop();
          this.recentSearchInfo.unshift({id:event.id,city:event.city,country:event.country,display_name:event.display_name,type:event.type});
          localStorage.setItem('_rental_recent', JSON.stringify(this.recentSearchInfo));
       }
      }
    }
  }

  onRemove(event) {
    this.selectedRental = {};
    this.defaultSelected = this.defaultSelectedTemp;
  }
}
