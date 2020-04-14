import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import {CovidData, Statewise, CasesTimeSeries} from '../services/covidinterface.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {
  country: Statewise;
  timeSeriesStates: CasesTimeSeries[];
  states: Statewise[];
  subscription: Subscription;
  statusText: string;

  constructor(private httpService:HttpService) { }

  ngOnInit(): void {

    this.subscription = timer(0, 10000).pipe(switchMap(() => this.httpService.getfullData())).subscribe(response => 
      {
        this.country = response.statewise[0];
        this.timeSeriesStates = response.cases_time_series;
        this.states =response.statewise.slice(1);
      });    
  }
}
