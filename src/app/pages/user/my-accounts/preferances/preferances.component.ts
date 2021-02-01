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

  loading : boolean = false;
  isEmailOn : boolean = false;
  isSmsNotifiationOn : boolean = false;
  @Output() loadingValue = new EventEmitter<boolean>();

  constructor(
    public userService:UserService,
    public toastr:ToastrService
    ) { }

  ngOnInit() {
  }


  notificationChnaged(event,type){
    this.loadingValue.emit(true); 
    var jsonBody = {
      "type":type,
      "value": event.target.checked
    };
    this.userService.changePreference(jsonBody).subscribe((data: any) => {
      this.toastr.success(data.message, 'Preference Updated');
      this.loadingValue.emit(false); 
    }, (error: HttpErrorResponse) => { 
      this.loadingValue.emit(false); 
      this.toastr.error(error.error.message, 'Preference Error');
    });
  }

  getPreference(){
    this.userService.getPreference().subscribe((data: any) => {
      this.loadingValue.emit(false); 
    }, (error: HttpErrorResponse) => { 
      this.loadingValue.emit(false); 
      this.toastr.error(error.error.message, 'Preference Error');
    });
  }

}
