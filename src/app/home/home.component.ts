import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Statewise, CasesTimeSeries} from '../services/covidinterface.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {  AfterViewInit} from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';


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
  data = this.states;

  loading : boolean = true;
  constructor(private httpService:HttpService,private _httpClient: HttpClient,private router:Router) { }

  ngOnInit(): void {

    console.log(this.loading)
    this.subscription = timer(0, 10000).pipe(switchMap(() => this.httpService.getfullData())).subscribe(response => 
      {
        this.country = response.statewise[0];
        this.timeSeriesStates = response.cases_time_series;
        this.states =response.statewise.slice(1);
        this.data = this.states;
        this.loading = false;
      });    
  }


 


  ngAfterViewInit() {
   this.data = this.states;
  }


  rowRedirect(row, Event: MatTabChangeEvent) {
    sessionStorage.setItem("rowData", JSON.stringify(row));
    this.router.navigate(['/state-wise/stateWise']);
  }



}


