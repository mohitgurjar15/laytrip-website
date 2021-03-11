import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-preferances',
  templateUrl: './preferances.component.html',
  styleUrls: ['./preferances.component.scss']
})
export class PreferancesComponent implements OnInit {

  loading: boolean = false;
  isEmailNotifiationOn: boolean = true;
  isSmsNotifiationOn: boolean = false;
  @Output() loadingValue = new EventEmitter<boolean>();

  constructor(
    public userService: UserService,
    public toastr: ToastrService
  ) { }

  ngOnInit() {
    // this.getPreference();
  }


  notificationChnaged(event, type) {
    this.loadingValue.emit(true);
    var jsonBody = {
      "type": type,
      "value": event.target.checked
    };
    this.userService.changePreference(jsonBody).subscribe((data: any) => {
      // this.toastr.success(data.message, 'Preference Updated');
      this.toastr.show('data.message', 'Preference Updated', {
        toastClass: 'custom_toastr',
        titleClass: 'custom_toastr_title',
        messageClass: 'custom_toastr_message',
        disableTimeOut: true
      });
      this.loadingValue.emit(false);
    }, (error: HttpErrorResponse) => {
      this.loadingValue.emit(false);
      // this.toastr.error(error.error.message, 'Preference Error');
      this.toastr.show(error.error.message, 'Preference Error', {
        toastClass: 'custom_toastr',
        titleClass: 'custom_toastr_title',
        messageClass: 'custom_toastr_message',
        disableTimeOut: true
      });
    });
  }

  getPreference() {
    this.userService.getPreference().subscribe((data: any) => {
      this.isEmailNotifiationOn = data.preference_value.email ? data.preference_value.email : false;
      this.isSmsNotifiationOn = data.preference_value.sms ? data.preference_value.sms : false;
      this.loadingValue.emit(false);
    }, (error: HttpErrorResponse) => {
      this.loadingValue.emit(false);
      // this.toastr.error(error.error.message, 'Preference Error');
      this.toastr.show(error.error.message, 'Preference Error', {
        toastClass: 'custom_toastr',
        titleClass: 'custom_toastr_title',
        messageClass: 'custom_toastr_message',
        disableTimeOut: true
      });
    });
  }

}
