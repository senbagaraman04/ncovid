import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import {CovidData, Statewise, CasesTimeSeries} from '../services/covidinterface.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';



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

  constructor(private httpService:HttpService,private _httpClient: HttpClient) { }

  ngOnInit(): void {

    this.subscription = timer(0, 10000).pipe(switchMap(() => this.httpService.getfullData())).subscribe(response => 
      {
        this.country = response.statewise[0];
        this.timeSeriesStates = response.cases_time_series;
        this.states =response.statewise.slice(1);
        this.data = this.states;
      });    
  }


  displayedColumns: string[] = ['State','Recovered','Confirmed','Deaths','Active'];
  data = this.states;


  ngAfterViewInit() {
   this.data = this.states;
  }

}

