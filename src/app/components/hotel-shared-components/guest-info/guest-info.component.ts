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
  openDrawer : boolean = false;
  countryCode: string;
  childGroup=[];
  childAges=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  isShowChildDropDown:boolean=false;
  roomsGroup = 
    {
      rooms:1,
      adults: 1,
      child: 0,
      children: []
    }
  ;
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
        this.roomsGroup = info;
      }
    } else {
      this.roomsGroup = this.roomsGroup;
    }
    this.totalPerson = this.getTotalPerson();
  }

  loadJquery() {
    $("body").click(function () {
      $("#add_child_open").hide();
      $("#child_su_drop_op").css('display', 'none');
    });

    $("#add_child").click(function (e) {
      e.stopPropagation();
      if((e.target.nextSibling != null && e.target.nextSibling.classList[1] == 'panel_hide') || 
      e.target.offsetParent.nextSibling != null && e.target.offsetParent.nextSibling.classList[2] == 'panel_hide') {
        $("#add_child_open").hide();        
      }  else {
        $("#add_child_open").show();
      }
    });

    console.log("out");
    $(document).on("click",".child_sub_drop",function(e){
      console.log("in");
      e.stopPropagation();
      $(this).siblings(".child_su_drop_op").show();
      //$("#child_su_drop_op").css('display', 'flex');
    })
    

    $('#add_child_open').click(
      function (e) {
        e.stopPropagation();
      }
    );
    $('#child_su_drop_op').click(
      function (e) {
        e.stopPropagation();
      }
    );

  }

  toggleDrawer(){
    this.openDrawer=!this.openDrawer;
  }

  counter(i) {
    return new Array(i);
  }

  addRoom(index) {
   /*  this.roomsGroup.push({
      adults: 1,
      child: 0,
      children: 0
    });
 */
    if(this.roomsGroup.rooms < 9) {
      this.roomsGroup.rooms += 1;
      this.totalPerson = this.getTotalPerson();
      this.changeValue.emit(this.roomsGroup);
    }
  }

  removeRoom(index) {
    if(this.roomsGroup.rooms >1 ){
      this.roomsGroup.rooms -= 1;
    }
  /*   if(this.roomsGroup.length > 1){
      this.roomsGroup.splice(index, 1);
      this.totalPerson = this.getTotalPerson();
      this.changeValue.emit(this.roomsGroup);
    } */
  }

  addRemovePerson(item) {
    // FOR ADULT
    if (item && item.type === 'plus' && item.label === 'adult') {
      // this.roomsGroup[item.id].adults += 1;
      this.roomsGroup.adults += 1;
      this.totalPerson = this.getTotalPerson();
    } else if (item && item.type === 'minus' && item.label === 'adult') {
      // this.roomsGroup[item.id].adults -= 1;
      this.roomsGroup.adults -= 1;
      this.totalPerson = this.getTotalPerson();
    }
    // FOR CHILD
    if (item && item.type === 'plus' && item.label === 'child') {
      // this.roomsGroup[item.id].child.push(1);
      this.roomsGroup.child +=  1;
      this.childGroup.push('child');
      this.totalPerson = this.getTotalPerson();
    } else if (item && item.type === 'minus' && item.label === 'child') {
      this.childGroup.splice(-1,1)

      // this.childGroup.pop('child')
      // this.roomsGroup[item.id].child.pop();
      this.roomsGroup.child -=  1;
      // this.roomsGroup[item.id].children.pop();
      this.totalPerson = this.getTotalPerson();
    }
    console.log(this.childGroup)
    this.changeValue.emit(this.roomsGroup);
  }
  

  getTotalPerson() {
    let total = 0;
/*     for (let data of this.roomsGroup) {
      total += data.adults + data.child.length;
      total += data.adults + data.child;
    }
 */    return this.roomsGroup.adults + this.roomsGroup.child ;
  }

  changeChildAge(age, index) {
   /*  console.log(age, index)
    this.roomsGroup.children[index].push(parseInt(age));
    this.changeValue.emit(this.roomsGroup);
    console.log(this.roomsGroup) */
  }

  toggleChildDropDown(){
    this.isShowChildDropDown=!this.isShowChildDropDown;
  }
}
