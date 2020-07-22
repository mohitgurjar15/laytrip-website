import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
import { LangunageModel, Langunage } from 'src/app/model/langunage.model';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

  langunages:Langunage[]=[];
  selectedLanunage:Langunage={ id : 0, name : '', iso_1Code:'', iso_2Code:''};

  constructor(
    private genericService:GenericService
  ) { }

  ngOnInit(): void {
      this.genericService.getAllLangunage().subscribe(
        (response:LangunageModel)=>{
          this.langunages = response.data;
          this.selectedLanunage=response.data[0];
          console.log(this.selectedLanunage.name)
        },
        (error)=>{

        }
    )
  }

  /**
   * change user lanunage
   * @param langunage 
   */
  changeLangunage(langunage:Langunage){

      if(JSON.stringify(langunage)!=JSON.stringify(this.selectedLanunage)){
        this.selectedLanunage = langunage;
        console.log(this.selectedLanunage)
      }
  }
}
