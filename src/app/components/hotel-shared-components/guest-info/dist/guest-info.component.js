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
    function GuestInfoComponent(route, commonFunction) {
        this.route = route;
        this.commonFunction = commonFunction;
        this.changeValue = new core_1.EventEmitter();
        this.totalRoom = [];
        this.errorMessage = '';
        this.openDrawer = false;
        this.roomsGroup = [
            {
                adults: 1,
                child: [],
                children: []
            }
        ];
        this.countryCode = this.commonFunction.getUserCountry();
    }
    GuestInfoComponent.prototype.ngOnInit = function () {
        this.loadJquery();
        if (this.route && this.route.snapshot && this.route.snapshot.queryParams && this.route.snapshot.queryParams['itenery']) {
            var info = JSON.parse(atob(this.route.snapshot.queryParams['itenery']));
            if (info && info.length) {
                this.roomsGroup = info;
            }
        }
        else {
            this.roomsGroup = this.roomsGroup;
        }
        this.totalPerson = this.getTotalPerson();
    };
    GuestInfoComponent.prototype.loadJquery = function () {
        $("body").click(function () {
            $("#add_child_open").hide();
        });
        $("#add_child").click(function (e) {
            e.stopPropagation();
            if ((e.target.nextSibling != null && e.target.nextSibling.classList[1] == 'panel_hide') ||
                e.target.offsetParent.nextSibling != null && e.target.offsetParent.nextSibling.classList[2] == 'panel_hide') {
                $("#add_child_open").hide();
            }
            else {
                $("#add_child_open").show();
            }
        });
        $('#add_child_open').click(function (e) {
            e.stopPropagation();
        });
    };
    GuestInfoComponent.prototype.toggleDrawer = function () {
        this.openDrawer = !this.openDrawer;
    };
    GuestInfoComponent.prototype.counter = function (i) {
        return new Array(i);
    };
    GuestInfoComponent.prototype.addRoom = function (index) {
        this.roomsGroup.push({
            adults: 2,
            child: [],
            children: []
        });
        this.totalPerson = this.getTotalPerson();
        this.changeValue.emit(this.roomsGroup);
    };
    GuestInfoComponent.prototype.removeRoom = function (index) {
        this.roomsGroup.splice(index, 1);
        this.totalPerson = this.getTotalPerson();
        this.changeValue.emit(this.roomsGroup);
    };
    GuestInfoComponent.prototype.addRemovePerson = function (item) {
        console.log(item);
        // FOR ADULT
        if (item && item.type === 'plus' && item.label === 'adult') {
            this.roomsGroup[item.id].adults += 1;
            this.totalPerson = this.getTotalPerson();
        }
        else if (item && item.type === 'minus' && item.label === 'adult') {
            this.roomsGroup[item.id].adults -= 1;
            this.totalPerson = this.getTotalPerson();
        }
        // FOR CHILD
        if (item && item.type === 'plus' && item.label === 'child') {
            this.roomsGroup[item.id].child.push(1);
            this.totalPerson = this.getTotalPerson();
        }
        else if (item && item.type === 'minus' && item.label === 'child') {
            this.roomsGroup[item.id].child.pop();
            this.roomsGroup[item.id].children.pop();
            this.totalPerson = this.getTotalPerson();
        }
        this.changeValue.emit(this.roomsGroup);
    };
    GuestInfoComponent.prototype.getTotalPerson = function () {
        var total = 0;
        for (var _i = 0, _a = this.roomsGroup; _i < _a.length; _i++) {
            var data = _a[_i];
            total += data.adults + data.child.length;
        }
        return total;
    };
    GuestInfoComponent.prototype.changeChildAge = function (age, index) {
        this.roomsGroup[index].children.push(parseInt(age));
        this.changeValue.emit(this.roomsGroup);
    };
    __decorate([
        core_1.Output()
    ], GuestInfoComponent.prototype, "changeValue");
    __decorate([
        core_1.Input()
    ], GuestInfoComponent.prototype, "label");
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
