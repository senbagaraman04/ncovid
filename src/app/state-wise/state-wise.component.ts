import { Component, OnInit } from '@angular/core';
import { Statewise, DistrictData } from '../services/covidinterface.service';
import { HttpService } from '../services/http.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { TestBed } from '@angular/core/testing';

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
  noActiveCase: boolean = false;
  recoveryRatePer: number;
  recoveryRate: number;
  growthRatePer: number;
  firstResponse: any;
  secondResponse : any;
  firstDate: string;
  secondDate: string;
  growthCard:boolean = false;
  constructor(private httpService:HttpService,private router:Router) { }

  rowData: any;
  
  ngOnInit(): void {
    this.rowData = JSON.parse(sessionStorage.getItem("rowData"));
    console.log(this.rowData);

    if(this.rowData ==null){
      this.router.navigate(['']);
    }
   

    if(this.rowData.active == 0 && this.rowData.confirmed == 0)
    {
          this.noActualCase = true;
    }
    else if(this.rowData.recovered == this.rowData.confirmed)
    {
      this.noActualCase = true;
      this.noActiveCase = true;
      this.cardData();
    }
    else
    {
      this.cardData();//Load only when they have active cases
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
       this.httpService.getStateWiseData().subscribe(particularResponse => {
        console.log(particularResponse);
      });
  }



  cardData() {

      let tday = new Date();
      tday.setDate(tday.getDate()-2)   
      
      let tenDaysBefore = new Date();
      tenDaysBefore.setDate(tday.getDate()-10);

      this.firstDate =tday.toISOString().slice(0,10);
      this.secondDate = tenDaysBefore.toISOString().slice(0,10);

      this.httpService.getFullDataonDate(this.firstDate).subscribe(element=>{
        this.firstResponse = element[this.rowData.statecode];
      });
    
      this.httpService.getFullDataonDate(this.secondDate).subscribe(element=>{
        this.secondResponse = element[this.rowData.statecode];

           let difference = this.firstResponse.total.confirmed-this.secondResponse.total.confirmed;
          let tendaysBeforeConfirmed = this.secondResponse.total.confirmed;
       this.growthRatePer =  (((difference/tendaysBeforeConfirmed)*100)/10);
       this.growthCard = true;
      })

      this.recoveryRatePer = (this.rowData.recovered / this.rowData.confirmed) * 100;

  }


  /**Search for the text in table */
 
  applyFilter(event: Event) : void {
    
         this.data.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    }
}
