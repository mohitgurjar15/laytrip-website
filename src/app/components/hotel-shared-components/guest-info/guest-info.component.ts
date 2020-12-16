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
  errorMessage = '';
  countryCode: string;
  roomsGroup = [
    {
      adults: 2,
      child: [],
      children: []
    }
  ];
  totalPerson: number;

  constructor(
    private route: ActivatedRoute,
    private commonFunction: CommonFunction
  ) {
    this.countryCode = this.commonFunction.getUserCountry();
  }

  ngOnInit() {
    this.loadJquery();
    if (this.route && this.route.snapshot && this.route.snapshot.queryParams && this.route.snapshot.queryParams['itenery']) {
      const info = JSON.parse(atob(this.route.snapshot.queryParams['itenery']));
      if (info && info.length) {
        info.forEach(item => {
          this.roomsGroup.push({ adults: item.adults, child: item.child, children: item.children });
        });
      }
    } else {
      this.roomsGroup = this.roomsGroup;
    }
    console.log(this.roomsGroup);
    this.totalPerson = this.getTotalPerson();
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
      adults: 2,
      child: [],
      children: []
    });
    this.totalPerson = this.getTotalPerson();
    this.changeValue.emit(this.roomsGroup);
  }

  removeRoom(index) {
    this.roomsGroup.splice(index, 1);
    this.totalPerson = this.getTotalPerson();
    this.changeValue.emit(this.roomsGroup);
  }

  addRemovePerson(item) {
    // FOR ADULT
    if (item && item.type === 'plus' && item.label === 'adult') {
      this.roomsGroup[item.id].adults += 1;
      this.totalPerson = this.getTotalPerson();
    } else if (item && item.type === 'minus' && item.label === 'adult') {
      this.roomsGroup[item.id].adults -= 1;
      this.totalPerson = this.getTotalPerson();
    }
    // FOR CHILD
    if (item && item.type === 'plus' && item.label === 'child') {
      this.roomsGroup[item.id].child.push(1);
      this.totalPerson = this.getTotalPerson();
    } else if (item && item.type === 'minus' && item.label === 'child') {
      this.roomsGroup[item.id].child.pop();
      this.roomsGroup[item.id].children.pop();
      this.totalPerson = this.getTotalPerson();
    }
    this.changeValue.emit(this.roomsGroup);
  }

  getTotalPerson() {
    let total = 0;
    for (let data of this.roomsGroup) {
      total += data.adults + data.child.length;
    }
    return total;
  }

  changeChildAge(age, index) {
    this.roomsGroup[index].children.push(parseInt(age));
    this.changeValue.emit(this.roomsGroup);
  }
}
