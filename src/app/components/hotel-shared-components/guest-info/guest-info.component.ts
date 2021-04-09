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
  childAges=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
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
  selectedChildAge;  
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
    $("body").click(function () {
      $("#add_child_open").hide();
      $("#child_su_drop_op").css('display', 'none');
    });

    $("#add_child").click(function (e) {
      e.stopPropagation();
      console.log(e.currentTarget.nextSibling.classList[1])
      if((e.target.nextSibling != null && e.target.nextSibling.classList[1] == 'panel_hide') || 
      e.currentTarget.nextSibling != null && e.currentTarget.nextSibling.classList[1] == 'panel_hide') {
        $("#add_child_open").hide();        
      }  else {
        $("#add_child_open").show();
      }
    });

    $(document).on("click",".child_sub_drop",function(e){
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
    if(typeof this.roomsGroup.rooms == 'undefined' || this.roomsGroup.rooms < 9) {
        this.roomsGroup.rooms += 1;
      this.totalPerson = this.getTotalPerson();
      this.changeValue.emit(this.roomsGroup);
    } 
  }

  removeRoom(index) {
    if(this.roomsGroup.rooms > 1 ){
      this.roomsGroup.rooms -= 1;
      this.changeValue.emit(this.roomsGroup);
      this.totalPerson = this.getTotalPerson();
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
      this.roomsGroup.children.push({type: 'child',is_show:false,age:0})
      this.totalPerson = this.getTotalPerson();
    } else if (item && item.type === 'minus' && item.label === 'child') {
      this.roomsGroup.children.pop();
      this.roomsGroup.child -=  1;
      // this.roomsGroup[item.id].children.pop();
      this.totalPerson = this.getTotalPerson();
    }
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

  toggleChildDropDown(index){
    this.roomsGroup.children[index].is_show = !this.roomsGroup.children[index].is_show;

  }

  selectChildAge(index,age){
    this.roomsGroup.children[index].age = age;
    this.roomsGroup.children[index].is_show = !this.roomsGroup.children[index].is_show;    
  }
}
