import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from 'src/app/services/flight.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-extra-baggage',
  templateUrl: './extra-baggage.component.html',
  styleUrls: ['./extra-baggage.component.scss']
})
export class ExtraBaggageComponent implements OnInit {

  routeCode:string;
  @Input() flightDetail:any={};
  isLoaded:boolean=false;
  outBoundBagType:any=[];
  totalPassanger:number;
  constructor(
    private route: ActivatedRoute,
    private flightService:FlightService
  ) {
    this.routeCode=this.route.snapshot.paramMap.get('rc');
  }
  s3BucketUrl = environment.s3BucketUrl;
  ngOnInit() {
    //this.loadJs();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes",changes)
    if (typeof changes['flightDetail'].currentValue!='undefined') {
      this.isLoaded=true;
     
      this.flightDetail = changes['flightDetail'].currentValue[0];
      if(this.flightDetail.extra_service.outbound.length){

        for(let baggage of this.flightDetail.extra_service.outbound){

          if(this.outBoundBagType.findIndex(x=>x.bag_type==baggage.bag_type)==-1){

            this.outBoundBagType.push({ bag_type : baggage.bag_type, value: baggage })
          }
        }
      }

      this.totalPassanger = Number(this.flightDetail.adult_count);
      if(typeof this.flightDetail.child_count!='undefined'){
        this.totalPassanger+= Number(this.flightDetail.child_count);
      }
      if(typeof this.flightDetail.infant_count!='undefined'){
        this.totalPassanger+= Number(this.flightDetail.infant_count);
      }
    }

    
  }

  loadJs(){
    var x, i, j, l, ll, selElmnt, a, b, c;
    /*look for any elements with the class "custom - select":*/
    x = document.getElementsByClassName("custom-select");
    l = x.length;
    for (i = 0; i < l; i++) {
      selElmnt = x[i].getElementsByTagName("select")[0];
      ll = selElmnt.length;
      /*for each element, create a new DIV that will act as the selected item:*/
      a = document.createElement("DIV");
      a.setAttribute("class", "select-selected");
      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      x[i].appendChild(a);
      /*for each element, create a new DIV that will contain the option list:*/
      b = document.createElement("DIV");
      b.setAttribute("class", "select-items select-hide");
      for (j = 1; j < ll; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
          /*when an item is clicked, update the original select box,
          and the selected item:*/
          var y, i, k, s, h, sl, yl;
          s = this.parentNode.parentNode.getElementsByTagName("select")[0];
          sl = s.length;
          h = this.parentNode.previousSibling;
          for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName("same-as-selected");
              yl = y.length;
              for (k = 0; k < yl; k++) {
                y[k].removeAttribute("class");
              }
              this.setAttribute("class", "same-as-selected");
              break;
            }
          }
          h.click();
        });
        b.appendChild(c);
      }
      x[i].appendChild(b);
      a.addEventListener("click", function (e) {
        /*when the select box is clicked, close any other select boxes,
        and open/close the current select box:*/
        e.stopPropagation();
        this.closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
      });
    }
  }

  closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }

  
}
