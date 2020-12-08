import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Key } from 'protractor';
import { CommonFunction } from '../../../_helpers/common-function';
declare var $: any;

@Component({
  selector: 'app-guest-info',
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.scss']
})
export class GuestInfoComponent implements OnInit {

  @Output() changeValue = new EventEmitter<any>();
  @Input() label;

  totalRoom = [];
  errorMessage: string = '';
  countryCode: string;
  roomsGroup = [
    {
      id: 0,
      adultValue: 2,
      childValue: 0
    }
  ];
  occupanciesInfoTemp = [{
    adults: 2,
    children: [],
  }];
  occupanciesInfo = [{
    adults: 2,
    children: [],
  }];
  totalPerson: number;
  roomIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private commonFunction: CommonFunction
  ) {
    // this.adultValue = parseInt(this.route.snapshot.queryParams['adult']) ? parseInt(this.route.snapshot.queryParams['adult']) : 1;
    // this.childValue = parseInt(this.route.snapshot.queryParams['child']) ? parseInt(this.route.snapshot.queryParams['child']) : 0;
    this.roomsGroup.forEach((i) => {
      this.totalPerson = i.adultValue + i.childValue;
    });
    this.countryCode = this.commonFunction.getUserCountry();
  }

  ngOnInit() {
    this.loadJquery();
  }

  loadJquery() {
    $("body").click(function () {
      $("#add_child_open").hide("slow");
    });

    $("#add_child").click(function (e) {
      e.stopPropagation();
      $("#add_child_open").slideToggle("slow");
    });

    $('#add_child_open').click(
      function (e) {
        e.stopPropagation();
      }
    );

  }

  counter(i: number) {
    return new Array(i);
  }

  addRoom(index) {
    this.roomsGroup.push({
      id: index + 1,
      adultValue: 2,
      childValue: 0
    });
    this.roomIndex = index++;
    console.log(this.roomsGroup);
  }

  removeRoom(index) {
    this.roomsGroup.splice(index, 1);
    this.roomIndex--;
    console.log(this.roomsGroup);
  }

  addRemovePerson(item) {
    this.roomsGroup.forEach((i) => {
      if (item) {
        // FOR ADULT
        this.roomsGroup.forEach((i) => {
          if (item && item.type === 'minus' && item.label === 'adult') {
            i.adultValue = i.adultValue - 1;
          } else if (item && item.type === 'plus' && item.label === 'adult') {
            i.adultValue = i.adultValue + 1;
          }
          this.totalPerson = i.adultValue + i.childValue;
          this.changeValue.emit(this.occupanciesInfoTemp);
        });
      }
      // FOR CHILD
      if (item) {
        this.roomsGroup.forEach((i) => {
          if (item && item.type === 'minus' && item.label === 'child') {
            i.childValue = i.childValue - 1;
            if (i.childValue === 4 || i.childValue < 4) {
              this.errorMessage = '';
            }
            this.occupanciesInfoTemp.forEach((oc) => {
              if (i.childValue === 0) {
                oc.children = [];
              } else {
                oc.children.pop();
              }
            });
          } else if (item && item.type === 'plus' && item.label === 'child') {
            i.childValue = i.childValue + 1;
            if (i.childValue > 4) {
              this.errorMessage = 'Maximum number of passengers all together should not exceed 4 except child.';
            }
            this.occupanciesInfoTemp.forEach((oc) => {
              if (i.childValue === 0) {
                oc.children = [];
              } else {
                oc.children.push(1);
              }
            });
          }
        });
        this.totalPerson = i.adultValue + i.childValue;
        this.changeValue.emit(this.occupanciesInfoTemp);
      }
    });
  }

  changeChildAge(age) {
    this.occupanciesInfo.forEach((oc) => {
      oc.children.push(parseInt(age));
    });
    console.log(this.occupanciesInfo);
  }

  // room2btnClickForChange(item) {
  //   // FOR ADULT
  //   if (item && item.type === 'minus' && item.label === 'adult') {

  //     if (this.adultValue - 1 < this.childValue) {
  //       this.errorMessage = "Infant count should be less than Adults.";
  //       return false;
  //     } else {
  //       this.errorMessage = '';
  //     }
  //     this.adultValue = this.adultValue - 1;
  //   } else if (item && item.type === 'plus' && item.label === 'adult') {
  //     if (this.adultValue + 1 + this.childValue > 9) {
  //       this.errorMessage = "Maximum number of passengers all together should not exceed 9 except infants.";
  //       return;
  //     } else {
  //       this.errorMessage = '';
  //     }
  //     this.adultValue = this.adultValue + 1;

  //   }
  //   // FOR CHILD
  //   if (item && item.type === 'minus' && item.label === 'child') {
  //     if (this.adultValue + this.childValue - 1 < 9) {
  //       this.errorMessage = '';
  //     } else {
  //       this.errorMessage = "Maximum number of passengers all together should not exceed 9 except infants.";
  //       return;
  //     }
  //     this.childValue = this.childValue - 1;
  //   } else if (item && item.type === 'plus' && item.label === 'child') {
  //     if (this.adultValue + this.childValue + 1 > 9) {
  //       this.errorMessage = "Maximum number of passengers all together should not exceed 9 except infants.";
  //       return;
  //     } else {
  //       this.errorMessage = '';
  //     }
  //     this.childValue = this.childValue + 1;
  //   }

  //   this.totalPerson = this.adultValue + this.childValue;

  //   // this.occupanciesInfoTemp = {
  //   //   adult: this.adultValue,
  //   //   child: this.childValue,
  //   //   totalPerson: this.totalPerson
  //   // };
  //   this.changeValue.emit(this.occupanciesInfoTemp);
  // }
}
