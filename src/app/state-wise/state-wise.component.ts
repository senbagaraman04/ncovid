import { Component, OnInit } from '@angular/core';
import { Statewise, DistrictData } from '../services/covidinterface.service';
import { HttpService } from '../services/http.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-state-wise',
  templateUrl: './state-wise.component.html',
  styleUrls: ['./state-wise.component.scss']
})
export class StateWiseComponent implements OnInit {
  subscription: Subscription;
  districtData: DistrictData;
  displayedColumns: string[] = ['District','Recovered','Confirmed','Deaths','Active'];
  data: any;
  
  constructor(private httpService:HttpService,private router:Router) { }

  rowData: any;
  
  ngOnInit(): void {
    this.rowData = JSON.parse(sessionStorage.getItem("rowData"));
    if(this.rowData ==null){
      this.router.navigate(['']);
    }

    console.log(this.rowData);
    this.subscription = timer(0, 100000).pipe(switchMap(() => this.httpService.getStateData())).subscribe(response => 
      {
          response.forEach(element => {
           // console.log(element.statecode);
            if(element.statecode == this.rowData.statecode){
              this.districtData = element.districtData.splice(1);
              this.data = this.districtData;
               this.tabledataFillup(this.districtData);
            }
          });
      });   
  }
  tabledataFillup(districtData: DistrictData) {
console.log(districtData)
 this.data = districtData;
  }

}
