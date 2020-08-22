import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
declare var $ : any;
import { GenericService } from '../../services/generic.service';
import { ModuleModel, Module } from '../../model/module.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  
  modules:Module[];
  moduleList:any={};

  constructor(
    private genericService:GenericService
  ) {
   }



  ngOnInit(): void {
    
    this.getModules();
    this.loadJquery();
  } 

  

  loadJquery(){

    $('#oneway_date_picker').dateRangePicker({
      autoClose: true,
      singleDate : true,
      showShortcuts: false,
      singleMonth: true,
      format: "DD MMM'YY dddd",
      extraClass:'laytrip-datepicker'
    });

    $('#oneway_date_picker_icon').click(function(evt){
      evt.stopPropagation();
      $('#oneway_date_picker').data('dateRangePicker').open();
    });
    
    
    
    $(".featured_slid").slick({
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1
    });
  }

  /**
     * Get All module like (hotel, flight & VR)
     */
    getModules(){
      this.genericService.getModules().subscribe(
        (response:ModuleModel)=>{
          
          response.data.forEach(module=>{
            this.moduleList[module.name] = module.status; 
          })
          console.log(this.moduleList)
        },
        (error)=>{

        }
      )
    }
  
}
