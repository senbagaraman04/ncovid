import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Statewise, CasesTimeSeries} from '../services/covidinterface.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {  AfterViewInit} from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { Chart } from 'chart.js';  
import { red } from 'color-name';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit, AfterViewInit {
  country: Statewise;
  timeSeriesStates: CasesTimeSeries[];
  states: Statewise[];
  subscription: Subscription;
  statusText: string;
  displayedColumns: string[] = ['State','Recovered','Confirmed','Deaths','Active'];
  data = new MatTableDataSource(null);
  searchText;
  loading : boolean = true;
  dailyConfirmedCases = [];
  dailyDeceasedCases = [];
  dailyRecoveredCases = [];
  linechartConfirmed: any;
  linechartRecovered: any;
  linechartDeceased: any;
  dateData = [];
  constructor(private httpService:HttpService,private router:Router) { }


  ngOnInit(): void {

    console.log(this.loading)

    this.subscription = timer(0, 10000).pipe(switchMap(() => this.httpService.getfullData())).subscribe(response => 
      {
        this.country = response.statewise[0];
        this.states =response.statewise.slice(1);
        this.data = new MatTableDataSource(this.states);
        this.loading = false;
    
      });  

      this.httpService.getfullData().subscribe(response => {
        this.timeSeriesStates = response.cases_time_series;
        this.loadGraphData();
      });
    
    
    }
  /**To load the data into Graphs */
  
  loadGraphData() : void {
    console.log(this.timeSeriesStates)
     this.timeSeriesStates.forEach(res => {
       this.dailyConfirmedCases.push(res.dailyconfirmed);
       this.dailyRecoveredCases.push(res.dailyrecovered);
       this.dailyDeceasedCases.push(res.dailydeceased);
       this.dateData.push(res.date);
       
     });
     console.log(this.dailyConfirmedCases)
     this.linechartConfirmed = new Chart('confirmed', {  
      type: 'bar',  
      data: {  
        labels: this.dateData,  
        datasets: [  
          {  
            data: this.dailyConfirmedCases,  
            borderColor: '#3cb371',  
            backgroundColor: "red",
            label: 'Confirmed'
          }               
        ]  
      },  
      options: {  
        legend: {  
          display: true,
        },  
        scales: {  
          xAxes: [{  
            display: true  
          }],  
          yAxes: [{  
            display: true  
          }],  
        }  
      }  
    });  


    this.linechartRecovered = new Chart('recovered', {  
      type: 'bar',  
      data: {  
        labels: this.dateData,  
        datasets: [  
         {
          data: this.dailyRecoveredCases,  
          label: 'Recovered',
          backgroundColor: "green", 
         }              
        ]  
      },  
      options: {  
        legend: {  
          display: true,
        },  
        scales: {  
          xAxes: [{  
            display: true  
          }],  
          yAxes: [{  
            display: true  
          }],  
        }  
      }  
    });
    
    
    this.linechartDeceased = new Chart('deceased', {  
      type: 'bar',  
      data: {  
        labels: this.dateData,  
        datasets: [  
         {
          data: this.dailyDeceasedCases,  
          label: 'Deceased',
          backgroundColor: "#0000FF", 
         }              
        ]  
      },  
      options: {  
        legend: {  
          display: true,
        },  
        scales: {  
          xAxes: [{  
            display: true  
          }],  
          yAxes: [{  
            display: true  
          }],  
        }  
      }  
    }); 
  }


 


  ngAfterViewInit(): void {
   this.data = new MatTableDataSource(this.states);

  }


  rowRedirect(row, Event: Event) : void {
    sessionStorage.setItem("rowData", JSON.stringify(row));
    this.router.navigate(['/state-wise/stateWise']);
  }


  applyFilter(event: Event) : void {
  console.log((event.target as HTMLInputElement).value);
 this.data.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }


}


