import { Component, OnInit, Output, EventEmitter, Input, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  @Output() currentChangeCounter = new EventEmitter();
  totalRoom = [];
  errorMessage = '';
  openDrawer: boolean = false;
  countryCode: string;
  childAges = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  isShowChildDropDown: boolean = false;
  roomsGroup =
    {
      rooms: 1,
      adults: 1,
      child: 0,
      children: []
    }
    ;
  totalPerson: number;
  selectedChildAge;
  progressInterval;
  counterChangeVal = 0;

  constructor(
    private route: ActivatedRoute,
    private commonFunction: CommonFunction,
    private eRef: ElementRef
  ) {
    this.countryCode = this.commonFunction.getUserCountry();
  }

  ngOnInit() {
    this.loadJquery();
    if (this.route && this.route.snapshot && this.route.snapshot.queryParams && this.route.snapshot.queryParams['itenery']) {
      const info = JSON.parse(decodeURIComponent(atob(this.route.snapshot.queryParams['itenery'])));
      if (info) {
        this.roomsGroup = info;
      }
    } else {
      this.roomsGroup = this.roomsGroup;
    }
    this.totalPerson = this.getTotalPerson();
  }

  loadJquery() {
    $("#add_child_open").hide();


    $(document).on("click", ".child_sub_drop", function (e) {
      $(this).siblings(".child_su_drop_op").show();
    })

  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
      if ((event.target.nextSibling &&
        typeof event.target.nextSibling.classList != 'undefined' &&
        event.target.nextSibling.classList != null &&
        event.target.nextSibling.classList[1] == 'panel_hide') ||
        event.currentTarget.nextSibling &&
        typeof event.currentTarget.nextSibling.classList != 'undefined' &&
        event.currentTarget.nextSibling.classList != null &&
        event.currentTarget.nextSibling.classList[1] == 'panel_hide' ||
        event.target.offsetParent.nextElementSibling &&
        typeof event.target.offsetParent.nextElementSibling.classList != 'undefined' &&
        event.target.offsetParent.nextElementSibling.classList != null &&
        event.target.offsetParent.nextElementSibling.classList[1] == 'panel_hide'

      ) {
        $("#add_child_open").hide();
        this.openDrawer = false;
      } else {
        $("#add_child_open").show();
        this.openDrawer = true;
      }
    } else {
      $("#add_child_open").hide();
      this.openDrawer = false;
    }
  }


  toggleDrawer() {
    this.openDrawer = !this.openDrawer;
    if (this.commonFunction.isRefferal()) {
      this.progressInterval = setInterval(() => {
        if (this.openDrawer) {
          this.currentChangeCounter.emit(this.counterChangeVal += 1);
        } else {
          clearInterval(this.progressInterval);
        }
      }, 1000);
    }
  }

  counter(i) {
    return new Array(i);
  }

  addRoom() {
    if (typeof this.roomsGroup.rooms == 'undefined' || this.roomsGroup.rooms < 9) {
      this.roomsGroup.rooms += 1;
      this.totalPerson = this.getTotalPerson();
      this.changeValue.emit(this.roomsGroup);
    }
  }

  removeRoom() {
    if (this.roomsGroup.rooms > 1) {
      this.roomsGroup.rooms -= 1;
      this.changeValue.emit(this.roomsGroup);
      this.totalPerson = this.getTotalPerson();
    }
  }

  addRemovePerson(item) {
    // FOR ADULT
    if (item && item.type === 'plus' && item.label === 'adult') {
      this.roomsGroup.adults += 1;
      this.totalPerson = this.getTotalPerson();
    } else if (item && item.type === 'minus' && item.label === 'adult') {
      this.roomsGroup.adults -= 1;
      this.totalPerson = this.getTotalPerson();
    }
    // FOR CHILD
    if (item && item.type === 'plus' && item.label === 'child') {
      this.roomsGroup.child += 1;
      this.roomsGroup.children.push({ type: 'child', is_show: false, age: 0 })
      this.totalPerson = this.getTotalPerson();
    } else if (item && item.type === 'minus' && item.label === 'child') {
      this.roomsGroup.children.pop();
      this.roomsGroup.child -= 1;
      this.totalPerson = this.getTotalPerson();
    }
    this.changeValue.emit(this.roomsGroup);
  }


  getTotalPerson() {
    let total = 0;
    return this.roomsGroup.adults + this.roomsGroup.child;
  }

  toggleChildDropDown(index) {
    this.roomsGroup.children[index].is_show = !this.roomsGroup.children[index].is_show;

  }

  selectChildAge(index, age) {
    this.roomsGroup.children[index].age = age;
    this.roomsGroup.children[index].is_show = !this.roomsGroup.children[index].is_show;
  }
}
