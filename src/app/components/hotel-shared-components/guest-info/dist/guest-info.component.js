"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GuestInfoComponent = void 0;
var core_1 = require("@angular/core");
var GuestInfoComponent = /** @class */ (function () {
    function GuestInfoComponent(route, commonFunction, eRef) {
        this.route = route;
        this.commonFunction = commonFunction;
        this.eRef = eRef;
        this.changeValue = new core_1.EventEmitter();
        this.totalRoom = [];
        this.errorMessage = '';
        this.openDrawer = false;
        this.childAges = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
        this.isShowChildDropDown = false;
        this.roomsGroup = {
            rooms: 1,
            adults: 1,
            child: 0,
            children: []
        };
        this.countryCode = this.commonFunction.getUserCountry();
    }
    GuestInfoComponent.prototype.ngOnInit = function () {
        this.loadJquery();
        if (this.route && this.route.snapshot && this.route.snapshot.queryParams && this.route.snapshot.queryParams['itenery']) {
            var info = JSON.parse(decodeURIComponent(atob(this.route.snapshot.queryParams['itenery'])));
            if (info) {
                this.roomsGroup = info;
            }
        }
        else {
            this.roomsGroup = this.roomsGroup;
        }
        this.totalPerson = this.getTotalPerson();
    };
    GuestInfoComponent.prototype.loadJquery = function () {
        $("#add_child_open").hide();
        $(document).on("click", ".child_sub_drop", function (e) {
            // e.stopPropagation();
            $(this).siblings(".child_su_drop_op").show();
            //$("#child_su_drop_op").css('display', 'flex');
        });
    };
    GuestInfoComponent.prototype.clickout = function (event) {
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
                    event.target.offsetParent.nextElementSibling.classList[1] == 'panel_hide') {
                $("#add_child_open").hide();
                this.openDrawer = false;
            }
            else {
                $("#add_child_open").show();
                this.openDrawer = true;
            }
        }
        else {
            $("#add_child_open").hide();
            this.openDrawer = false;
        }
    };
    GuestInfoComponent.prototype.toggleDrawer = function () {
        this.openDrawer = !this.openDrawer;
    };
    GuestInfoComponent.prototype.counter = function (i) {
        return new Array(i);
    };
    GuestInfoComponent.prototype.addRoom = function () {
        if (typeof this.roomsGroup.rooms == 'undefined' || this.roomsGroup.rooms < 9) {
            this.roomsGroup.rooms += 1;
            this.totalPerson = this.getTotalPerson();
            this.changeValue.emit(this.roomsGroup);
        }
    };
    GuestInfoComponent.prototype.removeRoom = function () {
        if (this.roomsGroup.rooms > 1) {
            this.roomsGroup.rooms -= 1;
            this.changeValue.emit(this.roomsGroup);
            this.totalPerson = this.getTotalPerson();
        }
        /*   if(this.roomsGroup.length > 1){
            this.roomsGroup.splice(index, 1);
            this.totalPerson = this.getTotalPerson();
            this.changeValue.emit(this.roomsGroup);
          } */
    };
    GuestInfoComponent.prototype.addRemovePerson = function (item) {
        // FOR ADULT
        if (item && item.type === 'plus' && item.label === 'adult') {
            // this.roomsGroup[item.id].adults += 1;
            this.roomsGroup.adults += 1;
            this.totalPerson = this.getTotalPerson();
        }
        else if (item && item.type === 'minus' && item.label === 'adult') {
            // this.roomsGroup[item.id].adults -= 1;
            this.roomsGroup.adults -= 1;
            this.totalPerson = this.getTotalPerson();
        }
        // FOR CHILD
        if (item && item.type === 'plus' && item.label === 'child') {
            // this.roomsGroup[item.id].child.push(1);
            this.roomsGroup.child += 1;
            this.roomsGroup.children.push({ type: 'child', is_show: false, age: 0 });
            this.totalPerson = this.getTotalPerson();
        }
        else if (item && item.type === 'minus' && item.label === 'child') {
            this.roomsGroup.children.pop();
            this.roomsGroup.child -= 1;
            // this.roomsGroup[item.id].children.pop();
            this.totalPerson = this.getTotalPerson();
        }
        this.changeValue.emit(this.roomsGroup);
    };
    GuestInfoComponent.prototype.getTotalPerson = function () {
        var total = 0;
        /*     for (let data of this.roomsGroup) {
              total += data.adults + data.child.length;
              total += data.adults + data.child;
            }
         */ return this.roomsGroup.adults + this.roomsGroup.child;
    };
    GuestInfoComponent.prototype.changeChildAge = function (age, index) {
        /*  console.log(age, index)
         this.roomsGroup.children[index].push(parseInt(age));
         this.changeValue.emit(this.roomsGroup);
         console.log(this.roomsGroup) */
    };
    GuestInfoComponent.prototype.toggleChildDropDown = function (index) {
        this.roomsGroup.children[index].is_show = !this.roomsGroup.children[index].is_show;
    };
    GuestInfoComponent.prototype.selectChildAge = function (index, age) {
        this.roomsGroup.children[index].age = age;
        this.roomsGroup.children[index].is_show = !this.roomsGroup.children[index].is_show;
    };
    __decorate([
        core_1.Output()
    ], GuestInfoComponent.prototype, "changeValue");
    __decorate([
        core_1.Input()
    ], GuestInfoComponent.prototype, "label");
    __decorate([
        core_1.HostListener('document:click', ['$event'])
    ], GuestInfoComponent.prototype, "clickout");
    GuestInfoComponent = __decorate([
        core_1.Component({
            selector: 'app-guest-info',
            templateUrl: './guest-info.component.html',
            styleUrls: ['./guest-info.component.scss']
        })
    ], GuestInfoComponent);
    return GuestInfoComponent;
}());
exports.GuestInfoComponent = GuestInfoComponent;
