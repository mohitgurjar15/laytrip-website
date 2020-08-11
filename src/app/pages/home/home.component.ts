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

      $('#two-inputs').dateRangePicker({
      separator: ' to ',
      singlemonth: false,
      time: {
          enabled: false
      },
      format: "ddd, MMM D YYYY",
      autoClose: true,
      language: 'en',
      autoUpdateInput: true,
      startDate: "08/03/2020",
      getValue: function() {
          if ($('#from_date').val() && $('#to_date').val())
              return $('#from_date').val() + ' to ' + $('#to_date').val();
          else
              return '';
      },
      setValue: function(s, s1, s2) {
          if (s1 == s2) {
              s2 = this.addDate(s1);
          }
          $('#from_date').val(s1);
          $('#to_date').val(s2);
      },
      showTopbar: true,
      customOpenAnimation: function(cb) {
          $(this).fadeIn(0, cb);
      },
      customCloseAnimation: function(cb) {
          $(this).fadeOut(0, cb);
      },
      extraClass: 'marg_top'
    });
    
      $(".features-discover").slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        centerMode: false,
        focusOnSelect: false,
        arrows: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 481,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
  }

  /**
     * Get All module like (hotel, flight & VR)
     */
    getModules(){
      this.genericService.getModules().subscribe(
        (response:ModuleModel)=>{
          
          response.data.forEach(module=>{
            this.moduleList[module.name] = module; 
          })
          console.log(this.moduleList)
        },
        (error)=>{

        }
      )
    }
  
}
