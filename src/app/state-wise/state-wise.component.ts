import { Component, OnInit } from '@angular/core';
import { Statewise, DistrictData } from '../services/covidinterface.service';
import { HttpService } from '../services/http.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-state-wise',
  templateUrl: './state-wise.component.html',
  styleUrls: ['./state-wise.component.scss']
})
export class StateWiseComponent implements OnInit {
  subscription: Subscription;
  districtData: any;
  displayedColumns: string[] = ['District','Recovered','Confirmed','Deaths','Active','Percentage'];
  data= new MatTableDataSource(null);
  noActualCase: boolean = false;
  constructor(private httpService:HttpService,private router:Router) { }

  rowData: any;
  
  ngOnInit(): void {
    this.rowData = JSON.parse(sessionStorage.getItem("rowData"));
    if(this.rowData ==null){
      this.router.navigate(['']);
    }


    if(this.rowData.active == 0 && this.rowData.confirmed == 0)
    {
          this.noActualCase = true;
    }
    else
    {
      //The state may have/had active cases.
      this.subscription = timer(0, 100000).pipe(switchMap(() => this.httpService.getStateData())).subscribe(response => 
        {
            response.forEach(element => {
              if(element.statecode == this.rowData.statecode){
                this.districtData = element.districtData.splice(1);
                this.data = new MatTableDataSource(this.districtData) ;
                 this.tabledataFillup(this.districtData);
              }
            });
        }); 
    }
     
  }


  /**Data to fill up the Table */
  tabledataFillup(districtData: any) {
       this.data = new MatTableDataSource(districtData);

  }

  /**Search for the text in table */
 
  applyFilter(event: Event) : void {
    console.log((event.target as HTMLInputElement).value);
   this.data.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    }
}
